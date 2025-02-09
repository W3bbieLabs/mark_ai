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
        // const API_KEY = process.env.API_KEY;
        // const body = await request.json();
        // // console.log(body);
        // const { tokenAddress, rating } = body;
        // console.log("Sending tokenAddress, rating", tokenAddress, rating);
        const body = await request.json();
        const response = await axios.get('https://w3bbiegames2.xyz/predict', {
            params: {
                address: body.tokenAddress,
                key: "sendit"
            }
        });

        // const response = await axios.get('https://w3bbiegames2.xyz/predict', {
        //     address: "Hjw6bEcHtbHGpQr8onG3izfJY5DJiWdt7uk2BfdSpump",
        //     key: "sendit"
        // });


        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching tokens" }, { status: 500 });
    }


}