"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Coin } from "@/types";

const fetcher = (url: string) =>
  fetch(url, {
    cache: "no-store",
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
  }).then((res) => res.json());

export default function PriceList({ initialData }: { initialData: Coin[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/coins`,
    fetcher,
    {
      refreshInterval: 3000,
      fallbackData: { data: initialData },
      revalidateOnFocus: true,
    },
  );

  const coins: Coin[] = data?.data || [];
  const sortedCoins = [...coins].sort((a, b) =>
    a.symbol.localeCompare(b.symbol),
  );
  return (
    <div className="space-y-4">
      {sortedCoins.map((coin: Coin) => (
        <div
          key={coin.documentId}
          className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex justify-between items-center shadow-lg"
        >
          <div>
            <div className="text-2xl font-bold text-white uppercase">
              {coin.symbol}
            </div>
            <div className="text-[10px] text-slate-500 italic uppercase tracking-widest">
              {data?.data ? "• Live" : "• Static"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono text-emerald-400 tabular-nums">
              ${Number(coin.price).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 uppercase mt-1 text-opacity-50">
              {mounted
                ? new Date(coin.updatedAt).toLocaleTimeString()
                : "loading"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
