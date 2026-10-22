'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';

interface DonutSlice {
  label: string;
  labelFa: string;
  value: number;
  color: string;
}

export function DonutBreakdownChart() {
  const { lang, theme } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const data: DonutSlice[] = [
    { label: 'HVAC & Chillers', labelFa: 'سرمایش و تهویه مطبوع', value: 52, color: '#06b6d4' },
    { label: 'Data Center & IT', labelFa: 'تجهیزات فناوری و اتاق سرور', value: 26, color: '#a855f7' },
    { label: 'Lighting Systems', labelFa: 'روشنایی داخلی و نما', value: 14, color: '#eab308' },
    { label: 'Pumps & Aux', labelFa: 'پمپ‌ها و مصارف عمومی', value: 8, color: '#10b981' }
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  // SVG parameters
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

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
      <div className="mb-4">
        <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          {isFa ? 'تفکیک سهم بار مصرفی ساختمان' : 'Load Consumption Distribution'}
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          {isFa ? 'توزیع درصدی مصرف توان الکتریکی زیرسیستم‌ها' : 'Percentage breakdown across major building subsystems'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* SVG Circular Donut */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {data.map((slice, i) => {
              const strokeDasharray = `${(slice.value / total) * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += slice.value / total;
              const isHovered = hoveredIdx === i;

              return (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${slice.color})` : undefined
                  }}
                />
              );
            })}
          </svg>

          {/* Central Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {hoveredIdx !== null ? (
              <>
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {toFarsiDigits(data[hoveredIdx].value, lang)}%
                </span>
                <span className="text-[11px] text-neutral-400 max-w-[100px] truncate">
                  {isFa ? data[hoveredIdx].labelFa : data[hoveredIdx].label}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-black font-mono">100%</span>
                <span className="text-[11px] text-neutral-400">
                  {isFa ? 'مجموع توان' : 'Total Load'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 w-full sm:w-auto">
          {data.map((slice, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between gap-4 p-2 rounded-lg cursor-pointer transition text-xs ${
                hoveredIdx === i
                  ? isDark
                    ? 'bg-neutral-800'
                    : 'bg-neutral-100'
                  : 'hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-md shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-medium text-neutral-300">
                  {isFa ? slice.labelFa : slice.label}
                </span>
              </div>
              <span className="font-bold font-mono text-neutral-100">
                {toFarsiDigits(slice.value, lang)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

