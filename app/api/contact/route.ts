import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";

// Where inquiries are delivered. Same inbox shown across the site.
const TO_EMAIL = "pbf@pbfmachine.com";

// Sender. `onboarding@resend.dev` works on Resend's free tier without any
// domain verification, as long as the recipient is the address registered on
// the Resend account (pbf@pbfmachine.com). Once the pbfmachine.com domain is
// verified in Resend, switch this to e.g. "PBFMACHINE <noreply@pbfmachine.com>".
const FROM_EMAIL = "PBFMACHINE Website <onboarding@resend.dev>";

// Vercel Serverless Functions cap the request body at 4.5 MB, so the upload
// must stay under that. Mirrors MAX_FILE_BYTES in lib/validateContact.ts.
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration: env var missing in this environment.
    console.error("RESEND_API_KEY is not set.");
    return NextResponse.json(
      { ok: false, error: "Email service not configured" },
      { status: 500 }
    );
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 }
    );
  }

  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Optional attachment.
  let attachment: { filename: string; content: Buffer } | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Attachment too large" },
        { status: 413 }
      );
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    attachment = { filename: file.name, content: bytes };
  }

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Company", company || "—"],
    ["Email", email],
    ["Phone", phone || "—"],
  ];

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.6">
      <h2 style="margin:0 0 16px">New inquiry — PBFMACHINE</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#666;font-weight:bold;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(
                value
              )}</td></tr>`
          )
          .join("")}
      </table>
      <div style="padding:16px;background:#f4f4f4;border-left:3px solid #2B5BA6;white-space:pre-wrap">${escapeHtml(
        message
      )}</div>
      ${
        attachment
          ? `<p style="margin-top:16px;color:#666;font-size:13px">Attachment: ${escapeHtml(
              attachment.filename
            )}</p>`
          : ""
      }
    </div>
  `;

  const text = [
    "New inquiry — PBFMACHINE",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
    attachment ? `\nAttachment: ${attachment.filename}` : "",
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry — ${name}${company ? ` (${company})` : ""}`,
      html,
      text,
      attachments: attachment
        ? [{ filename: attachment.filename, content: attachment.content }]
        : undefined,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Inquiry received" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error sending inquiry:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send" },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 }
  );
}
