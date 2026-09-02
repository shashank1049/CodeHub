const rateLimitStore = new Map();

const rateLimit = ({
    windowMs = 60 * 1000,
    maxRequests = 100,
    message = "Too many requests, please try again later",
}) => {
    return (req, res, next) => {
        const key = req.ip;

        const now = Date.now();

        const existingRecord = rateLimitStore.get(key);

        if (!existingRecord) {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + windowMs,
            });

            return next();
        }

        if (now > existingRecord.resetTime) {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + windowMs,
            });

            return next();
        }

        existingRecord.count++;

        if (existingRecord.count > maxRequests) {
            const retryAfter = Math.ceil(
                (existingRecord.resetTime - now) / 1000
            );

            res.setHeader(
                "Retry-After",
                retryAfter
            );

            return res.status(429).json({
                success: false,
                message,
            });
        }

        next();
    };
};

export { rateLimit };