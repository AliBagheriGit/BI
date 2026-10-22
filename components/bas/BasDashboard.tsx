'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveFloorPlan } from './InteractiveFloorPlan';
import { formatTemp, toFarsiDigits } from '../../lib/utils';
import {
  Wind,
  Thermometer,
  Lightbulb,
  Users,
  Activity,
  Sliders,
  Gauge
} from 'lucide-react';

export function BasDashboard() {
  const {
    zones,
    updateZoneHvac,
    updateZoneLighting,
    setSelectedZoneId,
    lang,
    theme,
    tempUnit
  } = useApp();

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Overview header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            {isFa ? 'مدیریت و اتوماسیون زون‌های ساختمان (BAS)' : 'Building Automation & Zone Management'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'کنترل متمرکز ترموستات‌ها، دمپرهای VAV، سامانه‌های هوارسان و روشنایی هوشمند'
              : 'Direct supervisory control over VAV dampers, setpoints, air quality, and smart luminaire networks'}
          </p>
        </div>
      </div>

      {/* Interactive Blueprint Floorplan */}
      <InteractiveFloorPlan />

      {/* Individual Zone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone) => {
          return (
            <div
              key={zone.id}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isCyber
                  ? 'bg-slate-950/70 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : isDark
                  ? 'bg-neutral-900 border-neutral-800'
                  : 'bg-white border-neutral-200'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    FLOOR {zone.floor} • Z-{zone.id.replace('zone-', '')}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      zone.hvacStatus === 'cooling'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : zone.hvacStatus === 'heating'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : zone.hvacStatus === 'eco'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {zone.hvacStatus}
                  </span>
                </div>

                <h3 className="font-bold text-base mt-2 text-white">
                  {isFa ? zone.nameFa : zone.name}
                </h3>
                <span className="text-xs text-neutral-400">
                  {toFarsiDigits(zone.areaSqMeters, lang)} m² • {toFarsiDigits(zone.occupancy, lang)}/{toFarsiDigits(zone.maxCapacity, lang)} {isFa ? 'نفر' : 'Occupants'}
                </span>
              </div>

              {/* Live Gauges row */}
              <div className="grid grid-cols-3 gap-2 my-4 text-center">
                <div className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                  <span className="text-[10px] text-neutral-400 block mb-0.5">{isFa ? 'دما' : 'Temp'}</span>
                  <span className="font-bold font-mono text-cyan-400 text-sm">
                    {formatTemp(zone.currentTemp, tempUnit, lang)}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                  <span className="text-[10px] text-neutral-400 block mb-0.5">{isFa ? 'رطوبت' : 'Humidity'}</span>
                  <span className="font-bold font-mono text-white text-sm">
                    {toFarsiDigits(zone.humidity, lang)}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                  <span className="text-[10px] text-neutral-400 block mb-0.5">CO2</span>
                  <span className="font-bold font-mono text-emerald-400 text-sm">
                    {toFarsiDigits(zone.co2Ppm, lang)}
                  </span>
                </div>
              </div>

              {/* Setpoint Slider Control */}
              <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/50 space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    {isFa ? 'دمای درخواستی (Setpoint):' : 'Setpoint:'}
                  </span>
                  <span className="font-bold font-mono text-cyan-400">
                    {formatTemp(zone.targetTemp, tempUnit, lang)}
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="26"
                  step="0.5"
                  value={zone.targetTemp}
                  onChange={(e) =>
                    updateZoneHvac(zone.id, { targetTemp: parseFloat(e.target.value) })
                  }
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-700 rounded-lg appearance-none"
                />
              </div>

              {/* Lighting & Damper Quick status */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateZoneLighting(zone.id, {
                        lightingStatus: !zone.lightingStatus,
                        lightingBrightness: zone.lightingStatus ? 0 : 75
                      })
                    }
                    className={`p-1.5 rounded-lg border transition ${
                      zone.lightingStatus
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                    }`}
                    title="Toggle Lighting"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-neutral-300">
                    {zone.lightingStatus ? `${toFarsiDigits(zone.lightingBrightness, lang)}%` : isFa ? 'خاموش' : 'OFF'}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedZoneId(zone.id)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-400 border border-neutral-700 font-semibold text-xs transition"
                >
                  {isFa ? 'تنظیمات پیشرفته' : 'Advanced Config'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

