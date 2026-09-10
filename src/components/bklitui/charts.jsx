import React, { createContext, useContext, useState, useMemo, useRef } from 'react';

const HeatmapContext = createContext(null);

export function HeatmapInteractionProvider({ children }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipState, setTooltipState] = useState({ visible: false, content: null, x: 0, y: 0 });
  const [activeLevelFilter, setActiveLevelFilter] = useState(null);

  const value = useMemo(
    () => ({
      hoveredCell,
      setHoveredCell,
      tooltipState,
      setTooltipState,
      activeLevelFilter,
      setActiveLevelFilter,
    }),
    [hoveredCell, tooltipState, activeLevelFilter]
  );

  return (
    <HeatmapContext.Provider value={value}>
      {children}
    </HeatmapContext.Provider>
  );
}

export function useHeatmapContext() {
  const context = useContext(HeatmapContext);
  if (!context) {
    throw new Error('Heatmap components must be wrapped in <HeatmapInteractionProvider>');
  }
  return context;
}

export function HeatmapInteractionBoundary({ children, className = '' }) {
  return (
    <div className={`heatmap-interaction-boundary relative w-full ${className}`}>
      {children}
    </div>
  );
}

const ChartDataContext = createContext(null);

export function HeatmapChart({
  data = [],
  gap = 2,
  levelStyles = [
    { color: 'var(--chart-scale-01)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-02)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-03)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-04)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-05)', fillMode: 'solid', pattern: 'none' },
  ],
  animationDuration = 1100,
  animationEasing = 'cubic-bezier(0.85, 0, 0.916, 0.282)',
  enterTransition,
  enterStaggerScale = 1.0,
  children,
  className = '',
}) {
  const chartRef = useRef(null);

  // Normalize data into weeks (columns)
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (data[0] && Array.isArray(data[0].bins)) {
      return data;
    }
    const cols = [];
    let currentWeek = [];

    data.forEach((day, index) => {
      const dateObj = day.date ? new Date(day.date) : new Date();
      const month = dateObj.getMonth();
      const quarterNum = Math.floor(month / 3) + 1;
      const quarter = `Q${quarterNum}`;

      const dayItem = {
        ...day,
        level: day.level ?? 0,
        count: day.count ?? 0,
        quarter,
      };

      currentWeek.push(dayItem);

      if (currentWeek.length === 7 || index === data.length - 1) {
        cols.push({
          bin: cols.length,
          quarter: currentWeek[0]?.quarter || 'Q1',
          bins: currentWeek,
        });
        currentWeek = [];
      }
    });
    return cols;
  }, [data]);

  const value = useMemo(
    () => ({
      data: columns,
      rawFlatData: data,
      gap,
      levelStyles,
      animationDuration,
      animationEasing,
      enterTransition,
      enterStaggerScale,
      chartRef,
    }),
    [columns, data, gap, levelStyles, animationDuration, animationEasing, enterTransition, enterStaggerScale]
  );

  return (
    <ChartDataContext.Provider value={value}>
      <div ref={chartRef} className={`heatmap-chart-container flex flex-col w-full overflow-x-auto ${className}`}>
        {children}
      </div>
    </ChartDataContext.Provider>
  );
}

export function useChartData() {
  return useContext(ChartDataContext) || {};
}

export function HeatmapCells({ cornerRadius = 2, cellSize = 11, className = '' }) {
  const { data: columns = [], gap = 2, levelStyles = [] } = useChartData();
  const { hoveredCell, setHoveredCell, setTooltipState, activeLevelFilter } = useHeatmapContext();

  return (
    <div className="heatmap-cells-wrapper flex items-start justify-center gap-1 w-full py-1">
      <HeatmapYAxis />
      <div className="heatmap-grid flex items-start gap-[var(--heatmap-gap,2px)] overflow-x-auto pb-1" style={{ '--heatmap-gap': `${gap}px` }}>
        {columns.map((col, colIndex) => (
          <div key={col.bin ?? colIndex} className="heatmap-column flex flex-col gap-[var(--heatmap-gap,2px)]">
            {col.bins.map((day, dayIndex) => {
              const level = Math.min(Math.max(day.level ?? 0, 0), (levelStyles.length || 5) - 1);
              const styleObj = levelStyles[level] || levelStyles[0];
              const color = styleObj?.color || `var(--chart-scale-0${level + 1})`;
              const isHovered = hoveredCell && hoveredCell.date === day.date;
              const isDimmed =
                (hoveredCell && !isHovered) ||
                (activeLevelFilter !== null && activeLevelFilter !== level);

              return (
                <div
                  key={day.date || `${colIndex}-${dayIndex}`}
                  className={`heatmap-cell transition-all duration-200 cursor-pointer ${
                    isHovered ? 'scale-125 z-10 shadow-md ring-1 ring-white/50' : ''
                  } ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: color,
                    borderRadius: `${cornerRadius}px`,
                  }}
                  onMouseEnter={(e) => {
                    setHoveredCell(day);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipState({
                      visible: true,
                      content: day,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredCell(null);
                    setTooltipState({ visible: false, content: null, x: 0, y: 0 });
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeatmapXAxis({ className = '' }) {
  const { data: columns = [] } = useChartData();

  const months = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    let lastMonth = -1;

    columns.forEach((col, index) => {
      const firstDay = col.bins && col.bins[0];
      if (firstDay && firstDay.date) {
        const d = new Date(firstDay.date);
        const m = d.getMonth();
        if (m !== lastMonth) {
          labels.push({ index, label: monthNames[m] });
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [columns]);

  return (
    <div className={`heatmap-x-axis flex w-full text-[10px] text-muted-foreground font-mono mb-1 ${className}`}>
      <div className="relative w-full h-4 overflow-hidden pl-7">
        {months.map((m) => (
          <span
            key={`${m.label}-${m.index}`}
            className="absolute opacity-75 transform -translate-x-1/2"
            style={{ left: `calc(1.75rem + ${(m.index / Math.max(columns.length, 1)) * 90}%)` }}
          >
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HeatmapYAxis({ className = '' }) {
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className={`heatmap-y-axis flex flex-col justify-between text-[9px] text-muted-foreground font-mono pr-1.5 select-none ${className}`} style={{ height: '89px' }}>
      {days.map((d, i) => (
        <span key={i} className="h-[11px] flex items-center opacity-70">
          {d}
        </span>
      ))}
    </div>
  );
}

export function HeatmapSeparator({
  groupBy = 'quarter',
  showLabels = true,
  labelClassName = 'text-black dark:text-white',
  stroke = 'var(--border)',
  spacing = 12,
  startOffset = 14,
}) {
  const { data: columns = [] } = useChartData();

  const separators = useMemo(() => {
    const list = [];
    let prevQuarter = null;

    columns.forEach((col, idx) => {
      const q = col.quarter || (col.bins && col.bins[0] && col.bins[0].quarter);
      if (q && prevQuarter && q !== prevQuarter) {
        list.push({ index: idx, label: q });
      }
      if (q) prevQuarter = q;
    });

    return list;
  }, [columns]);

  if (separators.length === 0) return null;

  return (
    <div className="heatmap-separators-container pointer-events-none relative w-full h-4 mt-1">
      {separators.map((sep) => (
        <div
          key={`${sep.label}-${sep.index}`}
          className="absolute top-0 flex flex-col items-center transform -translate-x-1/2"
          style={{ left: `calc(1.75rem + ${(sep.index / Math.max(columns.length, 1)) * 90}%)` }}
        >
          <div
            className="w-px h-2 opacity-40"
            style={{ backgroundColor: stroke }}
          />
          {showLabels && (
            <span className={`text-[9px] font-semibold opacity-75 ${labelClassName}`}>
              {sep.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function HeatmapTooltip({ className = '' }) {
  const { tooltipState } = useHeatmapContext();

  if (!tooltipState || !tooltipState.visible || !tooltipState.content) return null;

  const { content, x, y } = tooltipState;
  const countText =
    content.count === 0 ? 'No contributions' : `${content.count} contribution${content.count > 1 ? 's' : ''}`;

  let formattedDate = content.date;
  try {
    formattedDate = new Date(content.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {}

  return (
    <div
      className={`fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1.5 bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900 text-[11px] font-mono rounded shadow-lg border border-gray-700/50 dark:border-gray-300/50 backdrop-blur-sm transition-all duration-100 ${className}`}
      style={{ left: `${x}px`, top: `${y - 6}px` }}
    >
      <div className="font-semibold">{countText}</div>
      <div className="text-[10px] opacity-75">{formattedDate}</div>
    </div>
  );
}

export function HeatmapLegend({
  align = 'center',
  cellSize = 11,
  cornerRadius = 2,
  gap = 2,
  levelStyles = [
    { color: 'var(--chart-scale-01)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-02)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-03)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-04)', fillMode: 'solid', pattern: 'none' },
    { color: 'var(--chart-scale-05)', fillMode: 'solid', pattern: 'none' },
  ],
  className = '',
}) {
  const { activeLevelFilter, setActiveLevelFilter } = useHeatmapContext();

  const alignmentClass =
    align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

  return (
    <div className={`heatmap-legend flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-3 ${alignmentClass} ${className}`}>
      <span>Less</span>
      <div className="flex items-center" style={{ gap: `${gap}px` }}>
        {levelStyles.map((styleObj, index) => {
          const color = styleObj.color || `var(--chart-scale-0${index + 1})`;
          const isSelected = activeLevelFilter === index;

          return (
            <button
              type="button"
              key={index}
              aria-label={`Filter level ${index}`}
              className={`transition-all duration-150 ${
                isSelected ? 'ring-2 ring-emerald-500 scale-110' : 'hover:scale-110 opacity-90 hover:opacity-100'
              }`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: color,
                borderRadius: `${cornerRadius}px`,
              }}
              onClick={() => {
                setActiveLevelFilter((prev) => (prev === index ? null : index));
              }}
            />
          );
        })}
      </div>
      <span>More</span>
    </div>
  );
}
