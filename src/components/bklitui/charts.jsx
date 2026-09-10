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
    <div className={`bklit-interaction-boundary ${className}`} style={{ position: 'relative', width: '100%' }}>
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

  // Normalize data into weeks (columns of 7 days)
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
      <div
        ref={chartRef}
        className={`bklit-heatmap-chart ${className}`}
        style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'auto', overflowY: 'hidden' }}
      >
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
    <div
      className={`bklit-cells-container ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '8px',
        width: '100%',
        padding: '6px 0',
        overflowX: 'auto',
        overflowY: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <HeatmapYAxis />
      <div
        className="bklit-heatmap-grid"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: `${gap}px`,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '4px 2px 8px 2px',
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        {columns.map((col, colIndex) => (
          <div
            key={col.bin ?? colIndex}
            className="bklit-heatmap-column"
            style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, flexShrink: 0 }}
          >
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
                  className="bklit-heatmap-cell"
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: color,
                    borderRadius: `${cornerRadius}px`,
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease',
                    opacity: isDimmed ? 0.3 : 1,
                    transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                    zIndex: isHovered ? 10 : 1,
                    boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    setHoveredCell(day);
                    const cellRect = e.currentTarget.getBoundingClientRect();
                    const boundary = e.currentTarget.closest('.bklit-interaction-boundary');
                    if (boundary) {
                      const boundaryRect = boundary.getBoundingClientRect();
                      setTooltipState({
                        visible: true,
                        content: day,
                        x: cellRect.left - boundaryRect.left + cellRect.width / 2,
                        y: cellRect.top - boundaryRect.top,
                      });
                    }
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
    <div
      className={`bklit-heatmap-xaxis ${className}`}
      style={{
        display: 'flex',
        width: '100%',
        fontSize: '10px',
        fontFamily: 'monospace',
        color: 'var(--text-muted, #888888)',
        marginBottom: '4px',
        paddingLeft: '34px',
        position: 'relative',
        height: '18px',
        overflow: 'hidden',
      }}
    >
      {months.map((m) => (
        <span
          key={`${m.label}-${m.index}`}
          style={{
            position: 'absolute',
            left: `calc(2.1rem + ${(m.index / Math.max(columns.length, 1)) * 90}%)`,
            transform: 'translateX(-50%)',
            opacity: 0.8,
          }}
        >
          {m.label}
        </span>
      ))}
    </div>
  );
}

export function HeatmapYAxis({ className = '' }) {
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div
      className={`bklit-heatmap-yaxis ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: '9px',
        fontFamily: 'monospace',
        color: 'var(--text-muted, #888888)',
        paddingRight: '6px',
        height: '89px',
        marginTop: '4px',
        flexShrink: 0,
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {days.map((d, i) => (
        <span key={i} style={{ height: '11px', display: 'flex', alignItems: 'center', opacity: 0.7 }}>
          {d}
        </span>
      ))}
    </div>
  );
}

export function HeatmapSeparator({
  groupBy = 'quarter',
  showLabels = true,
  labelClassName = '',
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
    <div
      className="bklit-heatmap-separators"
      style={{
        pointerEvents: 'none',
        position: 'relative',
        width: '100%',
        height: '16px',
        marginTop: '4px',
        overflow: 'hidden',
      }}
    >
      {separators.map((sep) => (
        <div
          key={`${sep.label}-${sep.index}`}
          style={{
            position: 'absolute',
            top: 0,
            left: `calc(2.1rem + ${(sep.index / Math.max(columns.length, 1)) * 90}%)`,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '8px',
              backgroundColor: stroke,
              opacity: 0.5,
            }}
          />
          {showLabels && (
            <span
              className={labelClassName}
              style={{
                fontSize: '9px',
                fontWeight: 600,
                opacity: 0.8,
                fontFamily: 'monospace',
                marginTop: '1px',
              }}
            >
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
      className={`bklit-heatmap-tooltip ${className}`}
      style={{
        position: 'absolute',
        zIndex: 100,
        pointerEvents: 'none',
        transform: 'translate(-50%, -100%)',
        left: `${x}px`,
        top: `${y - 6}px`,
        padding: '6px 12px',
        backgroundColor: 'var(--surface, rgba(18, 18, 18, 0.94))',
        color: 'var(--text, #ffffff)',
        fontSize: '11px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        borderRadius: '6px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--glass-border, rgba(255, 255, 255, 0.15))',
        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.15))',
        backdropFilter: 'blur(10px)',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.15s ease',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '11px', letterSpacing: '0.01em' }}>{countText}</div>
      <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '1px' }}>{formattedDate}</div>
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

  const justifyContent =
    align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div
      className={`bklit-heatmap-legend ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        gap: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        color: 'var(--text-muted, #888888)',
        marginTop: '10px',
      }}
    >
      <span>Less</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${gap}px` }}>
        {levelStyles.map((styleObj, index) => {
          const color = styleObj.color || `var(--chart-scale-0${index + 1})`;
          const isSelected = activeLevelFilter === index;

          return (
            <button
              type="button"
              key={index}
              aria-label={`Filter level ${index}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: color,
                borderRadius: `${cornerRadius}px`,
                border: isSelected ? '2px solid var(--text, #ffffff)' : 'none',
                cursor: 'pointer',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.15s ease',
                padding: 0,
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
