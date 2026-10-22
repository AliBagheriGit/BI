'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { KpiStatCard } from './KpiStatCard';
import { AreaTrendChart } from '../charts/AreaTrendChart';
import { DonutBreakdownChart } from '../charts/DonutBreakdownChart';
import { RadialGauge } from '../charts/RadialGauge';
import { InteractiveFloorPlan } from '../bas/InteractiveFloorPlan';
import { AlarmFeed } from './AlarmFeed';
import { formatTemp, formatCurrency } from '../../lib/utils';
import {
  Zap,
  Sun,
  Thermometer,
  ShieldAlert,
  Gauge,
  TrendingDown,
  DollarSign
} from 'lucide-react';

export function CommandCenter() {
  const {
    telemetry,
    historicalData,
    alerts,
    lang,
    tempUnit,
    currency,
    setActiveView
  } = useApp();

  const isFa = lang === 'fa';
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length;

  // Extract recent values for mini sparklines
  const powerSparkline = historicalData.map((h) => h.hvacPowerKw + h.serverPowerKw);
  const solarSparkline = historicalData.map((h) => h.solarGeneratedKw);
  const tempSparkline = historicalData.map((h) => h.indoorTemp);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Ticker */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-slate-950 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <h2 className="text-sm font-bold text-white">
              {isFa ? 'پایش زنده مجتمع مرکزی هوشمند' : 'Central Smart Facility Live Telemetry'}
            </h2>
            <span className="text-xs text-neutral-400">
              {isFa
                ? 'اتصال پایدار با پروتکل‌های BACnet/IP و Modbus TCP • ۵ زون فعال'
                : 'Connected via BACnet/IP & Modbus TCP • 5 Active Zones'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="text-neutral-500">{isFa ? 'نرخ لحظه‌ای هزینه:' : 'Cost Rate:'}</span>
            <span className="text-amber-400 font-bold">
              {formatCurrency(telemetry.energyCostRatePerHour, currency, lang)}/h
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="text-neutral-500">{isFa ? 'دبی آب چیلر:' : 'Chilled Water Flow:'}</span>
            <span className="text-cyan-400 font-bold">{telemetry.waterFlowRateLpm} LPM</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="text-neutral-500">{isFa ? 'دمای هوای آزاد:' : 'Ambient Temp:'}</span>
            <span className="text-white font-bold">
              {formatTemp(telemetry.outdoorTemp, tempUnit, lang)}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Top Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Total Building Power"
          titleFa="توان مصرفی کل ساختمان"
          value={telemetry.totalPowerKw}
          unit="kW"
          unitFa="کیلووات"
          trendText="4.8% below daily peak cap"
          trendTextFa="۴.۸٪ پایین‌تر از سقف اوج بار"
          trendDirection="up"
          sparklineData={powerSparkline}
          sparklineColor="#06b6d4"
          icon={Zap}
          iconColor="text-cyan-400"
          badge="REALTIME"
        />

        <KpiStatCard
          title="Rooftop Solar Yield"
          titleFa="تولید انرژی خورشیدی بام"
          value={telemetry.solarGenKw}
          unit="kW"
          unitFa="کیلووات"
          trendText="Offloading 39% grid load"
          trendTextFa="پوشش ۳۹٪ از کل مصرف شبکه"
          trendDirection="up"
          sparklineData={solarSparkline}
          sparklineColor="#f59e0b"
          icon={Sun}
          iconColor="text-amber-400"
          badge="CLEAN ESG"
        />

        <KpiStatCard
          title="Average Indoor Climate"
          titleFa="میانگین دمای مطبوع داخلی"
          value={telemetry.avgIndoorTemp}
          unit={`°${tempUnit}`}
          unitFa={`°${tempUnit}`}
          trendText="98.2% Comfort Compliance"
          trendTextFa="۹۸.۲٪ انطباق با استاندارد ASHRAE"
          trendDirection="up"
          sparklineData={tempSparkline}
          sparklineColor="#10b981"
          icon={Thermometer}
          iconColor="text-emerald-400"
        />

        <KpiStatCard
          title="Active System Alarms"
          titleFa="هشدارهای تأسیساتی فعال"
          value={unacknowledgedAlerts}
          unit="Events"
          unitFa="مورد"
          trendText={unacknowledgedAlerts === 0 ? 'Zero critical faults' : 'Requires facility review'}
          trendTextFa={unacknowledgedAlerts === 0 ? 'کلیه واحدها در وضعیت نرمال' : 'نیاز به بازبینی کارشناس تأسیسات'}
          trendDirection={unacknowledgedAlerts === 0 ? 'up' : 'down'}
          icon={ShieldAlert}
          iconColor={unacknowledgedAlerts > 0 ? 'text-rose-400' : 'text-emerald-400'}
          badge={unacknowledgedAlerts > 0 ? 'ATTENTION' : 'NOMINAL'}
        />
      </div>

      {/* Main Visuals Grid: 24h Area Chart & Donut Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AreaTrendChart data={historicalData} />
        </div>
        <div className="lg:col-span-1">
          <DonutBreakdownChart />
        </div>
      </div>

      {/* Gauge Row: Chiller COP & Facility Health & Carbon Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RadialGauge
          value={telemetry.chillerCop}
          min={3.0}
          max={7.5}
          label="Chiller Plant COP Efficiency"
          labelFa="ضریب بازدهی چیلر مرکزی (COP)"
          unit="COP"
          unitFa="COP"
          colorScheme="cyan"
        />
        <RadialGauge
          value={94.5}
          min={0}
          max={100}
          label="Facility Reliability Index"
          labelFa="شاخص تاب‌آوری و سلامت تجهیزات"
          unit="%"
          unitFa="٪"
          colorScheme="green-red"
        />
        <div className="rounded-2xl p-4 border bg-neutral-900 border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">
              {isFa ? 'صرفه‌جویی کربن ماه جاری (ESG)' : 'Carbon Offsetting (ESG)'}
            </span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black font-mono text-emerald-400">
              1,420 <span className="text-xs font-normal text-neutral-400">kg CO2</span>
            </span>
            <p className="text-xs text-neutral-400 mt-1">
              {isFa
                ? 'معادل کاشت ۶۸ اصله درخت با بهره‌گیری از هوای تازه و سلول خورشیدی'
                : 'Equivalent to 68 planted trees via solar generation & night economizer cycles'}
            </p>
          </div>
          <button
            onClick={() => setActiveView('bi_analytics')}
            className="text-xs text-cyan-400 hover:underline text-start font-semibold"
          >
            {isFa ? 'مشاهده تحلیل جامع کربن و انرژی ←' : 'View Full Carbon & Energy Analytics →'}
          </button>
        </div>
      </div>

      {/* Interactive Floorplan Section */}
      <InteractiveFloorPlan />

      {/* Alarms Feed */}
      <AlarmFeed />
    </div>
  );
}

