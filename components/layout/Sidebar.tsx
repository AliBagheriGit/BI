'use client';

import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';
import {
  LayoutDashboard,
  Cpu,
  Wrench,
  Sliders,
  BarChart3,
  Lightbulb,
  FileDown,
  ShieldCheck,
  Zap
} from 'lucide-react';

export function Sidebar() {
  const { activeView, setActiveView, lang, theme, rules, alerts } = useApp();

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const activeRulesCount = rules.filter((r) => r.isEnabled).length;

  const navItems: {
    id: AppView;
    title: string;
    titleFa: string;
    icon: React.ElementType;
    badge?: string | number;
  }[] = [
    {
      id: 'command_center',
      title: 'Command Center',
      titleFa: 'مرکز فرماندهی',
      icon: LayoutDashboard,
      badge: unacknowledgedCount > 0 ? unacknowledgedCount : undefined
    },
    {
      id: 'bas_zones',
      title: 'BAS & Floorplan',
      titleFa: 'اتوماسیون ساختمان',
      icon: Cpu
    },
    {
      id: 'rules',
      title: 'Automation Rules',
      titleFa: 'موتور قوانین و اتوماسیون',
      icon: Sliders,
      badge: activeRulesCount
    },
    {
      id: 'bi_analytics',
      title: 'BI & Energy Analytics',
      titleFa: 'هوش تجاری و انرژی',
      icon: BarChart3
    },
    {
      id: 'equipment',
      title: 'Facility Assets',
      titleFa: 'پایش تجهیزات و تأسیسات',
      icon: Wrench
    },
    {
      id: 'insights',
      title: 'AI Smart Insights',
      titleFa: 'پیشنهادات هوش مصنوعی',
      icon: Lightbulb
    },
    {
      id: 'export',
      title: 'Reports & Export',
      titleFa: 'گزارش‌ساز و خروجی',
      icon: FileDown
    }
  ];

  return (
    <aside
      className={`w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-e p-3 flex md:flex-col justify-between transition-colors ${
        isCyber
          ? 'bg-slate-950/80 border-cyan-500/20'
          : isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-neutral-50 border-neutral-200'
      }`}
    >
      <div className="flex md:flex-col gap-1 w-full overflow-x-auto md:overflow-x-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? isCyber
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : isDark
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                    : 'bg-white text-neutral-900 border border-neutral-300 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-neutral-400'
                  }`}
                />
                <span>{isFa ? item.titleFa : item.title}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    typeof item.badge === 'number' && item.badge > 0 && item.id === 'command_center'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-neutral-700 text-neutral-300'
                  }`}
                >
                  {toFarsiDigits(item.badge, lang)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Facility Operational Badge in Sidebar Footer */}
      <div className="hidden md:block pt-4 border-t border-neutral-800/60 mt-4">
        <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/40 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isFa ? 'امنیت و ارتباط BACnet' : 'BACnet / Modbus'}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {isFa ? 'ضریب توان الکتریکی' : 'Power Factor'}
            </span>
            <span className="font-mono text-white font-bold">0.96 cosφ</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

