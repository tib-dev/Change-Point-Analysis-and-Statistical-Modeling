import { memo } from "react";
import { ReferenceArea } from "recharts";
import { financialTheme } from "./ChartTheme";

/* ----------------------------------
   Types
---------------------------------- */
export type RegimeType = "high" | "low";

export interface Regime {
  start: number; // timestamp
  end: number; // timestamp
  type: RegimeType;
}

interface RegimeShadingProps {
  regimes: Regime[];
  // Note: We keep animate in the props if you want to use it for other logic,
  // but we remove it from the ReferenceArea itself.
  animate?: boolean;
}

/* ----------------------------------
   Component
---------------------------------- */
export const RegimeShading = memo(({ regimes }: RegimeShadingProps) => {
  if (!Array.isArray(regimes) || regimes.length === 0) return null;

  return (
    <>
      {regimes
        .filter(
          (r) =>
            typeof r.start === "number" &&
            typeof r.end === "number" &&
            r.end > r.start &&
            Number.isFinite(r.start) &&
            Number.isFinite(r.end),
        )
        .map((r) => (
          <ReferenceArea
            key={`${r.start}-${r.end}-${r.type}`}
            x1={r.start}
            x2={r.end}
            fill={
              r.type === "high"
                ? financialTheme.regimeHigh
                : financialTheme.regimeLow
            }
            fillOpacity={0.12}
            stroke="none"
            // ifOverflow is valid, but isAnimationActive is not.
            ifOverflow="extendDomain"
          />
        ))}
    </>
  );
});

RegimeShading.displayName = "RegimeShading";
