import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

// Server-side AI Search — unlike the browser artifact prototype, the
// Anthropic API key lives here as a server environment variable
// (ANTHROPIC_API_KEY) and is never sent to the client. This is the
// version of AI Search you'd actually want in production.
const SYSTEM_PROMPT_PREFIX = `You are the search assistant for the TX Animal Rescue & Resource Database, an internal coordination tool for Texas rescues, shelters, and resource partners.

Answer questions using ONLY the organization data provided below. Follow these rules exactly:
- Distinguish clearly between Yes, Limited, Case-by-case, No, and Unknown for every capability you mention.
- NEVER treat "Unknown" as "No." Unknown means the capability has not been reliably verified yet.
- A "Yes" value does not mean an organization has space today. Always tell the user to confirm directly before referring or transporting an animal.
- Include organization name, location/service area, matching capabilities, restrictions, and contact info when relevant.
- If nothing matches, say so plainly rather than guessing.
- Keep answers concise — a short paragraph or short list, not an essay.

Organization data (JSON):
`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const question = body?.question?.trim();
  if (!question) return NextResponse.json({ error: "question is required." }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured on the server." }, { status: 500 });
  }

  const orgs = await sql`
    select o.*, c.*
    from organizations o
    left join capabilities c on c.org_id = o.id
  `;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT_PREFIX + JSON.stringify(orgs),
      messages: [{ role: "user", content: question }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json({ error: `Model request failed: ${errText}` }, { status: 502 });
  }

  const data = await response.json();
  const text = (data.content ?? [])
    .map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
    .filter(Boolean)
    .join("\n");

  return NextResponse.json({ answer: text });
}
