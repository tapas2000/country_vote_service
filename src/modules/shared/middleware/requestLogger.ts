import { Request, Response, NextFunction } from 'express';

/**
 * Request logger middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };

    if (res.statusCode >= 400) {
      console.error('❌', JSON.stringify(log));
    } else {
      console.log('✅', JSON.stringify(log));
    }
  });

  next();
};

/**
 * Rate limiting helper (simple in-memory implementation)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(ip: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this IP
    const userRequests = this.requests.get(ip) || [];

    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(ip, recentRequests);

    return true;
  }

  reset(ip: string): void {
    this.requests.delete(ip);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Rate limit middleware
 */
export const rateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!rateLimiter.isAllowed(ip, maxRequests, windowMs)) {
      res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }
      });
      return;
    }

    next();
  };
};
