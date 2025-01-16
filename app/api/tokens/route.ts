import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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
        const API_KEY = process.env.API_KEY;
        const body = await request.json();
        // console.log(body);
        const { tokenAddress, rating } = body;
        const response = await fetch('https://w3bbiegames.xyz/rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: tokenAddress,
                rating: rating,
                api_key: API_KEY
            })
        });

        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: "Error fetching tokens" }, { status: 500 });
    }
}