import { redis } from "../lib/redis.js";
import { memoryLimit } from "../utils/memoryLimiter.js";

const USER_LIMIT = 10;

export const userRateLimiter = async (req, res, next) => {
    // console.log(`auth object inside the userRatelimiter -- ${req.auth}`)
    const uid = req.auth.uid;
    // console.log(uid)
    const second = Math.floor(Date.now() / 1000);
    const key = `rate:user:${uid}:${second}`;

    try {
        const count = await redis.incr(key);

        if (count === 1) {
            await redis.expire(key, 1);
        }

        if (count > USER_LIMIT) {
            return res.status(429).json({ message: "User rate limit exceeded" });
        }

        next();
    } catch {
        // if Redis down then In-Memory fallback
        if (!memoryLimit(`user:${uid}`, USER_LIMIT)) {
            return res.status(429).json({ message: "User rate limit exceeded" });
        }
        next();
    }

}
