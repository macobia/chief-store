import Redis from "ioredis"
import dotenv from "dotenv";

dotenv.config();
export const redis = new Redis(process.env.UPTASH_REDIS_URL);
// const redis1 = new Redis(process.env.UPTASH_REDIS_URL);


// console.log(process.env.UPTASH_REDIS_URL)
// await redis.set('foo', 'bar');