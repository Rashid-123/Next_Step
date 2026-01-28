import {redis} from "../lib/redis.js";

const USER_LIMIT = 2;
const GLOBAL_LIMIT = 50;
const WINDOW = 1;

export const paymentRateLimiter = async (req, res, next) => {
    try {
        const uid = req.auth.uid;
        const second = Math.floor(Date.now() / 1000);

        const userKey = `rate:payment:user:${uid}:${second}`;
        const globalKey = `rate:payment:global:${second}`;

        // ------- USER LIMIT ----------
        const userCount = await redis.incr(userKey);
        if (userCount === 1) {
            await redis.expire(userKey, WINDOW);
        }

        if (userCount > USER_LIMIT) {
            return res.status(429).json({
                error: "USER_RATE_LIMIT_EXCEEDED",
                message: "Too many payment requests. Please wait.",
            });
        }

        const globalCount = await redis.incr(globalKey);
        if (globalCount === 1) {
            await redis.expire(globalKey, WINDOW);
        }

        if (globalCount > GLOBAL_LIMIT) {
            return res.status(429).json({
                error: "GLOBAL_RATE_LIMIT_EXCEEDED",
                message: "Payment service is busy. Try again shortly.",
            });
        }

        next();
    } catch (err) {
        console.error("Payment rate limiter error", err);
        return res.status(500).json({
            error: "RATE_LIMITER_ERROR",
            message: "Unable to process payment request",
        });
    }
};
