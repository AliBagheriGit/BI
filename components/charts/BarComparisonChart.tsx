'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';

interface BarDataPoint {
  label: string;
  labelFa: string;
  currentKwh: number;
  baselineKwh: number;
  peakHourKwh: number;
}

interface BarComparisonChartProps {
  title?: string;
  titleFa?: string;
  data?: BarDataPoint[];
}

export function BarComparisonChart({ title, titleFa, data }: BarComparisonChartProps) {
  const { lang, theme } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const defaultData: BarDataPoint[] = [
    { label: 'Zone 1 (Eng)', labelFa: 'زون ۱ (مهندسی)', currentKwh: 185, baselineKwh: 220, peakHourKwh: 75 },
    { label: 'Zone 2 (Exec)', labelFa: 'زون ۲ (مدیریت)', currentKwh: 92, baselineKwh: 110, peakHourKwh: 34 },
    { label: 'Zone 3 (Servers)', labelFa: 'زون ۳ (سرورها)', currentKwh: 340, baselineKwh: 350, peakHourKwh: 120 },
    { label: 'Zone 4 (Hall)', labelFa: 'زون ۴ (اجتماعات)', currentKwh: 45, baselineKwh: 95, peakHourKwh: 15 },
    { label: 'Zone 5 (Lounge)', labelFa: 'زون ۵ (کافه)', currentKwh: 135, baselineKwh: 150, peakHourKwh: 52 },
    { label: 'Central Plant', labelFa: 'موتورخانه مرکزی', currentKwh: 410, baselineKwh: 480, peakHourKwh: 180 }
  ];

  const items = data || defaultData;
  const maxVal = Math.max(...items.map((i) => Math.max(i.currentKwh, i.baselineKwh)), 450);

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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            {isFa ? titleFa || 'مصرف انرژی روزانه بر حسب بخش‌ها (kWh)' : title || 'Daily Energy Usage by Department (kWh)'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'مقایسه عملکرد مصرف واقعی در برابر خط پایه استاندارد انرژی (Baseline)'
              : 'Actual consumption vs baseline energy model threshold'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500" />
            <span>{isFa ? 'مصرف واقعی' : 'Actual'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-neutral-600/60 border border-dashed border-neutral-400" />
            <span>{isFa ? 'خط مبنا' : 'Baseline'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {items.map((item, idx) => {
          const actualPct = (item.currentKwh / maxVal) * 100;
          const baselinePct = (item.baselineKwh / maxVal) * 100;
          const savingsPct = Math.round(((item.baselineKwh - item.currentKwh) / item.baselineKwh) * 100);
          const isEfficient = savingsPct >= 0;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2.5 rounded-xl transition ${
                hoveredIdx === idx ? (isDark ? 'bg-neutral-800/60' : 'bg-neutral-100/70') : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="font-bold">{isFa ? item.labelFa : item.label}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-cyan-400 font-bold">{toFarsiDigits(item.currentKwh, lang)} kWh</span>
                  <span className="text-neutral-500">/ {toFarsiDigits(item.baselineKwh, lang)} kWh</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isEfficient
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isEfficient ? `-${toFarsiDigits(savingsPct, lang)}%` : `+${toFarsiDigits(Math.abs(savingsPct), lang)}%`}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="relative h-3 w-full bg-neutral-800 rounded-full overflow-hidden">
                {/* Baseline marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400/80 z-10"
                  style={{ [isFa ? 'right' : 'left']: `${baselinePct}%` }}
                  title="Baseline"
                />
                {/* Actual bar */}
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isCyber
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      : isEfficient
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500'
                  }`}
                  style={{ width: `${actualPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

