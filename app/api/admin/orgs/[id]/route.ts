import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  requireAdminFresh,
  AuthError,
} from "@/lib/auth";
import { CAPABILITY_FIELDS } from "@/lib/constants";

export const runtime = "edge";

const ORG_EDITABLE_FIELDS = [
  "name",
  "org_type",
  "species",
  "focus",
  "specialty",
  "c3_status",
  "city",
  "county",
  "state",
  "service_area",
  "region",
  "statewide",
  "intake_status",
  "intake_restrictions",
  "intake_form_url",
  "website",
  "social_media",
  "public_email",
  "public_phone",
  "resource_status",
  "last_verified",
  "notes",
];

const CAP_FIELD_KEYS = new Set(
  CAPABILITY_FIELDS.map((f) => f.key)
);

/* =========================================================
   GET ORGANIZATION
========================================================= */

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await requireAdminFresh();

    const { id } = await params;

    const rows = await sql`
      select
        o.*,
        c.*,
        exists (
          select 1 from organization_memberships membership
          where membership.org_id = o.id
            and membership.status = 'active'
            and membership.access_level = 'owner'
        ) as has_active_owner,
        (
          select account.email
          from organization_memberships membership
          join users account on account.id = membership.user_id
          where membership.org_id = o.id
            and membership.status = 'active'
            and membership.access_level = 'owner'
          limit 1
        ) as active_owner_email
      from organizations o
      left join capabilities c
        on c.org_id = o.id
      where o.id = ${id}
    `;

    if (!rows[0]) {
      return NextResponse.json(
        {
          error: "Organization not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      organization: rows[0],
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: err.status,
        }
      );
    }

    console.error(
      "GET /api/admin/orgs/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load organization.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH
   - normal field edits
   - archive
   - restore
========================================================= */

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const admin = await requireAdminFresh();

    const { id: orgId } = await params;

    const body = await req
      .json()
      .catch(() => null);

    const ownershipRows = await sql`
      select exists (
        select 1 from organization_memberships
        where org_id = ${orgId}
          and status = 'active'
          and access_level = 'owner'
      ) as claimed
    `;
    const claimed = Boolean(ownershipRows[0]?.claimed);

    /* -----------------------------------------------------
       ARCHIVE
    ----------------------------------------------------- */

    if (body?.action === "archive") {
      if (claimed) {
        return NextResponse.json({ error: "Claimed organizations cannot be archived from the general editor. Use a documented closure or dormant-organization review case." }, { status: 403 });
      }
      const rows = await sql`
        update organizations
        set
          archived_at = now(),
          updated_at = now()
        where id = ${orgId}
        returning
          id,
          name,
          archived_at
      `;

      if (!rows[0]) {
        return NextResponse.json(
          {
            error: "Organization not found.",
          },
          {
            status: 404,
          }
        );
      }

      try {
        await sql`
          insert into update_log (
            org_id,
            changed_by,
            field_name,
            old_value,
            new_value,
            source
          )
          values (
            ${orgId},
            ${admin.id},
            'archived_at',
            null,
            ${String(rows[0].archived_at)},
            'admin_direct'
          )
        `;
      } catch (logErr) {
        console.error(
          "Archive update log failed:",
          logErr
        );
      }

      return NextResponse.json({
        organization: rows[0],
        archived: true,
      });
    }

    /* -----------------------------------------------------
       RESTORE
    ----------------------------------------------------- */

    if (body?.action === "restore") {
      const rows = await sql`
        update organizations
        set
          archived_at = null,
          updated_at = now()
        where id = ${orgId}
        returning
          id,
          name,
          archived_at
      `;

      if (!rows[0]) {
        return NextResponse.json(
          {
            error: "Organization not found.",
          },
          {
            status: 404,
          }
        );
      }

      try {
        await sql`
          insert into update_log (
            org_id,
            changed_by,
            field_name,
            old_value,
            new_value,
            source
          )
          values (
            ${orgId},
            ${admin.id},
            'archived_at',
            'archived',
            null,
            'admin_direct'
          )
        `;
      } catch (logErr) {
        console.error(
          "Restore update log failed:",
          logErr
        );
      }

      return NextResponse.json({
        organization: rows[0],
        restored: true,
      });
    }

    /* -----------------------------------------------------
       NORMAL EDITS
    ----------------------------------------------------- */

    const changes = body?.changes;

    if (
      !Array.isArray(changes) ||
      changes.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "A non-empty changes array is required.",
        },
        {
          status: 400,
        }
      );
    }

    const assistance = body?.adminAssistance;
    const assistanceReason = typeof assistance?.reason === "string" ? assistance.reason.trim().slice(0, 2000) : "";
    const supportReference = typeof assistance?.supportReference === "string" ? assistance.supportReference.trim().slice(0, 200) : "";
    const ownerRequestConfirmed = assistance?.ownerRequestConfirmed === true;

    if (claimed && (!ownerRequestConfirmed || assistanceReason.length < 20 || supportReference.length < 3)) {
      return NextResponse.json({ error: "This organization is owner-controlled. Confirm the owner's request, enter its support reference, and explain the assistance before editing." }, { status: 403 });
    }

    const applied: string[] = [];

    for (const change of changes) {
      const {
        table,
        field,
        newValue,
      } = change ?? {};

      /* ===================================================
         ORGANIZATION FIELD
      =================================================== */

      if (table === "organizations") {
        if (
          !ORG_EDITABLE_FIELDS.includes(field)
        ) {
          return NextResponse.json(
            {
              error: `Unknown organization field: ${field}`,
            },
            {
              status: 400,
            }
          );
        }

        const currentRows = await sql`
          select
            case ${field}
              when 'name'
                then name::text
              when 'org_type'
                then org_type::text
              when 'species'
                then array_to_string(species, ', ')
              when 'focus'
                then focus::text
              when 'specialty'
                then specialty::text
              when 'c3_status'
                then c3_status::text
              when 'city'
                then city::text
              when 'county'
                then county::text
              when 'state'
                then state::text
              when 'service_area'
                then service_area::text
              when 'region'
                then region::text
              when 'statewide'
                then statewide::text
              when 'intake_status'
                then intake_status::text
              when 'intake_restrictions'
                then intake_restrictions::text
              when 'intake_form_url'
                then intake_form_url::text
              when 'website'
                then website::text
              when 'social_media'
                then social_media::text
              when 'public_email'
                then public_email::text
              when 'public_phone'
                then public_phone::text
              when 'resource_status'
                then resource_status::text
              when 'last_verified'
                then last_verified::text
              when 'notes'
                then notes::text
              else null
            end as val
          from organizations
          where id = ${orgId}
        `;

        if (!currentRows[0]) {
          return NextResponse.json(
            {
              error: "Organization not found.",
            },
            {
              status: 404,
            }
          );
        }

        const oldValue =
          currentRows[0].val ?? null;

        /* -----------------------------------------------
           SPECIES
        ----------------------------------------------- */

        if (field === "species") {
          const speciesValue = String(
            newValue ?? ""
          )
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          await sql`
            update organizations
            set
              species = ${speciesValue},
              updated_at = now()
            where id = ${orgId}
          `;
        }

        /* -----------------------------------------------
           LAST VERIFIED DATE
        ----------------------------------------------- */

        else if (
          field === "last_verified"
        ) {
          const dateValue =
            newValue == null ||
            String(newValue).trim() === ""
              ? null
              : String(newValue);

          await sql`
            update organizations
            set
              last_verified = ${dateValue}::date,
              updated_at = now()
            where id = ${orgId}
          `;
        }

        /* -----------------------------------------------
           STANDARD TEXT FIELDS
        ----------------------------------------------- */

        else {
          const textValue =
            newValue == null ||
            String(newValue) === ""
              ? null
              : String(newValue);

          await sql`
            update organizations
            set
              name =
                case
                  when ${field} = 'name'
                    then ${textValue}
                  else name
                end,

              org_type =
                case
                  when ${field} = 'org_type'
                    then ${textValue}
                  else org_type
                end,

              focus =
                case
                  when ${field} = 'focus'
                    then ${textValue}
                  else focus
                end,

              specialty =
                case
                  when ${field} = 'specialty'
                    then ${textValue}
                  else specialty
                end,

              c3_status =
                case
                  when ${field} = 'c3_status'
                    then ${textValue}
                  else c3_status
                end,

              city =
                case
                  when ${field} = 'city'
                    then ${textValue}
                  else city
                end,

              county =
                case
                  when ${field} = 'county'
                    then ${textValue}
                  else county
                end,

              state =
                case
                  when ${field} = 'state'
                    then ${textValue}
                  else state
                end,

              service_area =
                case
                  when ${field} = 'service_area'
                    then ${textValue}
                  else service_area
                end,

              region =
                case
                  when ${field} = 'region'
                    then ${textValue}
                  else region
                end,

              statewide =
                case
                  when ${field} = 'statewide'
                    then ${textValue}
                  else statewide
                end,

              intake_status =
                case
                  when ${field} = 'intake_status'
                    then ${textValue}
                  else intake_status
                end,

              intake_restrictions =
                case
                  when ${field} = 'intake_restrictions'
                    then ${textValue}
                  else intake_restrictions
                end,

              intake_form_url =
                case
                  when ${field} = 'intake_form_url'
                    then ${textValue}
                  else intake_form_url
                end,

              website =
                case
                  when ${field} = 'website'
                    then ${textValue}
                  else website
                end,

              social_media =
                case
                  when ${field} = 'social_media'
                    then ${textValue}
                  else social_media
                end,

              public_email =
                case
                  when ${field} = 'public_email'
                    then ${textValue}
                  else public_email
                end,

              public_phone =
                case
                  when ${field} = 'public_phone'
                    then ${textValue}
                  else public_phone
                end,

              resource_status =
                case
                  when ${field} = 'resource_status'
                    then ${textValue}
                  else resource_status
                end,

              notes =
                case
                  when ${field} = 'notes'
                    then ${textValue}
                  else notes
                end,

              updated_at = now()

            where id = ${orgId}
          `;
        }

        /* -----------------------------------------------
           AUDIT LOG
        ----------------------------------------------- */

        await sql`
          insert into update_log (
            org_id,
            changed_by,
            field_name,
            old_value,
            new_value,
            source
          )
          values (
            ${orgId},
            ${admin.id},
            ${field},
            ${
              oldValue == null
                ? null
                : String(oldValue)
            },
            ${
              newValue == null
                ? null
                : String(newValue)
            },
            'admin_direct'
          )
        `;

        applied.push(field);
        continue;
      }

      /* ===================================================
         CAPABILITY FIELD
      =================================================== */

      if (table === "capabilities") {
        if (!CAP_FIELD_KEYS.has(field)) {
          return NextResponse.json(
            {
              error: `Unknown capability field: ${field}`,
            },
            {
              status: 400,
            }
          );
        }

        /*
         New organizations may not have a
         capabilities record yet.
        */

        await sql`
          insert into capabilities (
            org_id
          )
          values (
            ${orgId}
          )
          on conflict (org_id)
          do nothing
        `;

        const value = String(
          newValue ?? "Unknown"
        );

        await sql`
          update capabilities
          set
            owner_surrender =
              case
                when ${field} = 'owner_surrender'
                  then ${value}
                else owner_surrender
              end,

            shelter_pull =
              case
                when ${field} = 'shelter_pull'
                  then ${value}
                else shelter_pull
              end,

            stray_found =
              case
                when ${field} = 'stray_found'
                  then ${value}
                else stray_found
              end,

            emergency_medical =
              case
                when ${field} = 'emergency_medical'
                  then ${value}
                else emergency_medical
              end,

            cruelty_neglect =
              case
                when ${field} = 'cruelty_neglect'
                  then ${value}
                else cruelty_neglect
              end,

            behavioral =
              case
                when ${field} = 'behavioral'
                  then ${value}
                else behavioral
              end,

            senior =
              case
                when ${field} = 'senior'
                  then ${value}
                else senior
              end,

            special_needs =
              case
                when ${field} = 'special_needs'
                  then ${value}
                else special_needs
              end,

            neonatal =
              case
                when ${field} = 'neonatal'
                  then ${value}
                else neonatal
              end,

            pregnant_nursing =
              case
                when ${field} = 'pregnant_nursing'
                  then ${value}
                else pregnant_nursing
              end,

            breed_specific =
              case
                when ${field} = 'breed_specific'
                  then ${value}
                else breed_specific
              end,

            wildlife =
              case
                when ${field} = 'wildlife'
                  then ${value}
                else wildlife
              end,

            farm_equine =
              case
                when ${field} = 'farm_equine'
                  then ${value}
                else farm_equine
              end,

            transport =
              case
                when ${field} = 'transport'
                  then ${value}
                else transport
              end,

            temporary_foster =
              case
                when ${field} = 'temporary_foster'
                  then ${value}
                else temporary_foster
              end,

            pet_retention =
              case
                when ${field} = 'pet_retention'
                  then ${value}
                else pet_retention
              end,

            updated_at = now()

          where org_id = ${orgId}
        `;

        await sql`
          insert into update_log (
            org_id,
            changed_by,
            field_name,
            old_value,
            new_value,
            source
          )
          values (
            ${orgId},
            ${admin.id},
            ${field},
            null,
            ${value},
            'admin_direct'
          )
        `;

        applied.push(field);
        continue;
      }

      return NextResponse.json(
        {
          error: `Unknown table: ${table}`,
        },
        {
          status: 400,
        }
      );
    }

    if (claimed) {
      await sql`
        insert into organization_admin_assistance_audit (
          org_id, actor_user_id, owner_request_confirmed,
          support_reference, reason, changes
        ) values (
          ${orgId}, ${admin.id}, true,
          ${supportReference}, ${assistanceReason}, ${JSON.stringify(changes)}::jsonb
        )
      `;
    }

    return NextResponse.json({
      ok: true,
      applied,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: err.status,
        }
      );
    }

    console.error(
      "PATCH /api/admin/orgs/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong saving organization changes.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE ORGANIZATION

   Permanent deletion is intended for accidental/test orgs.
   Real organizations with history should be archived.
========================================================= */

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await requireAdminFresh();

    const { id: orgId } = await params;

    /* -----------------------------------------------------
       CONFIRM ORGANIZATION EXISTS
    ----------------------------------------------------- */

    const orgRows = await sql`
      select
        id,
        name,
        exists (
          select 1 from organization_memberships membership
          where membership.org_id = organizations.id
            and membership.status = 'active'
            and membership.access_level = 'owner'
        ) as claimed
      from organizations
      where id = ${orgId}
      limit 1
    `;

    if (!orgRows[0]) {
      return NextResponse.json(
        {
          error: "Organization not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (orgRows[0].claimed) {
      return NextResponse.json({ error: "Claimed organizations cannot be permanently deleted. Use a documented closure or dormant-organization review process." }, { status: 403 });
    }

    /* -----------------------------------------------------
       CHECK IMPORTANT DEPENDENCIES
    ----------------------------------------------------- */

    const users = await sql`
      select count(*)::int as count
      from users
      where org_id = ${orgId}
    `;

    const animals = await sql`
      select count(*)::int as count
      from animals
      where current_org_id = ${orgId}
    `;

    const requests = await sql`
      select count(*)::int as count
      from organization_requests
      where created_org_id = ${orgId}
    `;

    const dependencies = {
      users: Number(
        users[0]?.count ?? 0
      ),

      animals: Number(
        animals[0]?.count ?? 0
      ),

      organizationRequests: Number(
        requests[0]?.count ?? 0
      ),
    };

    const blockingCount =
      dependencies.users +
      dependencies.animals +
      dependencies.organizationRequests;

    /*
     If an org has operational history, do
     not allow permanent deletion.
    */

    if (blockingCount > 0) {
      return NextResponse.json(
        {
          error:
            "This organization has linked records and cannot be permanently deleted. Archive it instead.",
          dependencies,
        },
        {
          status: 409,
        }
      );
    }

    /* -----------------------------------------------------
       CLEAN NON-ESSENTIAL DEPENDENCIES
    ----------------------------------------------------- */

    await sql`
      delete from capabilities
      where org_id = ${orgId}
    `;

    await sql`
      delete from update_log
      where org_id = ${orgId}
    `;

    /* -----------------------------------------------------
       DELETE ORGANIZATION
    ----------------------------------------------------- */

    await sql`
      delete from organizations
      where id = ${orgId}
    `;

    return NextResponse.json({
      ok: true,
      deletedOrganization: {
        id: orgRows[0].id,
        name: orgRows[0].name,
      },
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: err.status,
        }
      );
    }

    console.error(
      "DELETE /api/admin/orgs/[id] failed:",
      err
    );

    /*
     A foreign-key dependency we have not
     explicitly accounted for may still
     prevent deletion. That is intentional:
     we would rather refuse a delete than
     erase related data.
    */

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't delete organization. Archive it instead.",
      },
      {
        status: 500,
      }
    );
  }
}
