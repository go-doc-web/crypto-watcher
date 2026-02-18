export default {
  "*/1 * * * *": async ({ strapi }) => {
    const { default: redis } = await import("../src/extensions/redis");

    const btc = await strapi.db.query("api::coin.coin").findOne({
      where: { symbol: "BTC" },
    });

    if (btc) {
      const newPrice = Math.floor(Math.random() * 1000) + 60000;

      await strapi.entityService.update("api::coin.coin", btc.id, {
        data: { price: newPrice },
      });

      // Теперь вызываем connect вручную или полагаемся на авто-коннект при первом запросе
      await redis.set(`price:${btc.symbol}`, newPrice.toString(), "EX", 120);
      console.log(`[Cron + Redis] Цена BTC: ${newPrice}`);
    }
  },
};
