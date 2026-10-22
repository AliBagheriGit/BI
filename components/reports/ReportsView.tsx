'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, toFarsiDigits, exportToCsv, exportToJson } from '../../lib/utils';
import {
  FileDown,
  Printer,
  Table,
  FileSpreadsheet,
  FileCode,
  CheckCircle,
  Building2,
  Calendar
} from 'lucide-react';

export function ReportsView() {
  const { historicalData, zones, equipment, telemetry, currency, lang, theme } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json'>('csv');

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const handleExportCsv = () => {
    const data = historicalData.map((d) => ({
      Timestamp: d.timeLabel,
      HVAC_Load_kW: d.hvacPowerKw,
      Server_Load_kW: d.serverPowerKw,
      Lighting_Load_kW: d.lightingPowerKw,
      Solar_Gen_kW: d.solarGeneratedKw,
      Outdoor_Temp_C: d.outdoorTemp,
      Indoor_Temp_C: d.indoorTemp,
      Cost_IRR: d.costEstimate,
      CO2_Kg: d.carbonEmissionKg
    }));
    exportToCsv(data, 'Smart_Facility_Telemetry_Export');
  };

  const handleExportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      currentTelemetry: telemetry,
      zones,
      equipment,
      historicalData
    };
    exportToJson(payload, 'Smart_Facility_Full_Snapshot');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileDown className="w-5 h-5 text-cyan-400" />
            {isFa ? 'مرکز تولید گزارش و خروجی داده‌ها (BI Reports)' : 'Reporting & Data Export Center'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isFa
              ? 'دریافت گزارش‌های دوره‌ای برای مدیریت ارشد، ممیزی انرژی ISO 50001 و تحلیل آفلاین'
              : 'Generate executive audit reports, ISO 50001 compliance logs, and raw telemetry extracts'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>{isFa ? 'چاپ گزارش (Print / PDF)' : 'Print / Save PDF'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition shadow-lg shadow-cyan-500/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isFa ? 'دانلود فایل CSV' : 'Download CSV'}</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
          >
            <FileCode className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Summary Sheet Preview */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isCyber
            ? 'bg-slate-950/80 border-cyan-500/30'
            : isDark
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-neutral-200'
        }`}
      >
        <div className="border-b border-neutral-800 pb-4 mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="font-black text-lg text-white">
                {isFa ? 'خلاصه وضعیت اجرایی هوش تجاری و اتوماسیون تأسیسات' : 'Executive Energy & Facility Status Brief'}
              </h3>
              <span className="text-xs text-neutral-400">
                {isFa ? 'دوره گزارش‌گیری: ماه جاری • پروژه: ساختمان مرکزی' : 'Reporting Window: Month to Date • Central Campus'}
              </span>
            </div>
          </div>
          <div className="text-end text-xs font-mono text-neutral-400">
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-6">
          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-neutral-400 block mb-1">{isFa ? 'مجموع برق مصرفی' : 'Total Energy'}</span>
            <span className="font-mono font-bold text-base text-cyan-400">
              {toFarsiDigits(38400, lang)} kWh
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-neutral-400 block mb-1">{isFa ? 'سهم انرژی خورشیدی' : 'Clean Solar Share'}</span>
            <span className="font-mono font-bold text-base text-amber-400">
              {toFarsiDigits(38.5, lang)}% (14.8 MWh)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-neutral-400 block mb-1">{isFa ? 'برآورد هزینه برق' : 'Projected Billed Cost'}</span>
            <span className="font-mono font-bold text-base text-emerald-400">
              {formatCurrency(84500000, currency, lang)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-neutral-400 block mb-1">{isFa ? 'میانگین دمای مجتمع' : 'Mean Facility Temp'}</span>
            <span className="font-mono font-bold text-base text-white">
              {toFarsiDigits(22.3, lang)}°C
            </span>
          </div>
        </div>

        {/* Historical Raw Telemetry Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              {isFa ? 'جدول ثبت لاگ‌های تله‌متری ۲۴ ساعته' : '24-Hour Telemetry Audit Records'}
            </h4>
            <span className="text-xs text-neutral-400 font-mono">
              {toFarsiDigits(historicalData.length, lang)} {isFa ? 'ردیف ثبت شده' : 'Records'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-xs text-start">
              <thead className="bg-neutral-800/80 text-neutral-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3 text-start">{isFa ? 'ساعت' : 'Time'}</th>
                  <th className="p-3 text-start">{isFa ? 'توان چیلر (kW)' : 'HVAC (kW)'}</th>
                  <th className="p-3 text-start">{isFa ? 'سرور روم (kW)' : 'Server (kW)'}</th>
                  <th className="p-3 text-start">{isFa ? 'روشنایی (kW)' : 'Lights (kW)'}</th>
                  <th className="p-3 text-start">{isFa ? 'خورشیدی (kW)' : 'Solar (kW)'}</th>
                  <th className="p-3 text-start">{isFa ? 'دمای داخل' : 'Indoor'}</th>
                  <th className="p-3 text-start">{isFa ? 'دمای خارج' : 'Outdoor'}</th>
                  <th className="p-3 text-start">{isFa ? 'کربن (kg)' : 'CO2 (kg)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono">
                {historicalData.map((row, i) => (
                  <tr key={i} className="hover:bg-neutral-800/40 transition">
                    <td className="p-3 font-bold text-neutral-200">{toFarsiDigits(row.timeLabel, lang)}</td>
                    <td className="p-3 text-cyan-400">{toFarsiDigits(row.hvacPowerKw, lang)}</td>
                    <td className="p-3 text-purple-400">{toFarsiDigits(row.serverPowerKw, lang)}</td>
                    <td className="p-3 text-yellow-300">{toFarsiDigits(row.lightingPowerKw, lang)}</td>
                    <td className="p-3 text-amber-400">{toFarsiDigits(row.solarGeneratedKw, lang)}</td>
                    <td className="p-3 text-white">{toFarsiDigits(row.indoorTemp, lang)}°C</td>
                    <td className="p-3 text-neutral-400">{toFarsiDigits(row.outdoorTemp, lang)}°C</td>
                    <td className="p-3 text-emerald-400">{toFarsiDigits(row.carbonEmissionKg, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

