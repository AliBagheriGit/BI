'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateRuleModal } from './CreateRuleModal';
import { toFarsiDigits } from '../../lib/utils';
import {
  Sliders,
  Plus,
  Play,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Zap,
  Activity,
  Clock
} from 'lucide-react';

export function RuleEngineView() {
  const { rules, toggleRule, deleteRule, executeRuleManually, lang, theme } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const totalExecutions = rules.reduce((acc, r) => acc + r.executionCount, 0);
  const activeCount = rules.filter((r) => r.isEnabled).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            {isFa ? 'موتور قوانین و اتوماسیون هوشمند (Rule Engine)' : 'Automation & Business Rules Engine'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'مدیریت سناریوهای خودکار سازی هوشمند انرژی، واکنش‌های حرارتی و تنظیمات خودکار تجهیزات'
              : 'Autonomous event-driven actions, HVAC load shed triggers, and daylight compensation rules'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs md:text-sm shadow-lg shadow-cyan-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          {isFa ? 'تعریف قانون جدید' : 'New Automation Rule'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">{isFa ? 'قوانین فعال' : 'Active Rules'}</span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {toFarsiDigits(activeCount, lang)} / {toFarsiDigits(rules.length, lang)}
            </span>
          </div>
          <Activity className="w-6 h-6 text-cyan-400 opacity-60" />
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">{isFa ? 'مجموع اجراهای خودکار' : 'Total Executions'}</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {toFarsiDigits(totalExecutions, lang)}
            </span>
          </div>
          <Zap className="w-6 h-6 text-emerald-400 opacity-60" />
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">{isFa ? 'وضعیت سامانه تصمیم‌گیر' : 'Rule Engine Status'}</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isFa ? 'پایش لحظه‌ای فعال' : 'Autonomous Active'}
            </span>
          </div>
          <Clock className="w-6 h-6 text-purple-400 opacity-60" />
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                rule.isEnabled
                  ? isCyber
                    ? 'bg-slate-950/80 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-white border-neutral-200'
                  : 'bg-neutral-950/40 border-neutral-800 opacity-60'
              }`}
            >
              {/* Left details */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="mt-0.5 text-neutral-400 hover:text-cyan-400 transition"
                  title={rule.isEnabled ? 'Disable' : 'Enable'}
                >
                  {rule.isEnabled ? (
                    <ToggleRight className="w-7 h-7 text-cyan-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-neutral-600" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm md:text-base text-white">
                      {isFa ? rule.titleFa : rule.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-cyan-300">
                      {rule.triggerCategory} {rule.operator} {rule.thresholdValue}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      → {rule.actionType} ({rule.actionParameter})
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400">
                    {isFa ? rule.descriptionFa : rule.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono pt-1">
                    <span>
                      {isFa ? 'تعداد دفعات اجرا: ' : 'Executions: '}
                      <strong className="text-white">{toFarsiDigits(rule.executionCount, lang)}</strong>
                    </span>
                    {rule.lastTriggeredTime && (
                      <span>
                        {isFa ? 'آخرین فعال‌سازی: ' : 'Last fired: '}
                        <strong className="text-neutral-300">{rule.lastTriggeredTime}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => executeRuleManually(rule.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700 text-xs font-semibold transition"
                  title="Test trigger rule manually"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  {isFa ? 'تست دستی' : 'Test Run'}
                </button>

                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition"
                  title="Delete rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <CreateRuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

