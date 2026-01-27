import { redis } from "../lib/redis.js";
import { memoryLimit } from "../utils/memoryLimiter.js";

const GLOBAL_LIMIT = 500;

export const globalRateLimiter = async(req , res , next) => {
    const second = Math.floor(Date.now() / 1000);

    const key = `rate:global:${second}`;

    try {

        const count = await redis.incr(key);

        if(count === 1) {
            await redis.expire(key , 1);
        }

        if(count > GLOBAL_LIMIT) {
            return res.status(429).json({message: "Server busy"});
        }

        next();
    } catch  {
        // if REDIS is down fallback to IN-MEMORY 

        if(!memoryLimit("global", GLOBAL_LIMIT)){
            return res.status(429).json({message: "Server busy"});
        }
        next();
    }
};