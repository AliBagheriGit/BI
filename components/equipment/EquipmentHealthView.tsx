'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EquipmentAsset } from '../../types/bi-bas';
import { toFarsiDigits } from '../../lib/utils';
import {
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Gauge,
  Zap,
  ShieldCheck
} from 'lucide-react';

export function EquipmentHealthView() {
  const { equipment, lang, theme } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<EquipmentAsset | null>(null);

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            {isFa ? 'پایش سلامت تجهیزات و نگهداری پیشگیرانه (PdM)' : 'Facility Equipment Health & Predictive Maintenance'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'پایش لرزش یاتاقان‌ها، ساعات کارکرد (MTBF)، راندمان چیلرها و دیزل ژنراتور اضطراری'
              : 'Condition monitoring, bearing vibration analysis, runtime hours, and chiller COP diagnostics'}
          </p>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {equipment.map((asset) => {
          const isWarning = asset.status === 'warning';
          const isNominal = asset.status === 'nominal';

          return (
            <div
              key={asset.id}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isWarning
                  ? 'bg-neutral-900 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                  : isCyber
                  ? 'bg-slate-950/70 border-cyan-500/30'
                  : isDark
                  ? 'bg-neutral-900 border-neutral-800'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 uppercase">
                    {asset.type}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                      isNominal
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {isNominal ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {asset.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mt-2">
                  {isFa ? asset.nameFa : asset.name}
                </h3>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  {asset.model} • S/N: {asset.serialNumber}
                </span>
                <span className="text-[11px] text-cyan-400/90 font-medium block mt-1">
                  📍 {isFa ? asset.locationFa : asset.location}
                </span>

                {/* Health Score Bar */}
                <div className="my-4 p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-neutral-400">{isFa ? 'شاخص سلامت دستگاه (Health Score)' : 'Health Index'}</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        asset.healthScore >= 90
                          ? 'text-emerald-400'
                          : asset.healthScore >= 75
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {toFarsiDigits(asset.healthScore, lang)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        asset.healthScore >= 90
                          ? 'bg-emerald-500'
                          : asset.healthScore >= 75
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${asset.healthScore}%` }}
                    />
                  </div>
                </div>

                {/* Sensor Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/40 flex justify-between items-center">
                    <span className="text-neutral-400">{isFa ? 'درصد بار:' : 'Load:'}</span>
                    <span className="font-mono font-bold text-white">
                      {toFarsiDigits(asset.loadPercentage, lang)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/40 flex justify-between items-center">
                    <span className="text-neutral-400">{isFa ? 'دمای کارکرد:' : 'Op Temp:'}</span>
                    <span className="font-mono font-bold text-white">
                      {toFarsiDigits(asset.operatingTemp, lang)}°C
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/40 flex justify-between items-center">
                    <span className="text-neutral-400">{isFa ? 'لرزش یاتاقان:' : 'Vibration:'}</span>
                    <span
                      className={`font-mono font-bold ${
                        asset.vibrationMmPerSec > 3 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {toFarsiDigits(asset.vibrationMmPerSec, lang)} mm/s
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/40 flex justify-between items-center">
                    <span className="text-neutral-400">{isFa ? 'کارکرد:' : 'Runtime:'}</span>
                    <span className="font-mono font-bold text-neutral-300">
                      {toFarsiDigits(asset.runningHours, lang)} h
                    </span>
                  </div>
                </div>
              </div>

              {/* Maintenance Schedule Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isFa ? 'سرویس بعدی:' : 'Next service:'} {asset.nextServiceDueDate}</span>
                </div>
                <button
                  onClick={() => alert(isFa ? `درخواست سرویس دوره‌ای برای ${asset.nameFa} ثبت شد.` : `Maintenance request registered for ${asset.name}.`)}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700 font-medium transition"
                >
                  {isFa ? 'ثبت سرویس' : 'Service'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

