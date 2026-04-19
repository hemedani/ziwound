import { coreApp } from "../mod.ts";
import { MyContext } from "./context.ts";

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private limit: number, private windowMs: number) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];

    // Filter out timestamps outside the window
    const validTimestamps = timestamps.filter((timestamp) =>
      now - timestamp < this.windowMs
    );

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
  return () => {
    const { user: { _id } }: MyContext = coreApp.contextFns
      .getContextModel() as unknown as MyContext;

    // should get and set ip in context in future
    // const key = _id?.toString() || body.context?.ip || 'anonymous';

    const key = _id?.toString() || "anonymous";

    if (!limiter.isAllowed(key)) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
  };
};
