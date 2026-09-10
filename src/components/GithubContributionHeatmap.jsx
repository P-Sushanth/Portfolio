import React, { useEffect, useState } from "react";
import {
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
  HeatmapSeparator,
} from "@bklitui/ui/charts";

const heatmapLevelStyles = [
  { color: "var(--chart-scale-01)", fillMode: "solid", pattern: "none" },
  { color: "var(--chart-scale-02)", fillMode: "solid", pattern: "none" },
  { color: "var(--chart-scale-03)", fillMode: "solid", pattern: "none" },
  { color: "var(--chart-scale-04)", fillMode: "solid", pattern: "none" },
  { color: "var(--chart-scale-05)", fillMode: "solid", pattern: "none" },
];

export default function GithubContributionHeatmap({ username = "P-Sushanth" }) {
  const [contributionData, setContributionData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchContributions() {
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const result = await response.json();

        if (isMounted && result && Array.isArray(result.contributions)) {
          // Sort contributions chronologically ascending
          const sorted = [...result.contributions].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setContributionData(sorted.slice(-364));
        }
      } catch (error) {
        console.warn("Failed to fetch live GitHub contributions:", error);
        if (isMounted) {
          const fallbackDays = [];
          const today = new Date();
          for (let i = 363; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            fallbackDays.push({
              date: d.toISOString().split("T")[0],
              count: 0,
              level: 0,
            });
          }
          setContributionData(fallbackDays);
        }
      }
    }

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, [username]);

  return (
    <div className="github-heatmap-pure-wrapper">
      <HeatmapInteractionProvider>
        <HeatmapInteractionBoundary>
          <div style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
            <HeatmapChart
              data={contributionData}
              gap={2}
              levelStyles={heatmapLevelStyles}
              animationDuration={1100}
              animationEasing="cubic-bezier(0.85, 0, 0.916, 0.282)"
              enterTransition={{ type: "tween", duration: 1.1, ease: [0.85, 0, 0.916, 0.282] }}
              enterStaggerScale={1.0}
            >
              <HeatmapXAxis />
              <HeatmapCells cornerRadius={2} />
              <HeatmapTooltip />
              <HeatmapSeparator
                groupBy="quarter"
                showLabels
                labelClassName="heatmap-separator-label"
                stroke="var(--border)"
                spacing={12}
                startOffset={14}
              />
            </HeatmapChart>
            <HeatmapLegend align="center" cellSize={11} cornerRadius={2} gap={2} levelStyles={heatmapLevelStyles} />
          </div>
        </HeatmapInteractionBoundary>
      </HeatmapInteractionProvider>
    </div>
  );
}
