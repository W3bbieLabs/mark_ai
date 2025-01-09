import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // console.log(initializeApp)
        // const data = await getData("front-page");
        // console.log(data);

        /*
        const API_KEY = process.env.API_KEY;
        const ENDPOINT = process.env.ENDPOINT;
        const QUERY = process.env.QUERY;
        const response = await fetch(`${ENDPOINT}?${QUERY}=${API_KEY}`);
        const data = await response.json();
        console.log(Object.keys(data).length);
        */
        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: "Error fetching tokens" }, { status: 500 });
    }
}