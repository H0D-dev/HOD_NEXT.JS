/**
 * HOD Client-Side Analytics Tracker
 * Handles anonymous session management, event queuing, deduplication, and non-blocking delivery.
 * Target Destination: POST /api/analytics/track (Next.js server proxy)
 */

import {
  AnalyticsBatchPayload,
  AnalyticsEventName,
  AnalyticsSession,
  RawAnalyticsEvent,
  TrackEventOptions,
} from "./types";
import { classifyTrafficSource, extractReferrerDomain } from "./geo";

const SESSION_STORAGE_KEY = "hod_analytics_session";
const DEDUP_CACHE_KEY = "hod_analytics_dedup_cache";
const FLUSH_INTERVAL_MS = 2000;
const MAX_QUEUE_SIZE = 50;
const BATCH_SIZE = 10;
const ENDPOINT = "/api/analytics/track";

// ── In-Memory State ───────────────────────────────────────────────────────────

let activeSession: AnalyticsSession | null = null;
let eventQueue: RawAnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;
let isUnloadHooked = false;

// ── Helper Utilities ──────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function generateRandomId(prefix: string): string {
  const timestamp = Date.now();
  const rand = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${rand}`;
}

function parseUrlParams(): Record<string, string> {
  if (!isBrowser()) return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  } catch {
    return {};
  }
}

// ── Session Manager ───────────────────────────────────────────────────────────

export function getOrCreateSession(userId?: number | null): AnalyticsSession {
  if (!isBrowser()) {
    return {
      session_id: "hod_sess_ssr_placeholder",
      started_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    };
  }

  const nowIso = new Date().toISOString();

  if (activeSession) {
    activeSession.last_seen_at = nowIso;
    if (userId && !activeSession.user_id) {
      activeSession.user_id = userId;
    }
    return activeSession;
  }

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const parsed: AnalyticsSession = JSON.parse(stored);
      // If session exists and is less than 24 hours old, reuse it
      const lastSeen = new Date(parsed.last_seen_at).getTime();
      if (Date.now() - lastSeen < 24 * 60 * 60 * 1000) {
        parsed.last_seen_at = nowIso;
        if (userId && !parsed.user_id) {
          parsed.user_id = userId;
        }
        activeSession = parsed;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[Analytics Tracker] Unable to read localStorage session:", err);
  }

  // First-touch attribution capture
  const queryParams = parseUrlParams();
  const rawReferrer = document.referrer || null;
  const referrerDomain = extractReferrerDomain(rawReferrer);
  const trafficClass = classifyTrafficSource({
    referrer: rawReferrer,
    utm_source: queryParams.utm_source,
    utm_medium: queryParams.utm_medium,
    utm_campaign: queryParams.utm_campaign,
  });

  const newSession: AnalyticsSession = {
    session_id: generateRandomId("hod_sess"),
    user_id: userId || null,
    started_at: nowIso,
    last_seen_at: nowIso,
    utm_source: queryParams.utm_source || null,
    utm_medium: queryParams.utm_medium || null,
    utm_campaign: queryParams.utm_campaign || null,
    utm_content: queryParams.utm_content || null,
    utm_term: queryParams.utm_term || null,
    referrer: rawReferrer,
    referrer_domain: referrerDomain,
    channel: trafficClass.channel,
    landing_page: window.location.pathname + window.location.search,
  };

  activeSession = newSession;

  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
  } catch (err) {
    console.warn("[Analytics Tracker] Unable to write localStorage session:", err);
  }

  return newSession;
}

// ── Deduplication Cache ───────────────────────────────────────────────────────

const recentEventsMemory = new Set<string>();

function isDuplicateEvent(eventId: string): boolean {
  if (recentEventsMemory.has(eventId)) {
    return true;
  }

  if (isBrowser()) {
    try {
      const stored = sessionStorage.getItem(DEDUP_CACHE_KEY);
      if (stored) {
        const set: string[] = JSON.parse(stored);
        if (set.includes(eventId)) {
          return true;
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }

  return false;
}

function markEventProcessed(eventId: string) {
  recentEventsMemory.add(eventId);

  // Keep memory cache constrained
  if (recentEventsMemory.size > 200) {
    const firstItem = recentEventsMemory.values().next().value;
    if (firstItem) recentEventsMemory.delete(firstItem);
  }

  if (isBrowser()) {
    try {
      const stored = sessionStorage.getItem(DEDUP_CACHE_KEY);
      const set: string[] = stored ? JSON.parse(stored) : [];
      set.push(eventId);
      if (set.length > 100) set.shift();
      sessionStorage.setItem(DEDUP_CACHE_KEY, JSON.stringify(set));
    } catch {
      // Ignore
    }
  }
}

// ── Network Delivery ──────────────────────────────────────────────────────────

async function sendBatch(payload: AnalyticsBatchPayload): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    return res.ok;
  } catch (err) {
    console.warn("[Analytics Tracker] Network error forwarding batch:", err);
    return false;
  }
}

export async function flushQueue(): Promise<void> {
  if (!isBrowser() || isFlushing || eventQueue.length === 0) return;

  isFlushing = true;
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const batch = eventQueue.splice(0, BATCH_SIZE);
  const session = getOrCreateSession();

  const payload: AnalyticsBatchPayload = {
    session,
    events: batch,
  };

  const success = await sendBatch(payload);

  if (!success) {
    // If delivery failed, return unsent events to queue (subject to MAX_QUEUE_SIZE)
    eventQueue = [...batch, ...eventQueue].slice(0, MAX_QUEUE_SIZE);
  }

  isFlushing = false;

  // If more items remain in queue, schedule next flush
  if (eventQueue.length > 0) {
    scheduleFlush();
  }
}

function scheduleFlush() {
  if (flushTimer || !isBrowser()) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushQueue();
  }, FLUSH_INTERVAL_MS);
}

function flushSync() {
  if (!isBrowser() || eventQueue.length === 0) return;

  const batch = eventQueue.splice(0, eventQueue.length);
  const session = getOrCreateSession();
  const payload: AnalyticsBatchPayload = {
    session,
    events: batch,
  };

  const dataStr = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([dataStr], { type: "application/json" });
    navigator.sendBeacon(ENDPOINT, blob);
  } else {
    // Fallback to fetch with keepalive
    try {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataStr,
        keepalive: true,
      });
    } catch {
      // Silent error on unload
    }
  }
}

function setupUnloadHooks() {
  if (!isBrowser() || isUnloadHooked) return;
  isUnloadHooked = true;

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushSync();
    }
  });

  window.addEventListener("pagehide", () => {
    flushSync();
  });
}

// ── Public Tracking API ───────────────────────────────────────────────────────

/**
 * Dispatches an analytics event to the client queue in a safe, non-blocking manner.
 * Never throws an exception to ensure storefront operations remain unhindered.
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  options?: TrackEventOptions
): void {
  try {
    if (!isBrowser()) return;

    // Pause telemetry in development mode to prevent terminal log spam and fake metrics
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_DEV_ANALYTICS !== "true") {
      return;
    }

    setupUnloadHooks();

    const session = getOrCreateSession(options?.userId);
    const nowIso = new Date().toISOString();
    const currentPage =
      options?.page || window.location.pathname + window.location.search;

    // Generate deterministic event_id for purchases (evt_order_<orderId>)
    // or standard unique timestamp-random ID for other events
    let eventId: string;
    if (options?.orderId && eventName === "purchase_completed") {
      eventId = `evt_order_${options.orderId}`;
    } else {
      eventId = generateRandomId("evt");
    }

    // Deduplication check
    if (isDuplicateEvent(eventId)) {
      return;
    }

    const eventRecord: RawAnalyticsEvent = {
      event_id: eventId,
      event_name: eventName,
      session_id: session.session_id,
      user_id: options?.userId || session.user_id || null,
      product_id: options?.productId || null,
      variation_id: options?.variationId || null,
      order_id: options?.orderId || null,
      page: currentPage,
      created_at: nowIso,
      properties: options?.properties || {},
    };

    markEventProcessed(eventId);

    if (options?.immediate) {
      // Send immediately bypassing batch delay
      const payload: AnalyticsBatchPayload = {
        session,
        events: [eventRecord],
      };
      sendBatch(payload);
      return;
    }

    eventQueue.push(eventRecord);

    if (eventQueue.length >= BATCH_SIZE) {
      flushQueue();
    } else {
      scheduleFlush();
    }
  } catch (err) {
    // Analytics failures must never break UI execution
    console.warn("[Analytics Tracker] trackEvent failed silently:", err);
  }
}

/**
 * Direct accessor to the active session ID.
 */
export function getActiveSessionId(): string {
  return getOrCreateSession().session_id;
}
