import Redis from "ioredis";

interface NodeJSStaticError extends Error {
  code?: string;
  syscall?: string;
  hostname?: string;
}

const redis = new Redis({
  host: process.env.REDIS_HOST || "strapi-redis",
  port: Number(process.env.REDIS_PORT) || 6379,
  lazyConnect: true, // КРИТИЧНО: не подключаться при создании экземпляра
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("error", (err: NodeJSStaticError) => {
  if (err.code !== "ENOTFOUND") {
    console.error("❌ Redis Error:", err.message);
  }
});

export default redis;
