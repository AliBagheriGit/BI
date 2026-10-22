'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AutomationRule } from '../../types/bi-bas';
import { X, Sliders, CheckCircle } from 'lucide-react';

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRuleModal({ isOpen, onClose }: CreateRuleModalProps) {
  const { addRule, zones, lang, theme } = useApp();

  const [title, setTitle] = useState('');
  const [titleFa, setTitleFa] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionFa, setDescriptionFa] = useState('');
  const [triggerCategory, setTriggerCategory] = useState<AutomationRule['triggerCategory']>('temperature');
  const [operator, setOperator] = useState<AutomationRule['operator']>('>=');
  const [thresholdValue, setThresholdValue] = useState<number>(24);
  const [targetZoneId, setTargetZoneId] = useState<'all' | string>('all');
  const [actionType, setActionType] = useState<AutomationRule['actionType']>('adjust_temp');
  const [actionParameter, setActionParameter] = useState<string | number>(21);

  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const isCyber = theme === 'cyber';
  const isDark = theme === 'dark' || isCyber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !titleFa) return;

    addRule({
      title: title || titleFa,
      titleFa: titleFa || title,
      description: description || 'Custom automation rule created by operator',
      descriptionFa: descriptionFa || 'قانون اتوماسیون سفارشی تعریف شده توسط اپراتور',
      triggerCategory,
      operator,
      thresholdValue: Number(thresholdValue),
      targetZoneId,
      actionType,
      actionParameter,
      isEnabled: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
          isCyber
            ? 'bg-slate-950 border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
            : isDark
            ? 'bg-neutral-900 border-neutral-700 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isFa ? 'تعریف قانون جدید اتوماسیون (Rule Engine)' : 'Create New Automation Rule'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isFa ? 'تنظیم سناریوهای شرطی IF-THEN تأسیسات و انرژی' : 'Set conditional triggers and actions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-neutral-300">
              {isFa ? 'عنوان سناریو (فارسی)' : 'Rule Title (Persian)'}
            </label>
            <input
              type="text"
              required
              placeholder={isFa ? 'مثال: سرمایش خودکار سالن در ساعت ۱۲' : 'e.g. Server Room Thermal Guard'}
              value={titleFa}
              onChange={(e) => setTitleFa(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-neutral-300">
              {isFa ? 'عنوان انگلیسی (اختیاری)' : 'Rule Title (English)'}
            </label>
            <input
              type="text"
              placeholder="e.g. Afternoon Zone Pre-cool"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Trigger & Operator */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                {isFa ? 'متغیر محرک (Trigger Metric)' : 'Trigger Metric'}
              </label>
              <select
                value={triggerCategory}
                onChange={(e) => setTriggerCategory(e.target.value as AutomationRule['triggerCategory'])}
                className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="temperature">{isFa ? 'دمای محیط (°C)' : 'Temperature (°C)'}</option>
                <option value="energy_peak">{isFa ? 'توان پیک شبکه (kW)' : 'Peak Power (kW)'}</option>
                <option value="occupancy">{isFa ? 'حضور افراد (تعداد)' : 'Occupancy Count'}</option>
                <option value="air_quality">{isFa ? 'غلظت دی‌اکسید کربن (PPM)' : 'CO2 Level (ppm)'}</option>
                <option value="lux">{isFa ? 'روشنایی طبیعی (Lux)' : 'Ambient Lux'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                {isFa ? 'شرط و آستانه (Threshold)' : 'Operator & Threshold'}
              </label>
              <div className="flex gap-2">
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as AutomationRule['operator'])}
                  className="w-20 p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono"
                >
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                  <option value="==">==</option>
                </select>
                <input
                  type="number"
                  step="any"
                  required
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Target Zone */}
          <div className="space-y-1">
            <label className="font-semibold text-neutral-300">
              {isFa ? 'زون هدف اجرای دستور' : 'Target Zone'}
            </label>
            <select
              value={targetZoneId}
              onChange={(e) => setTargetZoneId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
            >
              <option value="all">{isFa ? 'تمامی زون‌های ساختمان (All Zones)' : 'All Zones'}</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {isFa ? z.nameFa : z.name} (Floor {z.floor})
                </option>
              ))}
            </select>
          </div>

          {/* Action */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                {isFa ? 'اقدام خودکار (Action)' : 'Automated Action'}
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as AutomationRule['actionType'])}
                className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
              >
                <option value="adjust_temp">{isFa ? 'تنظیم دمای مطلوب (Setpoint)' : 'Adjust Target Temp'}</option>
                <option value="set_hvac_mode">{isFa ? 'تغییر حالت HVAC (Eco/Cool)' : 'Switch HVAC Mode'}</option>
                <option value="dim_lights">{isFa ? 'تنظیم شدت نور' : 'Dim Lights'}</option>
                <option value="turn_off_lights">{isFa ? 'خاموشی کامل چراغ‌ها' : 'Turn Off Lights'}</option>
                <option value="trigger_alert">{isFa ? 'ارسال هشدار بحرانی' : 'Trigger Alert'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                {isFa ? 'مقدار دستور (Value)' : 'Action Parameter'}
              </label>
              <input
                type="text"
                value={actionParameter}
                onChange={(e) => setActionParameter(e.target.value)}
                placeholder="21 or cooling or 70"
                className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              {isFa ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              {isFa ? 'ثبت و فعال‌سازی قانون' : 'Save & Enable Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

