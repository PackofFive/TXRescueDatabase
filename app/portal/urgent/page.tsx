export const runtime = "edge";

export default function Page() {
  return (
    <section
      style={{
        maxWidth: 900,
        margin: "20px auto",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: ".08em",
          color: "#6B6862",
          margin: 0,
        }}
      >
        RESCUE MANAGER · NETWORKING
      </p>

      <h1
        style={{
          fontSize: 32,
          color: "#17233C",
          margin: "7px 0 8px",
        }}
      >
        Urgent Shelter Animals
      </h1>

      <p
        style={{
          color: "#6B6862",
          lineHeight: 1.65,
          maxWidth: 720,
          marginTop: 0,
        }}
      >
        Review animals currently in shelter custody that need rescue
        placement, foster support, medical assistance, transfer, or other
        urgent intervention.
      </p>

      <div
        style={{
          marginTop: 24,
          padding: 18,
          background: "#FFF8F5",
          border: "1px solid #F0D3C9",
          borderRadius: 10,
        }}
      >
        <strong
          style={{
            color: "#17233C",
          }}
        >
          These animals are not currently in your organization&apos;s care.
        </strong>

        <p
          style={{
            color: "#6B6862",
            lineHeight: 1.6,
            margin: "7px 0 0",
          }}
        >
          They remain under the shelter&apos;s custody until a rescue
          formally commits to the animal and the appropriate transfer or
          Tag process is completed.
        </p>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 18,
          background: "#fff",
          border: "1px solid #E7E5E1",
          borderRadius: 10,
        }}
      >
        <strong
          style={{
            color: "#17233C",
          }}
        >
          Rescue networking
        </strong>

        <p
          style={{
            color: "#6B6862",
            lineHeight: 1.6,
            margin: "7px 0 0",
          }}
        >
          Approved rescues can review urgent shelter animals, identify
          animals they may be able to help, coordinate foster commitments,
          and begin the process of formally committing to an animal.
        </p>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 18,
          background: "#fff",
          border: "1px solid #E7E5E1",
          borderRadius: 10,
        }}
      >
        <strong
          style={{
            color: "#17233C",
          }}
        >
          Foster participation
        </strong>

        <p
          style={{
            color: "#6B6862",
            lineHeight: 1.6,
            margin: "7px 0 0",
          }}
        >
          Approved fosters may receive limited access to urgent animals
          when a rescue enables it. A foster offering to help does not
          constitute a rescue Tag or transfer. The rescue organization
          makes the formal commitment to the shelter.
        </p>
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 22,
          background: "#F7F7F8",
          border: "1px dashed #D8D6D2",
          borderRadius: 10,
        }}
      >
        <strong
          style={{
            display: "block",
            color: "#17233C",
            marginBottom: 6,
          }}
        >
          Urgent animal listings will appear here
        </strong>

        <p
          style={{
            margin: 0,
            color: "#6B6862",
            lineHeight: 1.6,
            fontSize: 13.5,
          }}
        >
          This area will become the rescue-facing urgent animal board,
          including shelter information, deadlines, animal details,
          placement needs, foster availability, rescue interest, and Tag
          status.
        </p>
      </div>
    </section>
  );
}
