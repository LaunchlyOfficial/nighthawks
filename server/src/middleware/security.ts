import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Rate limiting
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

export const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: 'Too many login attempts from this IP, please try again after an hour'
});

// Security headers middleware
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
            styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https:', 'data:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
});

// CSRF Protection
const csrfTokens = new Map();

export function generateCSRFToken(req: Request): string {
    const token = crypto.randomBytes(32).toString('hex');
    csrfTokens.set(req.ip, token);
    return token;
}

export function validateCSRFToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-csrf-token'];
    const storedToken = csrfTokens.get(req.ip);

    if (!token || !storedToken || token !== storedToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
}

// SQL Injection Protection
export function sanitizeInput(input: string): string {
    return input.replace(/[;'"\\]/g, '');
}

// Request Validation
export function validateRequestBody(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeInput(req.body[key]);
            }
        }
    }
    next();
}

// IP Blocking
const blockedIPs = new Set();
const suspiciousAttempts = new Map();

export function ipFilter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    
    if (blockedIPs.has(ip)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const attempts = suspiciousAttempts.get(ip) || 0;
    if (attempts > 10) {
        blockedIPs.add(ip);
        return res.status(403).json({ error: 'IP has been blocked' });
    }

    next();
}

// Request Logging
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
} 