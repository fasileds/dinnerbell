"use client";
import { useEffect } from "react";
import { AppProps } from "next/app";
import { initGA } from "../lib/ga";
import { initTikTokPixel, trackTikTokEvent } from "../lib/tiktok";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initGA();
    initTikTokPixel();
    trackTikTokEvent("PageView", {
      page_name: "app_start",
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
