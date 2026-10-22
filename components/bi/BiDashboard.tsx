'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AreaTrendChart } from '../charts/AreaTrendChart';
import { BarComparisonChart } from '../charts/BarComparisonChart';
import { DonutBreakdownChart } from '../charts/DonutBreakdownChart';
import { formatCurrency, toFarsiDigits, exportToCsv, exportToJson } from '../../lib/utils';
import {
  BarChart3,
  Calendar,
  Download,
  DollarSign,
  TrendingDown,
  Zap,
  Leaf,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export function BiDashboard() {
  const { historicalData, currency, lang, theme } = useApp();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'year'>('30d');

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const handleExportCsv = () => {
    const rows = historicalData.map((d) => ({
      Timestamp: d.timeLabel,
      HVAC_Load_kW: d.hvacPowerKw,
      Server_Load_kW: d.serverPowerKw,
      Lighting_Load_kW: d.lightingPowerKw,
      Solar_Gen_kW: d.solarGeneratedKw,
      Outdoor_Temp_C: d.outdoorTemp,
      Indoor_Temp_C: d.indoorTemp,
      Cost_Estimate: d.costEstimate,
      CO2_Kg: d.carbonEmissionKg
    }));
    exportToCsv(rows, `BI_Energy_Report_${dateRange}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Date Range Filter & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            {isFa ? 'هوش تجاری و تحلیل پیشرفته انرژی (BI Analytics)' : 'Business Intelligence & Energy Analytics'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'تحلیل چندبُعدی هزینه‌های انرژی، مقایسه با خط مبنا و گزارش‌های حاکمیت پایداری ESG'
              : 'Multi-dimensional utility cost intelligence, baseline regression models, and ESG compliance'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range picker */}
          <div className="flex bg-neutral-800 p-1 rounded-xl border border-neutral-700 text-xs font-semibold">
            <button
              onClick={() => setDateRange('today')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateRange === 'today' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'امروز' : 'Today'}
            </button>
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateRange === '7d' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? '۷ روز گذشته' : '7 Days'}
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateRange === '30d' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'ماه جاری (۳۰ روز)' : 'Month (30d)'}
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateRange === 'year' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'سالانه' : 'YTD'}
            </button>
          </div>

          {/* Export button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-bold transition"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFa ? 'خروجی CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* 4 BI Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isFa ? 'صورت‌حساب برق دوره' : 'Billed Utility Cost'}</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-3 font-mono">
            <span className="text-2xl font-black text-white">
              {formatCurrency(84500000, currency, lang)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -14.2% {isFa ? 'نسبت به ماه قبل' : 'vs Last Month'}
            </span>
            <span className="text-neutral-500 font-mono">Tariff Peak</span>
          </div>
        </div>

        {/* Total Energy Consumed */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isFa ? 'مجموع انرژی مصرفی (MWh)' : 'Total Energy Usage'}</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-3 font-mono">
            <span className="text-2xl font-black text-cyan-400">
              {toFarsiDigits(38.4, lang)} <span className="text-xs text-neutral-400 font-normal">MWh</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
            <span className="text-emerald-400 font-semibold">
              {isFa ? '۵.۱ MWh کمتر از سقف مجاز' : '5.1 MWh below budget'}
            </span>
          </div>
        </div>

        {/* Solar Generated */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isFa ? 'تولید برق پاک خورشیدی' : 'Solar PV Self-Generation'}</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3 font-mono">
            <span className="text-2xl font-black text-emerald-400">
              {toFarsiDigits(14.8, lang)} <span className="text-xs text-neutral-400 font-normal">MWh</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
            <span className="text-neutral-300">
              {isFa ? 'تأمین ۳۸.۵٪ از نیاز روزانه' : '38.5% Net Zero Offset'}
            </span>
          </div>
        </div>

        {/* Carbon Reduction */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isFa ? 'کاهش آلایندگی کربنی (ESG)' : 'Avoided Carbon Footprint'}</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-3 font-mono">
            <span className="text-2xl font-black text-purple-400">
              {toFarsiDigits(18.2, lang)} <span className="text-xs text-neutral-400 font-normal">Ton CO2e</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
            <span className="text-emerald-400 font-semibold">
              {isFa ? 'انطباق ۱۰۰٪ با گواهی سبز' : 'LEED Gold Certified'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts: Demand Curve & Departmental Baseline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaTrendChart
          data={historicalData}
          title="Hourly Load Curve & Solar Offset"
          titleFa="منحنی بار ساعتی و تعادل تولید خورشیدی (kW)"
        />
        <BarComparisonChart
          title="Department Energy vs Target Baseline (kWh)"
          titleFa="مقایسه مصرف زون‌ها با خط مبنای استاندارد (kWh)"
        />
      </div>

      {/* Subsystem Distribution & Tariff Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DonutBreakdownChart />
        </div>

        {/* Peak vs Off-Peak Tariff Cost Box */}
        <div className="lg:col-span-2 rounded-2xl p-5 border bg-neutral-900 border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-white">
                {isFa ? 'تحلیل هزینه‌ها بر اساس تعرفه سه‌زمانه برق' : 'Time-of-Use Tariff Analysis'}
              </h3>
              <span className="text-xs text-cyan-400 font-mono">TOU Billing Structure</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              {isFa
                ? 'تفکیک هزینه و مصرف انرژی در ساعات اوج بار (Peak)، میان‌باری (Shoulder) و کم‌باری شبانه (Off-Peak)'
                : 'Energy expenditure breakdown across peak tariff, shoulder, and night off-peak slots'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-rose-500/30">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>{isFa ? 'اوج بار (پیک روز)' : 'Peak Window (13-17)'}</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <span className="font-bold font-mono text-rose-400 text-lg block">
                  {formatCurrency(46200000, currency, lang)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {toFarsiDigits(14200, lang)} kWh (54% {isFa ? 'هزینه' : 'cost'})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-800/60 border border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>{isFa ? 'میان‌باری (عادی)' : 'Mid-Peak Shoulder'}</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <span className="font-bold font-mono text-amber-400 text-lg block">
                  {formatCurrency(26100000, currency, lang)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {toFarsiDigits(15800, lang)} kWh (31% {isFa ? 'هزینه' : 'cost'})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-800/60 border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>{isFa ? 'کم‌باری شبانه' : 'Off-Peak (23-07)'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <span className="font-bold font-mono text-emerald-400 text-lg block">
                  {formatCurrency(12200000, currency, lang)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {toFarsiDigits(8400, lang)} kWh (15% {isFa ? 'هزینه' : 'cost'})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>
              💡 {isFa ? 'انتقال ۱۲٪ از بار چیلر به ساعات کم‌باری می‌تواند ماهیانه تا ۴۸ میلیون تومان صرفه‌جویی کند.' : 'Shifting 12% chiller load to off-peak can save $820 monthly.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

