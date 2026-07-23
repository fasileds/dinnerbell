"use client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { lusitana } from "@/app/ui/fonts";
import { useState, useEffect } from "react";
import axios from "axios";
import { CreateInvoice } from "../invoices/buttons";

interface LatestInvoice {
  id: string;
  videoUrl: string;
  description: string;
  userId: string;
  price: number;
}

interface VideoResponse {
  menuItem: LatestInvoice[];
}

interface LatestInvoicesProps {
  onInvoiceSelect: (id: string) => void;
}

export default function LatestInvoices({
  onInvoiceSelect,
}: LatestInvoicesProps) {
  const [latestInvoices, setLatestInvoices] = useState<LatestInvoice[]>([]);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const res = await axios.get<VideoResponse>(
          "http://localhost:3000/api/Video/getAllVideo"
        );
        setLatestInvoices(res.data.menuItem);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    getVideo();
  }, []);

  const getEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url;
  };

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="flex w-[400px] items-center justify-between mb-6">
        <h2 className={`${lusitana.className} text-xl md:text-2xl`}>
          Latest Ads
        </h2>
        <CreateInvoice />
      </div>

      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6 space-y-4">
          {latestInvoices.map((invoice, i) => (
            <div
              key={invoice.id}
              className={clsx(
                "flex items-center justify-between py-4 px-4 rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-100 active:bg-gray-200",
                {
                  "border-t": i !== 0,
                }
              )}
              onClick={() => onInvoiceSelect(invoice.id)}
            >
              <div className="flex items-center space-x-4">
                <iframe
                  src={getEmbedUrl(invoice.videoUrl)}
                  title={`${invoice.description}'s video`}
                  className="rounded-lg"
                  width={120}
                  height={90}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base text-gray-700">
                    {invoice.description}
                  </p>
                </div>
              </div>
              <p
                className={`${lusitana.className} truncate text-sm font-medium md:text-base text-gray-700`}
              >
                ${invoice.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
