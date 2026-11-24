import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isCarePartnerOrganization, isRescueManagerOrganization, isShelterExpressOrganization } from "@/lib/organization-types";
import { carePartnerAccessLevel, canPerformAssignedCare } from "@/lib/care-partner-access";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Bucket = { put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }): Promise<unknown>; get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer>; httpMetadata?: { contentType?: string } } | null>; delete(key: string): Promise<void> };
type Env = { MEDICAL_FILES: Bucket };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 10 * 1024 * 1024;

async function documentContext(assignmentId: string, write = false) {
  if (!UUID.test(assignmentId)) throw new AuthError("Assignment not found.", 404);
  const { session, orgId } = await requireEffectiveOrg();
  const orgs = await sql`select org_type, care_partner_review_status from organizations where id = ${orgId}::uuid and archived_at is null limit 1`;
  const organization = orgs[0];
  if (!organization) throw new AuthError("Organization access required.", 403);
  const carePartner = isCarePartnerOrganization(organization.org_type);
  const manager = isRescueManagerOrganization(organization.org_type) || isShelterExpressOrganization(organization.org_type);
  if (!carePartner && !manager) throw new AuthError("Assignment document access is unavailable.", 403);
  if (carePartner && organization.care_partner_review_status !== "verified") throw new AuthError("Verified Care Partner access is required.", 403);
  const accessLevel = carePartner ? await carePartnerAccessLevel(session.id, orgId, session.role === "admin") : null;
  if (carePartner && !accessLevel) throw new AuthError("Active Care Partner membership is required.", 403);
  const rows = await sql`
    select assignment.id, assignment.animal_id, assignment.status, assignment.expires_at,
      assignment.can_upload_documents, relationship.status as relationship_status,
      relationship.care_partner_org_id, relationship.partner_org_id,
      provider.name as care_partner_name
    from care_partner_animal_assignments assignment
    join care_partner_relationships relationship on relationship.id = assignment.relationship_id
    join organizations provider on provider.id = relationship.care_partner_org_id
    where assignment.id = ${assignmentId}::uuid
      and (${orgId}::uuid = relationship.care_partner_org_id or ${orgId}::uuid = relationship.partner_org_id)
    limit 1
  `;
  const assignment = rows[0];
  if (!assignment) throw new AuthError("Assignment not found.", 404);
  if (write && (!carePartner || !canPerformAssignedCare(accessLevel) || assignment.care_partner_org_id !== orgId || assignment.status !== "active" || assignment.relationship_status !== "active" || assignment.can_upload_documents !== true || new Date(assignment.expires_at).getTime() <= Date.now())) {
    throw new AuthError("This assignment does not include active permission to upload documents.", 403);
  }
  return { session, orgId, carePartner, manager, assignment, accessLevel };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await documentContext(id);
    const documentId = request.nextUrl.searchParams.get("documentId")?.trim() || "";
    if (documentId) {
      if (!UUID.test(documentId)) return NextResponse.json({ error: "Document not found." }, { status: 404 });
      const rows = await sql`
        select document.storage_key, document.original_filename, document.content_type
        from care_partner_assignment_documents link
        join animal_documents document on document.id = link.animal_document_id
        where link.assignment_id = ${id}::uuid and document.id = ${documentId}::uuid
        limit 1
      `;
      const document = rows[0];
      if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });
      const bucket = (getRequestContext().env as Env).MEDICAL_FILES;
      if (!bucket) return NextResponse.json({ error: "Animal file storage is not configured." }, { status: 500 });
      const object = await bucket.get(document.storage_key);
      if (!object) return NextResponse.json({ error: "Stored document could not be found." }, { status: 404 });
      return new NextResponse(await object.arrayBuffer(), { headers: { "Content-Type": document.content_type || object.httpMetadata?.contentType || "application/octet-stream", "Content-Disposition": `attachment; filename="${safeHeaderFilename(document.original_filename)}"`, "Cache-Control": "private, no-store" } });
    }
    const documents = await sql`
      select document.id, document.title, document.category, document.document_date,
        document.notes, document.original_filename, document.content_type,
        document.file_size, document.created_at, uploader.email as uploaded_by_email
      from care_partner_assignment_documents link
      join animal_documents document on document.id = link.animal_document_id
      join users uploader on uploader.id = link.uploaded_by
      where link.assignment_id = ${id}::uuid
      order by document.created_at desc
    `;
    return NextResponse.json({ documents }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Assignment documents could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let storageKey = "";
  let bucket: Bucket | null = null;
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    const { id } = await params;
    const { session, assignment } = await documentContext(id, true);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose a PDF, JPG, PNG, or WebP file." }, { status: 400 });
    if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Only PDF, JPG, PNG, and WebP files are allowed." }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_SIZE) return NextResponse.json({ error: "File must be 10 MB or smaller." }, { status: 400 });
    const title = clean(form.get("title")) || file.name;
    const category = clean(form.get("category")) || "care_partner_record";
    const notes = clean(form.get("notes"));
    const date = clean(form.get("documentDate"));
    if (title.length > 200 || notes.length > 2000 || (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))) return NextResponse.json({ error: "Check the document title, date, and notes." }, { status: 400 });
    storageKey = ["animals", assignment.partner_org_id, assignment.animal_id, "care-partner", id, crypto.randomUUID(), sanitizeFilename(file.name)].join("/");
    bucket = (getRequestContext().env as Env).MEDICAL_FILES;
    if (!bucket) return NextResponse.json({ error: "Animal file storage is not configured." }, { status: 500 });
    await bucket.put(storageKey, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { assignmentId: id, animalId: assignment.animal_id, originalFilename: file.name } });
    const rows = await sql`
      with document as (
        insert into animal_documents (animal_id, org_id, title, category, document_date, source, notes, storage_key, original_filename, content_type, file_size, visibility, uploaded_by)
        values (${assignment.animal_id}::uuid, ${assignment.partner_org_id}::uuid, ${title}, ${category}, ${date || null}::date, ${assignment.care_partner_name}, ${notes || null}, ${storageKey}, ${file.name}, ${file.type}, ${file.size}, 'private', ${session.id}::uuid)
        returning id
      ), linked as (
        insert into care_partner_assignment_documents (assignment_id, animal_document_id, uploaded_by)
        select ${id}::uuid, document.id, ${session.id}::uuid from document
        returning animal_document_id
      )
      insert into care_partner_animal_assignment_events (assignment_id, event_type, note, actor_user_id)
      select ${id}::uuid, 'document_uploaded', 'Private document ' || linked.animal_document_id::text || ' uploaded under the assignment.', ${session.id}::uuid from linked
      returning note
    `;
    if (!rows[0]) throw new Error("Document record was not created.");
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (storageKey && bucket) await bucket.delete(storageKey).catch(() => undefined);
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The document could not be uploaded." }, { status: 500 });
  }
}

function clean(value: FormDataEntryValue | null) { return typeof value === "string" ? value.trim() : ""; }
function sanitizeFilename(value: string) { return value.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "document"; }
function safeHeaderFilename(value: string) { return value.replace(/[\r\n"\\]/g, "_").slice(0, 160) || "document"; }
