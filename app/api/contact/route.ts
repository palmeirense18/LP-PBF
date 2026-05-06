// TODO: replace with actual email dispatch (Resend/SendGrid/Postmark) before production.
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 }
    );
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  return NextResponse.json(
    { ok: true, message: "Inquiry received" },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 }
  );
}
