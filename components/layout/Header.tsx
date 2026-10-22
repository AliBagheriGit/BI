'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';
import {
  Play,
  Pause,
  Sun,
  Moon,
  Sparkles,
  Globe,
  Bell,
  RefreshCw,
  Building2
} from 'lucide-react';

export function Header() {
  const {
    lang,
    setLang,
    theme,
    setTheme,
    tempUnit,
    setTempUnit,
    isLiveSimulation,
    setIsLiveSimulation,
    simulationSpeed,
    setSimulationSpeed,
    alerts,
    resetToDefaults,
    setActiveView
  } = useApp();

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md px-4 lg:px-6 py-3 transition-colors ${
        isCyber
          ? 'bg-slate-950/90 border-cyan-500/30 shadow-[0_4px_20px_rgba(6,182,212,0.1)]'
          : isDark
          ? 'bg-neutral-900/90 border-neutral-800'
          : 'bg-white/90 border-neutral-200'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border font-black text-lg ${
              isCyber
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-transparent'
            }`}
          >
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base lg:text-lg tracking-tight">
                {isFa ? 'سامانه هوشمند جامع BI و BAS' : 'APEX Smart BI & BAS Platform'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                v2.6 PRO
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              {isFa
                ? 'اتوماسیون ساختمان، پایش تأسیسات، و هوش تجاری داده‌محور'
                : 'Building Automation, Facility Telemetry & Advanced Business Intelligence'}
            </p>
          </div>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Live Simulation Controls */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveSimulation ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-mono font-medium text-neutral-300">
              {isLiveSimulation ? (isFa ? 'جریان زنده' : 'LIVE') : isFa ? 'متوقف' : 'PAUSED'}
            </span>

            <button
              onClick={() => setIsLiveSimulation(!isLiveSimulation)}
              title={isLiveSimulation ? 'Pause Simulation' : 'Resume Simulation'}
              className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-700 transition ml-1"
            >
              {isLiveSimulation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Speed toggle */}
            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 5 : 1)}
              className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-700 text-cyan-300 font-bold"
              title="Simulation speed multiplier"
            >
              {simulationSpeed}x
            </button>
          </div>

          {/* Temperature Unit */}
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono border bg-neutral-800/40 border-neutral-700 text-neutral-300 hover:text-cyan-400 transition"
            title="Toggle temperature unit"
          >
            °{tempUnit}
          </button>

          {/* Theme Switcher: Dark / Cyber / Light */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'cyber' : theme === 'cyber' ? 'light' : 'dark')}
            className="p-2 rounded-xl border bg-neutral-800/40 border-neutral-700 text-neutral-300 hover:text-white transition"
            title={`Current theme: ${theme}`}
          >
            {theme === 'cyber' ? (
              <Sparkles className="w-4 h-4 text-cyan-400" />
            ) : theme === 'dark' ? (
              <Moon className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-500" />
            )}
          </button>

          {/* Language Toggle: FA / EN */}
          <button
            onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-neutral-800/40 border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white transition"
            title="تغییر زبان / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'fa' ? 'English' : 'فارسی'}</span>
          </button>

          {/* Alarms Bell */}
          <button
            onClick={() => setActiveView('command_center')}
            className="relative p-2 rounded-xl border bg-neutral-800/40 border-neutral-700 text-neutral-300 hover:text-white transition"
            title="Active Alarms"
          >
            <Bell className="w-4 h-4" />
            {unacknowledgedAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                {toFarsiDigits(unacknowledgedAlerts, lang)}
              </span>
            )}
          </button>

          {/* Factory Reset */}
          <button
            onClick={() => {
              if (window.confirm(isFa ? 'آیا به بازنشانی مقادیر پیش‌فرض اطمینان دارید؟' : 'Reset all data to defaults?')) {
                resetToDefaults();
              }
            }}
            className="p-2 rounded-xl border bg-neutral-800/40 border-neutral-700 text-neutral-400 hover:text-rose-400 transition"
            title={isFa ? 'بازنشانی تنظیمات اولیه' : 'Factory Reset'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

