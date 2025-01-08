import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const timestamp = Date.now();
        console.log("timestamp: ", timestamp);
        return NextResponse.json({ t: timestamp });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching tokens" }, { status: 500 });
    }
}