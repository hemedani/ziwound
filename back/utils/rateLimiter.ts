import { type ActFn } from "@deps";

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private limit: number, private windowMs: number) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];

    // Filter out timestamps outside the window
    const validTimestamps = timestamps.filter(timestamp => now - timestamp < this.windowMs);

    if (validTimestamps.length >= this.limit) {
      return false;
    }

    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    return true;
  }
}

export const createRateLimitMiddleware = (limiter: RateLimiter) => {
  return async (body: any) => {
    // Use user ID if authenticated, otherwise IP or a default key
    const key = body.context?.user?._id?.toString() || body.context?.ip || 'anonymous';

    if (!limiter.isAllowed(key)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
  };
};
