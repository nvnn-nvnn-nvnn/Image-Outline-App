// src/utils/usageTracker.ts
const MAX_FREE_USES = 3;
const STORAGE_KEY = 'image_app_usage';

interface Usage {
  date: string | null;   // YYYY-MM-DD
  count: number;
}

/** Today’s date string (local timezone) */
const today = (): string => new Date().toISOString().split('T')[0];

/** Load from localStorage – safe fallback */
const load = (): Usage => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { date: null, count: 0 };
  } catch {
    return { date: null, count: 0 };
  }
};

/** Persist to localStorage */
const save = (u: Usage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  } catch (e) {
    console.warn('Could not save usage', e);
  }
};

/** Public API */
export interface UseResult {
  allowed: boolean;
  reason: 'pro' | 'new_day' | 'within_limit' | 'exceeded';
  remaining?: number;
}

/**
 * Returns whether the user may call the heavy feature.
 * Increments the counter **only when allowed**.
 */
export const canUseFeature = (isPro: boolean = false): UseResult => {
  if (isPro) return { allowed: true, reason: 'pro' };

  const now = today();
  const usage = load();

  // ---- New day → reset ----
  if (usage.date !== now) {
    const fresh: Usage = { date: now, count: 1 };
    save(fresh);
    return { allowed: true, reason: 'new_day', remaining: MAX_FREE_USES - 1 };
  }

  // ---- Same day, still room ----
  if (usage.count < MAX_FREE_USES) {
    const next: Usage = { ...usage, count: usage.count + 1 };
    save(next);
    return {
      allowed: true,
      reason: 'within_limit',
      remaining: MAX_FREE_USES - next.count,
    };
  }

  // ---- Limit reached ----
  return { allowed: false, reason: 'exceeded', remaining: 0 };
};

/** Helper for dev / testing */
export const resetUsage = () => localStorage.removeItem(STORAGE_KEY);