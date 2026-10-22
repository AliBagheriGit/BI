'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { toFarsiDigits } from '../../lib/utils';
import { AlertCircle, AlertTriangle, Info, Check, ShieldCheck } from 'lucide-react';

export function AlarmFeed() {
  const { alerts, acknowledgeAlert, resolveAlert, lang, theme } = useApp();

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const activeAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isCyber
          ? 'bg-slate-950/80 border-cyan-500/30'
          : isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-white border-neutral-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            {isFa ? 'فید بلادرنگ هشدارهای تأسیساتی و امنیتی' : 'Real-Time Facility Alarms & Events'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'پایش مداوم سنسورها، خطاهای عملگرها و ناهماهنگی‌های بار الکتریکی'
              : 'Continuous monitoring of IoT telemetry faults, damper actuators, and load limits'}
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
          {toFarsiDigits(activeAlerts.length, lang)} {isFa ? 'رویداد فعال' : 'Active'}
        </span>
      </div>

      <div className="space-y-3">
        {activeAlerts.length === 0 ? (
          <div className="py-8 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
            <span className="text-sm font-semibold">
              {isFa ? 'تمامی زیرسیستم‌ها در وضعیت ایده‌آل و بدون هشدار هستند' : 'All subsystems nominal. No active alarms.'}
            </span>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            const isWarn = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isCrit
                    ? 'bg-rose-500/10 border-rose-500/40'
                    : isWarn
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-blue-500/10 border-blue-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isCrit ? (
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-white">
                        {isFa ? alert.titleFa : alert.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-neutral-300">
                        {toFarsiDigits(alert.timestamp, lang)}
                      </span>
                      {alert.zoneNameFa && (
                        <span className="text-[10px] font-medium text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/60">
                          {isFa ? alert.zoneNameFa : alert.zoneName}
                        </span>
                      )}
                      {alert.equipmentName && (
                        <span className="text-[10px] font-medium text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/60">
                          {alert.equipmentName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 mt-1">
                      {isFa ? alert.messageFa : alert.message}
                    </p>
                    {(alert.actionRecommended || alert.actionRecommendedFa) && (
                      <p className="text-[11px] text-amber-300/90 mt-1 font-medium">
                        💡 {isFa ? alert.actionRecommendedFa : alert.actionRecommended}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700 transition"
                    >
                      {isFa ? 'مشاهده شد' : 'Ack'}
                    </button>
                  )}
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isFa ? 'رفع خطا' : 'Resolve'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

