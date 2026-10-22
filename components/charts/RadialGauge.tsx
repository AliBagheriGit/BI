'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';

interface RadialGaugeProps {
  value: number; // e.g. 0 to 100 or COP 0 to 8
  min?: number;
  max?: number;
  label: string;
  labelFa: string;
  unit?: string;
  unitFa?: string;
  thresholds?: { warning: number; critical: number };
  colorScheme?: 'green-red' | 'cyan' | 'amber';
}

export function RadialGauge({
  value,
  min = 0,
  max = 100,
  label,
  labelFa,
  unit = '%',
  unitFa = '٪',
  colorScheme = 'cyan'
}: RadialGaugeProps) {
  const { lang, theme } = useApp();
  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const clampedVal = Math.max(min, Math.min(max, value));
  const ratio = (clampedVal - min) / (max - min);

  // Semi-circle gauge (180 degrees)
  const radius = 75;
  const stroke = 12;
  const arcLength = Math.PI * radius;
  const dashOffset = arcLength * (1 - ratio);

  // Color selection
  let strokeColor = '#06b6d4';
  if (colorScheme === 'green-red') {
    if (ratio >= 0.8) strokeColor = '#10b981';
    else if (ratio >= 0.5) strokeColor = '#f59e0b';
    else strokeColor = '#ef4444';
  } else if (colorScheme === 'amber') {
    strokeColor = '#f59e0b';
  }

  return (
    <div
      className={`rounded-2xl p-4 border flex flex-col items-center justify-between text-center transition-all ${
        isCyber
          ? 'bg-slate-950/70 border-cyan-500/30'
          : isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-white border-neutral-200'
      }`}
    >
      <div className="w-full text-start mb-1">
        <span className="text-xs font-semibold text-neutral-400">
          {isFa ? labelFa : label}
        </span>
      </div>

      <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
        <svg className="w-44 h-44 overflow-visible" viewBox="0 0 180 180">
          {/* Background track (semi circle from 180 to 0 deg) */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke={isDark ? '#262626' : '#e5e7eb'}
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Active colored arc */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
            style={{
              filter: isCyber ? `drop-shadow(0 0 6px ${strokeColor})` : undefined
            }}
          />
        </svg>

        {/* Central Display */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-2xl font-black font-mono tracking-tight text-white">
            {toFarsiDigits(value.toFixed(1), lang)}
            <span className="text-xs font-normal text-neutral-400 ml-1">
              {isFa ? unitFa : unit}
            </span>
          </span>
        </div>
      </div>

      <div className="w-full flex justify-between text-[10px] text-neutral-500 font-mono px-4 mt-2">
        <span>{toFarsiDigits(min, lang)}</span>
        <span>{toFarsiDigits(max, lang)}</span>
      </div>
    </div>
  );
}

