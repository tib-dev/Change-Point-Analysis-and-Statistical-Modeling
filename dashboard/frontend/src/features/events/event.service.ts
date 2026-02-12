import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";

/* ============================
   Types
============================ */

export interface EventQueryParams {
  start?: string;
  end?: string;
  event?: string; // Needed for specific impact analysis
  window?: number; // Optional window for impact calculation
}

export interface EventRecord {
  date: string;
  event_name: string; // Matched to backend 'event_name'
  category: string;
  description?: string;
}

export interface EventImpact {
  event: string;
  date: string;
  metrics: {
    price_pct_change: number;
    volatility_shift: number;
  };
}

/* ============================
   API Calls
============================ */

/**
 * Fetches a list of events filtered by date range
 */
export const getEvents = async (
  params?: EventQueryParams,
): Promise<EventRecord[]> => {
  const res = await api.get<EventRecord[]>(ENDPOINTS.EVENTS, {
    params,
  });
  return res.data;
};

/**
 * Fetches the specific impact metrics for a single event
 * Usage: getEventImpact({ event: 'OPEC Meeting', window: 30 })
 */
export const getEventImpact = async (params: {
  event: string;
  window?: number;
}): Promise<EventImpact> => {
  const res = await api.get<EventImpact>(ENDPOINTS.EVENT_IMPACT, {
    params,
  });
  return res.data;
};
