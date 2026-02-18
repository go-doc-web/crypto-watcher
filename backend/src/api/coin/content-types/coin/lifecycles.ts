import { errors } from "@strapi/utils";

export default {
  async afterUpdate(event: any) {
    const { result } = event;

    // Логирование — в финтехе это "Audit Log". Мы должны знать, что и когда произошло.
    console.log(
      `[TS Lifecycle] Проверка актива ${result.symbol}. Новая цена: ${result.price}`,
    );

    const triggeredAlerts = await strapi.entityService.findMany(
      "api::alert.alert",
      {
        filters: {
          symbol: result.symbol,
          alertStatus: "pending",
          triggerPrice: {
            $lte: result.price, // Условие: цена монеты стала >= цены триггера
          },
        },
      },
    );

    if (triggeredAlerts && triggeredAlerts.length > 0) {
      for (const alert of triggeredAlerts) {
        await strapi.entityService.update("api::alert.alert", alert.id, {
          data: {
            alertStatus: "triggered",
          },
        });

        console.log(
          `🚀 [NOTIFICATION] Для ${alert.email} исполнен ордер по цене ${result.price}`,
        );
      }
    }
  },
};
