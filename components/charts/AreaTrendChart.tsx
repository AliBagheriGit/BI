'use client';

import React, { useState } from 'react';
import { HistoricalDataPoint } from '../../types/bi-bas';
import { useApp } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';

interface AreaTrendChartProps {
  data: HistoricalDataPoint[];
  title?: string;
  titleFa?: string;
}

export function AreaTrendChart({ data, title, titleFa }: AreaTrendChartProps) {
  const { lang, theme } = useApp();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activeSeries, setActiveSeries] = useState<{ [key: string]: boolean }>({
    hvac: true,
    server: true,
    lighting: true,
    solar: true
  });

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  if (!data || data.length === 0) return null;

  const width = 800;
  const height = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Calculate max value
  const maxVal = Math.max(
    ...data.map((d) =>
      Math.max(
        activeSeries.hvac ? d.hvacPowerKw : 0,
        activeSeries.server ? d.serverPowerKw : 0,
        activeSeries.lighting ? d.lightingPowerKw : 0,
        activeSeries.solar ? d.solarGeneratedKw : 0
      )
    ),
    90
  );

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / maxVal) * graphHeight;

  // Generate cubic bezier SVG path
  const createSmoothPath = (values: number[]) => {
    if (values.length === 0) return '';
    const points = values.map((val, i) => ({ x: getX(i), y: getY(val) }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const createClosedArea = (values: number[]) => {
    const linePath = createSmoothPath(values);
    const bottomY = padding.top + graphHeight;
    const startX = getX(0);
    const endX = getX(values.length - 1);
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  const hvacVals = data.map((d) => d.hvacPowerKw);
  const serverVals = data.map((d) => d.serverPowerKw);
  const solarVals = data.map((d) => d.solarGeneratedKw);

  const hoveredPoint = hoverIndex !== null ? data[hoverIndex] : null;

  const toggleSeries = (key: string) => {
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isCyber
          ? 'bg-slate-950/80 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
          : isDark
          ? 'bg-neutral-900 border-neutral-800 shadow-xl'
          : 'bg-white border-neutral-200 shadow-sm'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            {isFa ? titleFa || 'پروفایل بار الکتریکی و توان ۲۴ ساعته (kW)' : title || '24h Electrical Demand & Load Profile (kW)'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'مقایسه لحظه‌ای مصرف سرمایش، تجهیزات مرکز داده و تولید انرژی پاک خورشیدی'
              : 'Real-time comparison of HVAC load, server racks, and clean solar PV generation'}
          </p>
        </div>

        {/* Legend pills with clickable toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <button
            onClick={() => toggleSeries('hvac')}
            className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 ${
              activeSeries.hvac
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                : 'opacity-40 border-neutral-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {isFa ? 'تهویه و سرمایش' : 'HVAC Chillers'}
          </button>
          <button
            onClick={() => toggleSeries('server')}
            className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 ${
              activeSeries.server
                ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                : 'opacity-40 border-neutral-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            {isFa ? 'مرکز داده' : 'Data Center'}
          </button>
          <button
            onClick={() => toggleSeries('solar')}
            className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 ${
              activeSeries.solar
                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                : 'opacity-40 border-neutral-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {isFa ? 'تولید خورشیدی' : 'Solar PV Gen'}
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            if (relX >= padding.left && relX <= width - padding.right) {
              const ratio = (relX - padding.left) / graphWidth;
              const idx = Math.round(ratio * (data.length - 1));
              setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
            }
          }}
        >
          <defs>
            <linearGradient id="gradHvac" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradServer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradSolar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + graphHeight * (1 - ratio);
            const val = Math.round(ratio * maxVal);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isDark ? '#262626' : '#e5e7eb'}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill={isDark ? '#737373' : '#9ca3af'}
                  className="font-mono"
                >
                  {toFarsiDigits(val, lang)}
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {data.map((d, i) => {
            if (i % 2 !== 0 && i !== data.length - 1) return null;
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fill={isDark ? '#737373' : '#9ca3af'}
                className="font-mono"
              >
                {toFarsiDigits(d.timeLabel, lang)}
              </text>
            );
          })}

          {/* Areas & Paths */}
          {activeSeries.solar && (
            <>
              <path d={createClosedArea(solarVals)} fill="url(#gradSolar)" />
              <path
                d={createSmoothPath(solarVals)}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {activeSeries.server && (
            <>
              <path d={createClosedArea(serverVals)} fill="url(#gradServer)" />
              <path
                d={createSmoothPath(serverVals)}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {activeSeries.hvac && (
            <>
              <path d={createClosedArea(hvacVals)} fill="url(#gradHvac)" />
              <path
                d={createSmoothPath(hvacVals)}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Interactive Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + graphHeight}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {activeSeries.hvac && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(data[hoverIndex].hvacPowerKw)}
                  r="5"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
              {activeSeries.server && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(data[hoverIndex].serverPowerKw)}
                  r="5"
                  fill="#a855f7"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
              {activeSeries.solar && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(data[hoverIndex].solarGeneratedKw)}
                  r="5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </g>
          )}
        </svg>

        {/* Hover Floating Tooltip Card */}
        {hoveredPoint && hoverIndex !== null && (
          <div
            className={`absolute top-2 pointer-events-none p-3 rounded-xl border text-xs shadow-2xl backdrop-blur-md transition-all ${
              getX(hoverIndex) > width / 2 ? 'left-14' : 'right-14'
            } ${
              isCyber
                ? 'bg-slate-900/90 border-cyan-500/50 text-white shadow-cyan-500/20'
                : isDark
                ? 'bg-neutral-900/95 border-neutral-700 text-white'
                : 'bg-white/95 border-neutral-300 text-neutral-900 shadow-md'
            }`}
          >
            <div className="font-bold border-b pb-1 mb-2 border-neutral-700/50 flex items-center justify-between gap-4">
              <span>{isFa ? `ساعت: ${toFarsiDigits(hoveredPoint.timeLabel, lang)}` : `Time: ${hoveredPoint.timeLabel}`}</span>
              <span className="text-cyan-400 font-mono">
                {isFa
                  ? `${toFarsiDigits(hoveredPoint.hvacPowerKw + hoveredPoint.serverPowerKw, lang)} kW بار شبکه`
                  : `${hoveredPoint.hvacPowerKw + hoveredPoint.serverPowerKw} kW Load`}
              </span>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between gap-3 text-cyan-400">
                <span>{isFa ? 'تهویه و چیلر:' : 'HVAC Chillers:'}</span>
                <span className="font-bold">{toFarsiDigits(hoveredPoint.hvacPowerKw, lang)} kW</span>
              </div>
              <div className="flex justify-between gap-3 text-purple-400">
                <span>{isFa ? 'مرکز داده:' : 'Data Center:'}</span>
                <span className="font-bold">{toFarsiDigits(hoveredPoint.serverPowerKw, lang)} kW</span>
              </div>
              <div className="flex justify-between gap-3 text-amber-400">
                <span>{isFa ? 'تولید خورشیدی:' : 'Solar Gen:'}</span>
                <span className="font-bold">{toFarsiDigits(hoveredPoint.solarGeneratedKw, lang)} kW</span>
              </div>
              <div className="flex justify-between gap-3 text-neutral-400 border-t border-neutral-800 pt-1">
                <span>{isFa ? 'دمای بیرون / داخل:' : 'Temp Out/In:'}</span>
                <span>
                  {toFarsiDigits(hoveredPoint.outdoorTemp, lang)}° / {toFarsiDigits(hoveredPoint.indoorTemp, lang)}°
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

