import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";

/* ============================
   Types
============================ */

export interface ChangePointQueryParams {
  start?: string;
  end?: string;
}

export interface ChangePoint {
  date: string;
  associated_event: string;
  event_category: string;
  // Mathematical shifts
  mu_pre_change: number; // Mean return before shift
  mu_post_change: number; // Mean return after shift
  sigma_pre_change: number; // Volatility before shift
  sigma_post_change: number; // Volatility after shift
  // Metadata
  median_tau_index: number;
  proximity_days: number;
}

/* ============================
   API Call
============================ */

export const getChangePoints = async (
  params?: ChangePointQueryParams,
): Promise<ChangePoint[]> => {
  const res = await api.get<ChangePoint[]>(ENDPOINTS.CHANGEPOINTS, { params });

  // Optional: You can sort them by date here to ensure the UI renders correctly
  return res.data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};
