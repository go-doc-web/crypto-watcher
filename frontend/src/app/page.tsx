import AlertForm from "../componets/AlertForm"; // проверь написание components (у тебя было componets)
import PriceList from "../componets/PriceList";
import { Coin } from "@/types";

async function getInitialCoins(): Promise<Coin[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/coins`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const initialCoins = await getInitialCoins();

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ADDUP WATCHER
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-500 uppercase">
              Live Feed
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PriceList initialData={initialCoins} />
          </div>
          <aside>
            <AlertForm coins={initialCoins} />
          </aside>
        </div>
      </div>
    </div>
  );
}
