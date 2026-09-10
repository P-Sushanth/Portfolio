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
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchContributions() {
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const result = await response.json();

        if (isMounted && result && Array.isArray(result.contributions)) {
          // Sort contributions chronologically ascending (oldest first, newest last)
          const sorted = [...result.contributions].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          // Extract the last 364 days (52 weeks)
          const recentContributions = sorted.slice(-364);
          setContributionData(recentContributions);

          // Calculate total contributions for the past year
          const total = recentContributions.reduce((acc, curr) => acc + (curr.count || 0), 0);
          setTotalContributions(total);
          setLoading(false);
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
          setLoading(false);
        }
      }
    }

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, [username]);

  return (
    <div className="github-heatmap-container">
      <div className="github-heatmap-header-row">
        <div className="github-heatmap-title-group">
          <svg className="github-heatmap-octocat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="github-heatmap-heading-text">GitHub Contributions</span>
        </div>
        <div className="github-heatmap-count-badge">
          {loading ? "Syncing..." : `${totalContributions} contributions in past year`}
        </div>
      </div>

      <HeatmapInteractionProvider>
        <HeatmapInteractionBoundary>
          <div className="github-heatmap-flex-stack">
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
