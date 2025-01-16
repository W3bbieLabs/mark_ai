import { NextResponse } from 'next/server';
import axios from 'axios';

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
        console.log("Sending tokenAddress, rating", tokenAddress, rating);
        const response = await axios.post('https://w3bbiegames.xyz/rating', {
            address: tokenAddress,
            rating: rating,
            api_key: API_KEY
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: "Error fetching tokens" }, { status: 500 });
    }
}