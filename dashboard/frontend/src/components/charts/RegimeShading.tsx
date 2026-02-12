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

interface Props {
  regimes: Regime[];
  animate?: boolean;
}

/* ----------------------------------
   Component
---------------------------------- */

export const RegimeShading = memo(({ regimes, animate = false }: Props) => {
  if (!Array.isArray(regimes) || regimes.length === 0) return null;

  return (
    <>
      {regimes
        .filter(
          (r) =>
            typeof r.start === "number" &&
            typeof r.end === "number" &&
            r.end > r.start,
        )
        .map((r) => (
          <ReferenceArea
            key={`${r.start}-${r.end}`}
            x1={r.start}
            x2={r.end}
            fill={
              r.type === "high"
                ? financialTheme.regimeHigh
                : financialTheme.regimeLow
            }
            fillOpacity={0.12}
            ifOverflow="extendDomain"
            isAnimationActive={animate}
            animationDuration={400}
          />
        ))}
    </>
  );
});

RegimeShading.displayName = "RegimeShading";
