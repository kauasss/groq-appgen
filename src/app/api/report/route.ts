import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { app_url, ban_url } = await request.json();
    
    const webhookUrl = process.env.SLACK_WEBHOOK;
    if (!webhookUrl) {
      throw new Error("Slack webhook URL not configured");
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_url,
        ban_url,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send to Slack");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reporting app:", error);
    return NextResponse.json({ error: "Failed to report app" }, { status: 500 });
  }
}
