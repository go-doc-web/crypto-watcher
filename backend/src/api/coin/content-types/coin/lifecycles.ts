export default {
  async afterUpdate(event: any) {
    const { result } = event;
    const { price, symbol } = result;

    // 1. Safety check
    if (!price || !symbol) return;

    try {
      const currentPrice = Number(price);

      // 2. Find all pending alerts for this coin where triggerPrice <= currentPrice
      const triggeredAlerts = await strapi
        .documents("api::alert.alert")
        .findMany({
          filters: {
            symbol: symbol,
            alertStatus: "pending",
            triggerPrice: { $lte: currentPrice }, // Trigger when price is equal or higher
          },
        });

      if (triggeredAlerts.length === 0) return;

      // 3. Process triggered alerts
      for (const alert of triggeredAlerts) {
        try {
          await strapi.documents("api::alert.alert").update({
            documentId: alert.documentId,
            data: { alertStatus: "triggered" },
          });

          console.log(
            `🚀 [NOTIFICATION] Target reached for ${alert.email}! Symbol: ${symbol}, Price: ${currentPrice}`,
          );
        } catch (innerError: any) {
          // Prevent one failed update from crashing the loop
          console.error(
            `[-] Error updating alert ${alert.documentId}:`,
            innerError.message,
          );
        }
      }
    } catch (globalError: any) {
      // Prevent the whole app from crashing if DB query fails
      console.error("[-] Global Lifecycle Error:", globalError.message);
    }
  },
};
