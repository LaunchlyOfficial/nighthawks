import type { Request, Response, NextFunction } from 'express';

// Simple in-memory store for rate limiting
const requestStore = new Map<string, { count: number; resetTime: number }>();

const createRateLimiter = (windowMs: number, maxRequests: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Get IP or fallback to a default
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const record = requestStore.get(ip);

        // Clean up old records
        if (record && now > record.resetTime) {
            requestStore.delete(ip);
        }

        // Create new record if none exists
        if (!record || now > record.resetTime) {
            requestStore.set(ip, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        // Check if limit exceeded
        if (record.count >= maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            return res.status(429).json({
                error: 'Too many requests, please try again later',
                retryAfter
            });
        }

        // Increment counter and continue
        record.count++;
        next();
    };
};

// More lenient limits for development
export const apiLimiter = createRateLimiter(60 * 1000, 100); // 100 requests per minute
export const authLimiter = createRateLimiter(60 * 1000, 50);  // 50 requests per minute
export const adminLimiter = createRateLimiter(60 * 1000, 200); // 200 requests per minute

// Clean up old records periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestStore.entries()) {
        if (now > record.resetTime) {
            requestStore.delete(ip);
        }
    }
}, 60 * 1000); // Clean up every minute 