import { NextResponse } from 'next/server';
import axios from 'axios';
const { signal } = new AbortController()
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await axios.get('https://w3bbiegames2.xyz/predict', {
            params: {
                address: body.tokenAddress,
                key: "sendit"
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching tokens" }, { status: 500 });
    }


}