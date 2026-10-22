'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandCenter } from '../overview/CommandCenter';
import { BasDashboard } from '../bas/BasDashboard';
import { RuleEngineView } from '../automation/RuleEngineView';
import { BiDashboard } from '../bi/BiDashboard';
import { EquipmentHealthView } from '../equipment/EquipmentHealthView';
import { AiInsightsView } from '../insights/AiInsightsView';
import { ReportsView } from '../reports/ReportsView';
import { ZoneControlDrawer } from '../bas/ZoneControlDrawer';

export function AppShell() {
  const { activeView, lang, theme } = useApp();

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  return (
    <div
      dir={isFa ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isCyber
          ? 'bg-slate-950 text-slate-100'
          : isDark
          ? 'bg-neutral-950 text-neutral-100'
          : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Top Header */}
      <Header />

      {/* Main Body with Sidebar + Content Area */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1720px] mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'command_center' && <CommandCenter />}
          {activeView === 'bas_zones' && <BasDashboard />}
          {activeView === 'rules' && <RuleEngineView />}
          {activeView === 'bi_analytics' && <BiDashboard />}
          {activeView === 'equipment' && <EquipmentHealthView />}
          {activeView === 'insights' && <AiInsightsView />}
          {activeView === 'export' && <ReportsView />}
        </main>
      </div>

      {/* Zone Control Drawer / Modal */}
      <ZoneControlDrawer />
    </div>
  );
}

