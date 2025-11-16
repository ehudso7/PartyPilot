import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'PartyPilot API',
    version: '1.0.0',
    status: 'ok'
  });
}
