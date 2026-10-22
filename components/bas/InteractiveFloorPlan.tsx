'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuildingZone } from '../../types/bi-bas';
import { toFarsiDigits, formatTemp } from '../../lib/utils';
import { Users, Zap, Wind, Lightbulb, AlertTriangle } from 'lucide-react';

interface InteractiveFloorPlanProps {
  onSelectZone?: (zone: BuildingZone) => void;
}

export function InteractiveFloorPlan({ onSelectZone }: InteractiveFloorPlanProps) {
  const { zones, lang, theme, tempUnit, setSelectedZoneId } = useApp();
  const [selectedFloor, setSelectedFloor] = useState<number>(2);
  const [viewMode, setViewMode] = useState<'thermal' | 'occupancy' | 'power'>('thermal');

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const filteredZones = zones.filter((z) => z.floor === selectedFloor);

  const handleZoneClick = (zone: BuildingZone) => {
    setSelectedZoneId(zone.id);
    if (onSelectZone) onSelectZone(zone);
  };

  // Color gradient based on mode
  const getZoneBackgroundColor = (zone: BuildingZone) => {
    if (viewMode === 'thermal') {
      if (zone.currentTemp < 21) return 'rgba(6, 182, 212, 0.22)'; // Cyan cool
      if (zone.currentTemp <= 23) return 'rgba(16, 185, 129, 0.22)'; // Green optimal
      return 'rgba(245, 158, 11, 0.28)'; // Amber warm
    }
    if (viewMode === 'occupancy') {
      const occRatio = zone.occupancy / zone.maxCapacity;
      if (occRatio === 0) return 'rgba(100, 116, 139, 0.15)';
      if (occRatio < 0.5) return 'rgba(59, 130, 246, 0.25)';
      return 'rgba(236, 72, 153, 0.3)'; // Pink busy
    }
    // Power density
    if (zone.powerConsumptionKw > 30) return 'rgba(168, 85, 247, 0.35)'; // High server load
    return 'rgba(6, 182, 212, 0.2)';
  };

  const getZoneBorderColor = (zone: BuildingZone) => {
    if (viewMode === 'thermal') {
      if (zone.currentTemp < 21) return '#06b6d4';
      if (zone.currentTemp <= 23) return '#10b981';
      return '#f59e0b';
    }
    if (viewMode === 'occupancy') {
      return zone.occupancy > 0 ? '#3b82f6' : '#64748b';
    }
    return zone.powerConsumptionKw > 30 ? '#c084fc' : '#22d3ee';
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
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {isFa ? 'نقشه تعاملی و مانیتورینگ بلادرنگ ساختمان (BAS)' : 'Interactive Real-Time Floorplan (BAS)'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'روی هر زون کلیک کنید تا تنظیمات ترموستات، جریان هوا و روشنایی را تغییر دهید'
              : 'Click any zone to control thermostat setpoints, damper airflow, and lighting'}
          </p>
        </div>

        {/* Floor selector & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Floor tabs */}
          <div className="flex bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/60 text-xs font-medium">
            <button
              onClick={() => setSelectedFloor(2)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFloor === 2
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'طبقه ۲ (اداری)' : 'Floor 2 (Office)'}
            </button>
            <button
              onClick={() => setSelectedFloor(1)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFloor === 1
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'طبقه ۱ (مرکز داده / همایش)' : 'Floor 1 (Data & Hall)'}
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/60 text-xs font-medium">
            <button
              onClick={() => setViewMode('thermal')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                viewMode === 'thermal'
                  ? 'bg-neutral-700 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'نقشه حرارتی' : 'Thermal'}
            </button>
            <button
              onClick={() => setViewMode('occupancy')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                viewMode === 'occupancy'
                  ? 'bg-neutral-700 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'حضور افراد' : 'Occupancy'}
            </button>
            <button
              onClick={() => setViewMode('power')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                viewMode === 'power'
                  ? 'bg-neutral-700 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'چگالی توان' : 'Power'}
            </button>
          </div>
        </div>
      </div>

      {/* SVG Blueprint Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] bg-neutral-950 rounded-xl border border-neutral-800/80 p-2 overflow-hidden shadow-inner">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Blueprint outer boundary walls */}
        <div className="absolute inset-4 border-2 border-dashed border-cyan-500/20 rounded-lg pointer-events-none" />

        {/* Render Zones */}
        <div className="relative w-full h-full p-4 flex flex-col md:flex-row gap-4">
          {filteredZones.map((zone) => {
            const isHighThermal = zone.currentTemp > 23.5;
            const isDataCenter = zone.id === 'zone-3';

            return (
              <div
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                className="flex-1 relative rounded-xl p-4 border transition-all duration-300 cursor-pointer group hover:scale-[1.01] hover:shadow-2xl flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: getZoneBackgroundColor(zone),
                  borderColor: getZoneBorderColor(zone),
                  boxShadow: `0 0 15px ${getZoneBorderColor(zone)}25`
                }}
              >
                {/* Background pulse glow */}
                <div
                  className="absolute -right-12 -top-12 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40"
                  style={{ backgroundColor: getZoneBorderColor(zone) }}
                />

                {/* Zone Header */}
                <div className="flex items-start justify-between gap-2 z-10">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-400">
                        Z-{toFarsiDigits(zone.floor, lang)}.{toFarsiDigits(zone.id.replace('zone-', ''), lang)}
                      </span>
                      {isHighThermal && (
                        <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                      )}
                      {isDataCenter && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                          Tier III
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm md:text-base text-white mt-1 group-hover:text-cyan-300 transition">
                      {isFa ? zone.nameFa : zone.name}
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      {toFarsiDigits(zone.areaSqMeters, lang)} m² • {toFarsiDigits(zone.floor, lang)}{' '}
                      {isFa ? 'طبقه' : 'Floor'}
                    </span>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize border ${
                      zone.hvacStatus === 'cooling'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : zone.hvacStatus === 'heating'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : zone.hvacStatus === 'eco'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-neutral-700/40 text-neutral-400 border-neutral-600'
                    }`}
                  >
                    {zone.hvacStatus}
                  </span>
                </div>

                {/* Live Sensor Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 my-3 z-10">
                  {/* Temp */}
                  <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      {isFa ? 'دما' : 'Temp'}
                    </span>
                    <span className="font-bold font-mono text-sm text-white">
                      {formatTemp(zone.currentTemp, tempUnit, lang)}
                    </span>
                  </div>

                  {/* Occupancy */}
                  <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {isFa ? 'حضور' : 'People'}
                    </span>
                    <span className="font-bold font-mono text-sm text-white">
                      {toFarsiDigits(zone.occupancy, lang)} / {toFarsiDigits(zone.maxCapacity, lang)}
                    </span>
                  </div>

                  {/* Power */}
                  <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {isFa ? 'توان' : 'Power'}
                    </span>
                    <span className="font-bold font-mono text-sm text-amber-300">
                      {toFarsiDigits(zone.powerConsumptionKw, lang)} kW
                    </span>
                  </div>

                  {/* Lighting */}
                  <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />
                      {isFa ? 'نور' : 'Light'}
                    </span>
                    <span className="font-bold font-mono text-sm text-white">
                      {toFarsiDigits(zone.lightingBrightness, lang)}%
                    </span>
                  </div>
                </div>

                {/* Footer action hint */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/10 pt-2 z-10">
                  <span className="font-mono text-[10px]">
                    CO2: {toFarsiDigits(zone.co2Ppm, lang)} ppm
                  </span>
                  <span className="text-cyan-400 group-hover:underline font-medium">
                    {isFa ? 'تنظیمات زون ←' : 'Control Zone →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

