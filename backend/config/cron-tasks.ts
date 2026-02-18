import axios from "axios";

export default {
  "*/1 * * * *": async ({ strapi }: { strapi: any }) => {
    try {
      // 1. Fetch all coins created in the admin panel
      const myCoins = await strapi.documents("api::coin.coin").findMany();

      if (!myCoins || myCoins.length === 0) {
        console.log(
          "!!! [Cron] No coins found in the database. Please add them via Admin Panel.",
        );
        return;
      }

      console.log(
        `--- [${new Date().toLocaleTimeString()}] Starting price update for ${myCoins.length} assets ---`,
      );

      // 2. Base API URL for Binance
      const BINANCE_API_URL =
        process.env.BINANCE_API_URL ||
        "https://api1.binance.com/api/v3/ticker/price";

      for (const coin of myCoins) {
        try {
          // Format the trading pair (e.g., BTC + USDT = BTCUSDT)
          const pair = `${coin.symbol.toUpperCase()}USDT`;

          // Request real-time price from Binance
          const response = await axios.get(BINANCE_API_URL, {
            params: {
              symbol: pair,
            },
            timeout: 5000,
          });

          if (response.data && response.data.price) {
            const currentPrice = parseFloat(response.data.price);

            // 3. Update the coin price in Strapi database
            await strapi.documents("api::coin.coin").update({
              documentId: coin.documentId,
              data: {
                price: currentPrice,
              },
              status: "published", // Ensure changes are immediately visible on the frontend
            });

            console.log(`✅ [Cron] ${pair} updated: ${currentPrice} USD`);
          }
        } catch (error: any) {
          const errorDetail = error.response?.data?.msg || error.message;
          console.error(
            `❌ [Cron] Error updating ${coin.symbol}: ${errorDetail}`,
          );
        }
      }
    } catch (err: any) {
      console.error("❌ [Cron Global Error]:", err.message);
    }
  },
};

// export default {
//   "*/1 * * * *": async ({ strapi }: { strapi: any }) => {
//     try {

//       const [btc] = await strapi.documents("api::coin.coin").findMany({
//         filters: { symbol: "BTC" },
//       });

//       if (!btc) {
//         console.log(
//           "!!! [Cron] BTC не найден. Создайте его в админке и нажмите PUBLISH.",
//         );
//         return;
//       }

//       const newPrice = Math.floor(Math.random() * 1000) + 60000;

//       await strapi.documents("api::coin.coin").update({
//         documentId: btc.documentId,
//         data: {
//           price: newPrice,
//         },
//         status: "published", // КРИТИЧЕСКИ ВАЖНО для Strapi 5
//       });

//       console.log(`✅ [Cron] BTC Updated: ${newPrice} (Safe Update)`);
//     } catch (err: any) {
//       console.error("❌ [Cron Error]:", err.message);
//     }
//   },
// };
