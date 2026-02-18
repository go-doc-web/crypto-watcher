export default {
  "*/1 * * * *": async ({ strapi }) => {
    const btc = await strapi.db.query("api::coin.coin").findOne({
      where: { symbol: "BTC" },
    });

    if (btc) {
      const newPrice = Math.floor(Math.random() * 1000) + 60000;

      await strapi.entityService.update("api::coin.coin", btc.id, {
        data: { price: newPrice },
      });

      console.log(`[Cron] BTC price updated to: ${newPrice}`);
    }
  },
};
