import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const APPS_DIR = process.env.APPS_DIR || '/tmp/groq-appgen';

// Ensure the apps directory exists
if (!fs.existsSync(APPS_DIR)) {
  fs.mkdirSync(APPS_DIR, { recursive: true });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string; version: string } }
) {
  const { sessionId, version } = params;
  const filePath = path.join(APPS_DIR, sessionId, version, 'index.html');

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Not found', { status: 404 });
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string; version: string } }
) {
  const { sessionId, version } = params;
  const html = await request.text();
  
  const sessionDir = path.join(APPS_DIR, sessionId);
  const versionDir = path.join(sessionDir, version);

  try {
    // Create directories if they don't exist
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir);
    }

    const filePath = path.join(versionDir, 'index.html');
    fs.writeFileSync(filePath, html);

    return new NextResponse(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to save HTML' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
