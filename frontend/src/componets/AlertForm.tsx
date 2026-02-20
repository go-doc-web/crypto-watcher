"use client";

import { useState, useEffect } from "react";
import { Coin } from "@/types";

export default function AlertForm({ coins }: { coins: Coin[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Sort the list alphabetically by symbol to maintain a consistent order
  const sortedCoins = [...coins].sort((a, b) =>
    a.symbol.localeCompare(b.symbol),
  );

  // State management for form fields and loading status
  const [symbol, setSymbol] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Determine the currently selected symbol (defaults to the first coin in the sorted list)
  const activeSymbol = symbol || sortedCoins[0]?.symbol || "";
  const currentCoin = sortedCoins.find((c) => c.symbol === activeSymbol);

  // Create a dynamic placeholder showing the real-time price
  const pricePlaceholder = currentCoin
    ? `Current: $${Number(currentCoin.price).toLocaleString()}`
    : "Enter target price";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/alerts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              symbol: activeSymbol,
              triggerPrice: Number(triggerPrice),
              email: email,
              alertStatus: "pending",
            },
          }),
        },
      );

      if (res.ok) {
        alert("Alert successfully created!");
        // Reset form fields on success
        setTriggerPrice("");
        setEmail("");
      }
    } catch (error) {
      console.error("Failed to create alert:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl text-white">
      <h2 className="text-xl font-bold mb-4 tracking-tight text-emerald-400">
        Set Price Alert
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* DYNAMIC COIN SELECT */}
        <div>
          <label className="block text-[10px] text-slate-500 uppercase font-black mb-1">
            Select Asset
          </label>
          <select
            value={activeSymbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500 appearance-none cursor-pointer text-white"
          >
            {sortedCoins.map((coin) => (
              <option key={coin.documentId} value={coin.symbol}>
                {coin.symbol.toUpperCase()} —{" "}
                {Number(coin.price).toLocaleString()}$
              </option>
            ))}
          </select>
        </div>

        {/* EMAIL INPUT */}
        <div>
          <label className="block text-[10px] text-slate-500 uppercase font-black mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
            required
          />
        </div>

        {/* TARGET PRICE INPUT */}
        <div>
          <label className="block text-[10px] text-slate-500 uppercase font-black mb-1">
            Target Price
          </label>
          <input
            type="number"
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(e.target.value)}
            placeholder={mounted ? pricePlaceholder : "loading"}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500 text-emerald-400 font-mono"
            required
            step="any"
          />
        </div>

        <button
          disabled={loading || sortedCoins.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-900 font-black py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-30"
        >
          {loading ? "CREATING..." : "CREATE TRIGGER"}
        </button>
      </form>
    </div>
  );
}
