/**
 * In-memory sliding window rate limiter.
 * Resets on server restart — acceptable for bot API protection.
 */

interface WindowEntry {
  count: number
  windowStart: number
}

const windows = new Map<string, WindowEntry>()

const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 200 // per window per key
const CLEANUP_INTERVAL_MS = 5 * 60_000 // clean expired entries every 5 min

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of windows) {
      if (now - entry.windowStart > WINDOW_MS * 2) {
        windows.delete(key)
      }
    }
  }, CLEANUP_INTERVAL_MS)
  // Don't prevent process exit
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref()
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(key: string): RateLimitResult {
  ensureCleanup()

  const now = Date.now()
  const entry = windows.get(key)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    windows.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS }
  }

  entry.count++

  if (entry.count > MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.windowStart + WINDOW_MS,
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.windowStart + WINDOW_MS,
  }
}
