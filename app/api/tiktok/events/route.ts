import { NextRequest, NextResponse } from "next/server";

const TIKTOK_EVENTS_ENDPOINT =
  "https://business-api.tiktok.com/open_api/v1.3/pixel/track/";

function sanitizePayload(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item));
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        sanitizePayload(item),
      ])
    );
  }
  return String(value);
}

function buildTikTokPayload(body: Record<string, any>, request: NextRequest) {
  const pixelId = String(
    body?.pixelId || body?.pixel_code || process.env.TIKTOK_PIXEL_ID || ""
  ).trim();
  const eventName = String(body?.eventName || body?.event || "PageView").trim();
  const properties = sanitizePayload(body?.params || body?.properties || {}) as Record<string, unknown>;
  const context = sanitizePayload({
    page_url: body?.url || body?.page_url || "",
    page_referrer:
      body?.referrer || body?.page_referrer || request.headers.get("referer") || "",
    user_agent: request.headers.get("user-agent") || "",
    timestamp: new Date().toISOString(),
  }) as Record<string, unknown>;

  return {
    pixel_code: pixelId,
    event: eventName,
    event_id: body?.event_id || body?.eventId || `${eventName}-${Date.now()}`,
    properties,
    context,
  };
}

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "TikTok event endpoint is ready.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, any>;
    const pixelId = String(
      body?.pixelId || body?.pixel_code || process.env.TIKTOK_PIXEL_ID || ""
    ).trim();
    const accessToken = String(process.env.TIKTOK_ACCESS_TOKEN || "").trim();
    const eventName = String(body?.eventName || body?.event || "PageView").trim();

    if (!pixelId) {
      return NextResponse.json(
        { success: false, message: "TikTok pixel ID is not configured." },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "TikTok access token is not configured.",
        },
        { status: 503 }
      );
    }

    const payload = buildTikTokPayload(body, request);

    const response = await fetch(TIKTOK_EVENTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: unknown = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(
      {
        success: response.ok,
        event: eventName,
        data,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("TikTok events API error:", error);
    return NextResponse.json(
      { success: false, message: "TikTok event forwarding failed." },
      { status: 500 }
    );
  }
}
