import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";

/* ============================
   Types
============================ */

export interface PriceQueryParams {
  start?: string;
  end?: string;
}

export interface PriceRecord {
  date: string;
  price: number;
  log_return?: number;
}

/* ============================
   API Call
============================ */

export const getPrices = async (
  params?: PriceQueryParams,
): Promise<PriceRecord[]> => {
  const res = await api.get<PriceRecord[]>(ENDPOINTS.PRICES, { params });

  // 1. Guard against null/non-array responses
  if (!Array.isArray(res.data)) {
    console.error("API returned non-array data for prices:", res.data);
    return [];
  }

  // 2. Normalize, parse, and sort
  return (
    res.data
      .map((p) => ({
        ...p,
        // Ensure numerical types to prevent .toFixed() errors in UI
        price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
        log_return:
          p.log_return !== undefined ? Number(p.log_return) : undefined,
      }))
      // 3. Filter out invalid dates or NaN prices that might break Recharts
      .filter((p) => !isNaN(p.price) && p.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );
};
