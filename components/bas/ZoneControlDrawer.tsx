'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { HvacMode, FanSpeed } from '../../types/bi-bas';
import { toFarsiDigits, formatTemp } from '../../lib/utils';
import { X, Thermometer, Wind, Lightbulb, Activity, CheckCircle, ShieldAlert } from 'lucide-react';

export function ZoneControlDrawer() {
  const {
    selectedZone,
    setSelectedZoneId,
    updateZoneHvac,
    updateZoneLighting,
    lang,
    theme,
    tempUnit
  } = useApp();

  if (!selectedZone) return null;

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const handleClose = () => setSelectedZoneId(null);

  const hvacModes: { id: HvacMode; label: string; labelFa: string; color: string }[] = [
    { id: 'auto', label: 'Auto', labelFa: 'خودکار', color: 'bg-blue-600' },
    { id: 'cooling', label: 'Cool', labelFa: 'سرمایش', color: 'bg-cyan-600' },
    { id: 'heating', label: 'Heat', labelFa: 'گرمایش', color: 'bg-amber-600' },
    { id: 'eco', label: 'Eco', labelFa: 'اقتصادی', color: 'bg-emerald-600' },
    { id: 'off', label: 'Off', labelFa: 'خاموش', color: 'bg-neutral-700' }
  ];

  const fanSpeeds: { id: FanSpeed; label: string; labelFa: string }[] = [
    { id: 'auto', label: 'Auto', labelFa: 'خودکار' },
    { id: 'low', label: 'Low', labelFa: 'کم' },
    { id: 'med', label: 'Medium', labelFa: 'متوسط' },
    { id: 'high', label: 'High', labelFa: 'زیاد' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl rounded-2xl border p-6 shadow-2xl transition-all ${
          isCyber
            ? 'bg-slate-950 border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
            : isDark
            ? 'bg-neutral-900 border-neutral-700 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                ZONE {selectedZone.id.replace('zone-', '')}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {isFa ? `طبقه ${toFarsiDigits(selectedZone.floor, lang)}` : `Floor ${selectedZone.floor}`}
              </span>
            </div>
            <h3 className="text-xl font-black mt-1">
              {isFa ? selectedZone.nameFa : selectedZone.name}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-6 pt-5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Quick Realtime Stats bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
              <span className="text-neutral-400 block text-[11px] mb-1">{isFa ? 'دمای فعلی' : 'Current Temp'}</span>
              <span className="font-bold font-mono text-cyan-400 text-sm">
                {formatTemp(selectedZone.currentTemp, tempUnit, lang)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
              <span className="text-neutral-400 block text-[11px] mb-1">{isFa ? 'رطوبت نسبی' : 'Humidity'}</span>
              <span className="font-bold font-mono text-sm text-white">
                {toFarsiDigits(selectedZone.humidity, lang)}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
              <span className="text-neutral-400 block text-[11px] mb-1">{isFa ? 'کیفیت هوا AQI' : 'Air Quality'}</span>
              <span className="font-bold font-mono text-emerald-400 text-sm">
                {toFarsiDigits(selectedZone.airQualityIndex, lang)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
              <span className="text-neutral-400 block text-[11px] mb-1">{isFa ? 'توان مصرفی' : 'Load Power'}</span>
              <span className="font-bold font-mono text-amber-300 text-sm">
                {toFarsiDigits(selectedZone.powerConsumptionKw, lang)} kW
              </span>
            </div>
          </div>

          {/* HVAC Temperature Setpoint Adjustment */}
          <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                {isFa ? 'تنظیم دمای مطلوب (Setpoint)' : 'Thermostat Target Setpoint'}
              </label>
              <span className="text-lg font-black font-mono text-cyan-400">
                {formatTemp(selectedZone.targetTemp, tempUnit, lang)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-neutral-400">18°C</span>
              <input
                type="range"
                min="18"
                max="26"
                step="0.5"
                value={selectedZone.targetTemp}
                onChange={(e) =>
                  updateZoneHvac(selectedZone.id, { targetTemp: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-neutral-700 rounded-lg appearance-none"
              />
              <span className="text-xs font-mono text-neutral-400">26°C</span>
            </div>
          </div>

          {/* HVAC Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {isFa ? 'حالت عملکرد سیستم تهویه (HVAC Mode)' : 'HVAC Operational Mode'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {hvacModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => updateZoneHvac(selectedZone.id, { hvacStatus: mode.id })}
                  className={`py-2 px-1 text-xs rounded-xl font-bold transition flex flex-col items-center gap-1 border ${
                    selectedZone.hvacStatus === mode.id
                      ? `${mode.color} text-white border-white/40 shadow-lg`
                      : 'bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                >
                  {isFa ? mode.labelFa : mode.label}
                  {selectedZone.hvacStatus === mode.id && <CheckCircle className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              {isFa ? 'سرعت فن دهش هواساز (Fan Speed)' : 'VAV Supply Fan Speed'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {fanSpeeds.map((fs) => (
                <button
                  key={fs.id}
                  onClick={() => updateZoneHvac(selectedZone.id, { fanSpeed: fs.id })}
                  className={`py-2 text-xs rounded-xl font-semibold transition border ${
                    selectedZone.fanSpeed === fs.id
                      ? 'bg-neutral-700 text-cyan-300 border-cyan-400 shadow'
                      : 'bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                >
                  {isFa ? fs.labelFa : fs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Lighting Control */}
          <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold">
                  {isFa ? 'روشنایی هوشمند زون' : 'Smart Zone Lighting'}
                </span>
              </div>
              <button
                onClick={() =>
                  updateZoneLighting(selectedZone.id, {
                    lightingStatus: !selectedZone.lightingStatus,
                    lightingBrightness: selectedZone.lightingStatus ? 0 : 80
                  })
                }
                className={`px-3 py-1 text-xs rounded-full font-bold transition border ${
                  selectedZone.lightingStatus
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-700 text-neutral-400 border-neutral-600'
                }`}
              >
                {selectedZone.lightingStatus
                  ? isFa
                    ? 'روشن (فعال)'
                    : 'ON'
                  : isFa
                  ? 'خاموش'
                  : 'OFF'}
              </button>
            </div>

            {selectedZone.lightingStatus && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>{isFa ? 'شدت نور LED:' : 'Brightness level:'}</span>
                  <span className="font-mono font-bold text-amber-300">
                    {toFarsiDigits(selectedZone.lightingBrightness, lang)}% ({toFarsiDigits(selectedZone.luxLevel, lang)} Lux)
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={selectedZone.lightingBrightness}
                  onChange={(e) =>
                    updateZoneLighting(selectedZone.id, {
                      lightingBrightness: parseInt(e.target.value)
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-700 rounded-lg appearance-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-5 border-t border-neutral-800 mt-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>{isFa ? 'حفاظت ترموستاتی فعال' : 'Safety interlock active'}</span>
          </div>
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition"
          >
            {isFa ? 'تأیید و ذخیره تنظیمات' : 'Apply & Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

