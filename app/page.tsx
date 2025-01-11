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
  // add other token properties as needed
}

const subscribeToFrontPage = (callback: (data: any) => void) => {
  const dbRef = ref(database, "front-page");
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

export default function Home() {
  let [tokens, setTokens] = useState<Record<string, Token>>({});
  useLayoutEffect(() => {
    (async () => {
      subscribeToFrontPage((data) => {
        //console.log(data);
        setTokens(data);
      });

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
              key={key}
              profileImage={tokens[key].image_url}
              label1={tokens[key].m5}
              label2={tokens[key].h1}
              label3={tokens[key].h6}
              label4={tokens[key].h24}
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
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
