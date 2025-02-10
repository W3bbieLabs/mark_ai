"use client";

import Image from "next/image";
import { useLayoutEffect, useState } from "react";
// import useGetTime from "./hooks/useGetTime";
import useGetTokens from "./hooks/useGetTokens";
import ProfileCard from "./components/ProfileCard";
import Header from "./components/Header";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  query,
  orderByChild,
  onValue,
} from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./utils/fb-config";
import axios from "axios";

const fb = initializeApp(firebaseConfig);
const database = getDatabase(fb);

interface Token {
  creation_timestamp: number;
  url: string;
  image_url: string;
  twitterLink: string;
  m5: string;
  h1: string;
  h6: string;
  h24: string;
  created_at: number;
  volume: number;
  marketCap: number;
  reason: string;
  mark_score: number;
  tokenAddress: string;
  // add other token properties as needed
}

const subscribeToEndpoint = (
  endpoint: string,
  callback: (data: any) => void
) => {
  const dbRef = ref(database, endpoint);
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        console.log("No data available");
        callback(null);
      }
    },
    (error) => {
      console.error("Error subscribing to front-page:", error);
    }
  );
};

// const subscribeToFrontPage = (callback: (data: any) => void) => {
//   const dbRef = ref(database, "front-page");
//   return onValue(
//     dbRef,
//     (snapshot) => {
//       if (snapshot.exists()) {
//         callback(snapshot.val());
//       } else {
//         console.log("No data available");
//         callback(null);
//       }
//     },
//     (error) => {
//       console.error("Error subscribing to front-page:", error);
//     }
//   );
// };

const getData = async (path: string) => {
  const dbRef = ref(getDatabase());
  let res = await get(child(dbRef, path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return res;
};

//create a function to calculate the average rating for a token
const calculateAverageRating = (
  ratings: Record<string, { rating: number }>
) => {
  if (ratings == undefined) {
    return 0;
  }
  let totalRating = 0;
  let count = 0;
  // console.log("Ratings");
  // console.log(ratings);

  //Iterate through ratings to find matches for this token
  Object.values(ratings).forEach((ratingObj) => {
    if (ratingObj.rating) {
      totalRating += ratingObj.rating;
      count++;
    }
  });

  // Return 0 if no ratings, otherwise return average rounded to 1 decimal
  return count === 0 ? 0 : Number((totalRating / count).toFixed(1));
};

export default function Home() {
  let [tokens, setTokens] = useState<Record<string, Token>>({});
  let [all_ratings, setRatings] = useState<Record<string, any>>({});
  let [searchInput, setSearchInput] = useState("");
  let [analyzeImg, setAnalyzeImg] = useState("");
  let [analyzeName, setAnalyzeName] = useState("");
  let [prediction, setPrediction] = useState("");
  let [confidence, setConfidence] = useState(0);
  let [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    (async () => {
      subscribeToEndpoint("front-page", (data) => {
        //console.log("front-page");
        //console.log(data);
        for (let i in data) {
          //console.log(data[i]);
        }
        setTokens(data);
      });

      subscribeToEndpoint("ratings", (data) => {
        // console.log("ratings");
        // console.log(data);
        for (let token in data) {
          const averageRating = calculateAverageRating(data[token]);
          //console.log(`Average rating for ${token}: ${averageRating}`);
          all_ratings[token] = {
            ...all_ratings[token],
            averageRating: Math.round(averageRating),
          };
        }
        setRatings(all_ratings);
        // console.log(all_ratings);
      });
      // subscribeToFrontPage((data) => {
      //   console.log(data);
      //   for (let i in data) {
      //     console.log(data[i]);
      //   }
      //   setTokens(data);
      // });

      /*
      let _tokens = await useGetTokens();
      setTokens(_tokens);
      console.log(_tokens);

      let mintutes = 1;
      const milliseconds = mintutes * 60 * 1000;

      const interval = setInterval(async () => {
        let _tokens2: any = await useGetTokens();
        setTokens(_tokens2);
        console.log(_tokens2);
      }, milliseconds);

      */
    })();
  }, []);

  const handleSearch = async () => {
    console.log("Searching for:", searchInput);
    setIsLoading(true);
    let res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenAddress: searchInput,
      }),
    }).catch((error) => {
      console.error("Error submitting rating:", error);
    });

    setIsLoading(false);

    if (res) {
      let data = await res.json();
      const { img, name, prediction, confidence } = data;
      setAnalyzeImg(img);
      setAnalyzeName(name);
      setPrediction(prediction);
      setConfidence(confidence);
    }

    // console.log("Searching for:", searchInput);
    // const response = await axios.get(
    //   `https://w3bbiegames2.xyz/predict?address=Hjw6bEcHtbHGpQr8onG3izfJY5DJiWdt7uk2BfdSpump&key=sendit`,
    //   {
    //     timeout: 10000,
    //     headers: { Accept: "application/json" },
    //   }
    // );
    // console.log("Response:", response.data);
    // console.log("done");
  };

  const getTokenTitle = (twitterLink: string): string => {
    if (!twitterLink) return "";
    const parts = twitterLink.split("/");
    return parts[parts.length - 1] || "";
  };

  const TokenList = () => {
    if (!tokens || Object.keys(tokens).length === 0) {
      return <div>No tokens available</div>;
    }

    return (
      <ul>
        {Object.entries(tokens)
          .filter(
            ([key]) => !getTokenTitle(tokens[key].twitterLink).includes("?")
          )
          .sort(([, a], [, b]: [string, Token]) => b.created_at - a.created_at)
          .map(([key]) => (
            <ProfileCard
              averageRating={all_ratings[key]?.averageRating || 0}
              key={key}
              profileImage={tokens[key].image_url}
              label1={tokens[key].m5}
              label2={tokens[key].h1}
              label3={tokens[key].h6}
              label4={tokens[key].h24}
              tokenAddress={tokens[key].tokenAddress}
              mark_score={tokens[key].mark_score}
              created_at={tokens[key].created_at}
              volume={tokens[key].volume}
              marketcap={tokens[key].marketCap}
              reason={tokens[key].reason}
              title={getTokenTitle(tokens[key].twitterLink)}
              twitter_url="https://twitter.com/token"
              dexscreener_url="https://dexscreener.com/token"
              onButton1Click={() => window.open(tokens[key].url, "_blank")}
              onButton2Click={() =>
                window.open(tokens[key].twitterLink, "_blank")
              }
            />
          ))}
      </ul>
    );
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <h1>CA: 5jVhenaTT5ccPgSfvLLHysvmyXTXmrZQDCUBjfBXCQr3</h1>
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-[95%] sm:w-[80%] md:w-[75%] lg:w-[70%] max-w-[800px] p-4 md:p-8 bg-gray-900 rounded-xl shadow-lg mx-auto my-4 border border-gray-800">
          <div className="mb-4">
            {analyzeImg ? (
              <img
                src={analyzeImg || ""}
                alt="Analysis"
                className="w-48 h-48 object-cover rounded-xl mx-auto"
              />
            ) : (
              <div></div>
            )}
          </div>

          {prediction ? (
            <div className="text-center text-2xl font-bold text-white">
              Prediction: {prediction}
            </div>
          ) : (
            <div></div>
          )}

          {analyzeName ? (
            <div className="text-center text-1xl text-white pb-4">
              {analyzeName}
            </div>
          ) : (
            <div></div>
          )}

          {confidence ? (
            <div className="w-full mb-6">
              <div className="text-center text-sm text-gray-400 mb-2">
                Confidence: {(confidence * 100).toFixed(1)}%
              </div>
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex flex-col gap-4">
            <input
              type="search"
              placeholder="Enter a token address..."
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full px-4 py-2 text-lg bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200 w-full"
              onClick={handleSearch}
            >
              Analyze
            </button>
          </div>
        </div>
        <TokenList />

        {/*}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/*
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
        */}
      </footer>
    </div>
  );
}
