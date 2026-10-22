'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';
import { MiniSparkline } from '../charts/MiniSparkline';
import { LucideIcon } from 'lucide-react';

interface KpiStatCardProps {
  title: string;
  titleFa: string;
  value: string | number;
  unit?: string;
  unitFa?: string;
  trendText?: string;
  trendTextFa?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  sparklineColor?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
}

export function KpiStatCard({
  title,
  titleFa,
  value,
  unit = '',
  unitFa = '',
  trendText,
  trendTextFa,
  trendDirection = 'neutral',
  sparklineData,
  sparklineColor = '#06b6d4',
  icon: Icon,
  iconColor = 'text-cyan-400',
  badge
}: KpiStatCardProps) {
  const { lang, theme } = useApp();
  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden group hover:scale-[1.01] ${
        isCyber
          ? 'bg-slate-950/70 border-cyan-500/20 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
          : isDark
          ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-md'
          : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl bg-neutral-800/80 border border-neutral-700/60 ${iconColor}`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-400 block">
              {isFa ? titleFa : title}
            </span>
          </div>
        </div>

        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-2">
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            {toFarsiDigits(value, lang)}
          </span>
          {(unit || unitFa) && (
            <span className="text-xs font-medium text-neutral-400">
              {isFa ? unitFa || unit : unit}
            </span>
          )}
        </div>

        {sparklineData && (
          <div className="shrink-0">
            <MiniSparkline data={sparklineData} color={sparklineColor} />
          </div>
        )}
      </div>

      {(trendText || trendTextFa) && (
        <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
          <span
            className={`font-semibold ${
              trendDirection === 'up'
                ? 'text-emerald-400'
                : trendDirection === 'down'
                ? 'text-rose-400'
                : 'text-neutral-400'
            }`}
          >
            {isFa ? trendTextFa : trendText}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            {isFa ? 'بروزرسانی زنده' : 'Updated Live'}
          </span>
        </div>
      )}
    </div>
  );
}

