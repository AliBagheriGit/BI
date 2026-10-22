'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, toFarsiDigits } from '../../lib/utils';
import {
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle,
  Lightbulb,
  Sliders,
  DollarSign,
  Leaf,
  ShieldCheck
} from 'lucide-react';

export function AiInsightsView() {
  const { insights, applyInsight, currency, lang, theme } = useApp();
  const [setpointDelta, setSetpointDelta] = useState<number>(1.5);
  const [extraSolarKw, setExtraSolarKw] = useState<number>(40);

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  // Simulation calculations
  const simulatedSavingsToman = Math.round(setpointDelta * 18000000 + extraSolarKw * 550000);
  const simulatedKwhSaved = Math.round(setpointDelta * 920 + extraSolarKw * 140);
  const simulatedCo2SavedKg = Math.round(simulatedKwhSaved * 0.54);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {isFa ? 'پیشنهادات و بهینه‌سازی‌های هوش مصنوعی (AI Insights)' : 'AI-Driven Predictive Insights & Optimization'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'تحلیل الگوریتمی رفتار حرارتی، پیش‌بینی بار مصرفی و فرصت‌های کاهش هزینه‌های بهره‌برداری'
              : 'Algorithmic thermodynamic modeling, predictive energy trimming, and automated ROI suggestions'}
          </p>
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isCyber
            ? 'bg-slate-950/80 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
            : isDark
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-neutral-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-base text-white">
            {isFa ? 'شبیه‌ساز هوشمند صرفه‌جویی هزینه و انرژی (Digital Twin Sandbox)' : 'Interactive Energy Savings Sandbox'}
          </h3>
        </div>
        <p className="text-xs text-neutral-400 mb-5">
          {isFa
            ? 'تغییرات سناریو را بررسی کنید تا بازدهی مالی و زیست‌محیطی آن را به صورت بلادرنگ مشاهده نمایید'
            : 'Adjust operational variables to observe real-time projected bill reductions and carbon offsets'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sliders */}
          <div className="space-y-4">
            {/* Setpoint shift */}
            <div className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-300">
                  {isFa ? 'تعدیل دمای ست‌پوینت در ساعات پیک:' : 'Thermostat Setpoint Delta (Peak Hours):'}
                </span>
                <span className="font-bold font-mono text-cyan-400">
                  +{toFarsiDigits(setpointDelta, lang)}°C
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.5"
                value={setpointDelta}
                onChange={(e) => setSetpointDelta(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-neutral-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>+0.5°C</span>
                <span>+3.0°C</span>
              </div>
            </div>

            {/* Extra Solar */}
            <div className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-300">
                  {isFa ? 'ظرفیت پیشنهادی توسعه پنل خورشیدی:' : 'Simulated Rooftop Solar Expansion:'}
                </span>
                <span className="font-bold font-mono text-amber-400">
                  +{toFarsiDigits(extraSolarKw, lang)} kWp
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={extraSolarKw}
                onChange={(e) => setExtraSolarKw(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>0 kWp</span>
                <span>100 kWp</span>
              </div>
            </div>
          </div>

          {/* Realtime Projected Outcomes Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-neutral-900 border border-cyan-500/30 flex flex-col justify-between">
            <span className="text-xs font-bold text-cyan-300">
              {isFa ? 'نتایج پیش‌بینی‌شده مدل هوش مصنوعی' : 'Projected Model Outcomes'}
            </span>

            <div className="my-3 space-y-3 font-mono">
              <div>
                <span className="text-[11px] text-neutral-400 block mb-0.5">
                  {isFa ? 'صرفه‌جویی ماهیانه در هزینه برق:' : 'Estimated Monthly Bill Reduction:'}
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  {formatCurrency(simulatedSavingsToman, currency, lang)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[10px]">{isFa ? 'کاهش مصرف:' : 'Energy saved:'}</span>
                  <span className="font-bold text-cyan-300">
                    {toFarsiDigits(simulatedKwhSaved, lang)} kWh/mo
                  </span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[10px]">{isFa ? 'کاهش آلایندگی:' : 'CO2 Avoided:'}</span>
                  <span className="font-bold text-emerald-300">
                    {toFarsiDigits(simulatedCo2SavedKg, lang)} kg/mo
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[10px] text-neutral-400">
              {isFa
                ? 'محاسبه شده بر اساس الگوریتم رگرسیون مصرف ASHRAE Guideline 14'
                : 'Calibrated via ASHRAE Guideline 14 baseline inverse regression model'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white">
          {isFa ? 'اقدامات پیشنهادی اولویت‌بندی شده' : 'Prioritized Optimization Strategies'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => {
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  item.implemented
                    ? 'bg-neutral-900/60 border-emerald-500/40'
                    : isCyber
                    ? 'bg-slate-950/80 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        item.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {item.priority} PRIORITY
                    </span>

                    {item.implemented ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {isFa ? 'اعمال شده' : 'Applied'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-cyan-400">
                        {formatCurrency(item.potentialMonthlySavingsToman, currency, lang)}/mo
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-white">
                    {isFa ? item.titleFa : item.title}
                  </h4>
                  <p className="text-xs text-cyan-300/90 font-medium mt-1">
                    🎯 {isFa ? item.impactFa : item.impact}
                  </p>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {isFa ? item.descriptionFa : item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-400">
                    <span>{toFarsiDigits(item.energyReductionKwh, lang)} kWh</span> •{' '}
                    <span>{toFarsiDigits(item.co2ReductionKg, lang)} kg CO2</span>
                  </div>

                  {!item.implemented ? (
                    <button
                      onClick={() => applyInsight(item.id)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
                    >
                      {isFa ? 'اعمال راهکار' : 'Apply Strategy'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-default"
                    >
                      {isFa ? 'فعال در سامانه' : 'Active'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

