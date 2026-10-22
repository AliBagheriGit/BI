'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  BuildingZone,
  EquipmentAsset,
  AutomationRule,
  AlertEvent,
  BiInsightRecommendation,
  HistoricalDataPoint,
  TelemetrySnapshot,
  Language,
  ThemeMode,
  TempUnit,
  CurrencyUnit,
  HvacMode,
  FanSpeed
} from '../types/bi-bas';
import {
  INITIAL_ZONES,
  INITIAL_EQUIPMENT,
  INITIAL_RULES,
  INITIAL_ALERTS,
  INITIAL_INSIGHTS,
  INITIAL_HISTORICAL_DATA,
  INITIAL_TELEMETRY
} from '../lib/mock-data';

export type AppView =
  | 'command_center'
  | 'bas_zones'
  | 'equipment'
  | 'rules'
  | 'bi_analytics'
  | 'insights'
  | 'export';

interface AppContextType {
  // App state
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
  currency: CurrencyUnit;
  setCurrency: (c: CurrencyUnit) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;

  // Real-time Simulation Controls
  isLiveSimulation: boolean;
  setIsLiveSimulation: (val: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  tickCount: number;

  // Domain Entities
  zones: BuildingZone[];
  telemetry: TelemetrySnapshot;
  equipment: EquipmentAsset[];
  rules: AutomationRule[];
  alerts: AlertEvent[];
  insights: BiInsightRecommendation[];
  historicalData: HistoricalDataPoint[];

  // Selected for modals / drawers
  selectedZone: BuildingZone | null;
  setSelectedZoneId: (id: string | null) => void;
  selectedEquipment: EquipmentAsset | null;
  setSelectedEquipmentId: (id: string | null) => void;

  // Actions
  updateZoneHvac: (zoneId: string, updates: { hvacStatus?: HvacMode; targetTemp?: number; fanSpeed?: FanSpeed }) => void;
  updateZoneLighting: (zoneId: string, updates: { lightingStatus?: boolean; lightingBrightness?: number }) => void;
  toggleRule: (ruleId: string) => void;
  addRule: (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'executionCount'>) => void;
  deleteRule: (ruleId: string) => void;
  executeRuleManually: (ruleId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  applyInsight: (insightId: string) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'bi_bas_app_state_v1_';

export function AppProvider({ children }: { children: ReactNode }) {
  // App Preferences
  const [lang, setLangState] = useState<Language>('fa');
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [currency, setCurrency] = useState<CurrencyUnit>('IRR');
  const [activeView, setActiveView] = useState<AppView>('command_center');

  // Simulation
  const [isLiveSimulation, setIsLiveSimulation] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [tickCount, setTickCount] = useState<number>(0);

  // Data
  const [zones, setZones] = useState<BuildingZone[]>(INITIAL_ZONES);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>(INITIAL_TELEMETRY);
  const [equipment, setEquipment] = useState<EquipmentAsset[]>(INITIAL_EQUIPMENT);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [alerts, setAlerts] = useState<AlertEvent[]>(INITIAL_ALERTS);
  const [insights, setInsights] = useState<BiInsightRecommendation[]>(INITIAL_INSIGHTS);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(INITIAL_HISTORICAL_DATA);

  // Selected item tracking
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(`${STORAGE_KEY_PREFIX}lang`) as Language | null;
      if (savedLang) setLangState(savedLang);

      const savedTheme = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`) as ThemeMode | null;
      if (savedTheme) setThemeState(savedTheme);

      const savedZones = localStorage.getItem(`${STORAGE_KEY_PREFIX}zones`);
      if (savedZones) setZones(JSON.parse(savedZones));

      const savedRules = localStorage.getItem(`${STORAGE_KEY_PREFIX}rules`);
      if (savedRules) setRules(JSON.parse(savedRules));
    } catch {
      // ignore storage error
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}lang`, newLang);
    } catch {
      // ignore
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, newTheme);
    } catch {
      // ignore
    }
  };

  // Selected helpers
  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;
  const selectedEquipment = equipment.find((e) => e.id === selectedEquipmentId) || null;

  // Update zone HVAC
  const updateZoneHvac = useCallback(
    (zoneId: string, updates: { hvacStatus?: HvacMode; targetTemp?: number; fanSpeed?: FanSpeed }) => {
      setZones((prev) =>
        prev.map((zone) => {
          if (zone.id !== zoneId) return zone;
          const next = { ...zone, ...updates };
          // If set to off, power drops
          if (updates.hvacStatus === 'off') {
            next.powerConsumptionKw = Math.max(1.5, zone.powerConsumptionKw * 0.3);
          } else if (updates.hvacStatus === 'cooling' && updates.targetTemp && updates.targetTemp < zone.currentTemp) {
            next.powerConsumptionKw = zone.powerConsumptionKw * 1.25;
          }
          return next;
        })
      );
    },
    []
  );

  // Update zone Lighting
  const updateZoneLighting = useCallback(
    (zoneId: string, updates: { lightingStatus?: boolean; lightingBrightness?: number }) => {
      setZones((prev) =>
        prev.map((zone) => {
          if (zone.id !== zoneId) return zone;
          const next = { ...zone, ...updates };
          if (updates.lightingStatus === false) {
            next.lightingBrightness = 0;
            next.luxLevel = Math.max(40, zone.luxLevel * 0.2);
          } else if (updates.lightingBrightness !== undefined) {
            next.lightingStatus = updates.lightingBrightness > 0;
            next.luxLevel = Math.round(100 + updates.lightingBrightness * 4.5);
          }
          return next;
        })
      );
    },
    []
  );

  // Rule management
  const toggleRule = useCallback((ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  }, []);

  const addRule = useCallback(
    (ruleData: Omit<AutomationRule, 'id' | 'createdAt' | 'executionCount'>) => {
      const newRule: AutomationRule = {
        ...ruleData,
        id: `rule-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        executionCount: 0
      };
      setRules((prev) => [newRule, ...prev]);
    },
    []
  );

  const deleteRule = useCallback((ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  }, []);

  const executeRuleManually = useCallback((ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        return {
          ...r,
          executionCount: r.executionCount + 1,
          lastTriggeredTime: new Date().toLocaleTimeString()
        };
      })
    );
  }, []);

  // Alert management
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true, acknowledged: true } : a))
    );
  }, []);

  // AI Insight implementation
  const applyInsight = useCallback((insightId: string) => {
    setInsights((prev) =>
      prev.map((item) => (item.id === insightId ? { ...item, implemented: true } : item))
    );
    // Add success notification alert
    const newAlert: AlertEvent = {
      id: `alt-applied-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: 'info',
      title: 'AI Optimization Plan Activated',
      titleFa: 'راهکار بهینه‌سازی هوش مصنوعی فعال شد',
      message: 'System parameters adjusted according to predictive model recommendations.',
      messageFa: 'پارامترهای عملکردی بر اساس توصیه مدل هوش مصنوعی با موفقیت تنظیم شدند.',
      acknowledged: true,
      resolved: true
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  // Reset to factory defaults
  const resetToDefaults = useCallback(() => {
    setZones(INITIAL_ZONES);
    setEquipment(INITIAL_EQUIPMENT);
    setRules(INITIAL_RULES);
    setAlerts(INITIAL_ALERTS);
    setInsights(INITIAL_INSIGHTS);
    setHistoricalData(INITIAL_HISTORICAL_DATA);
    setTelemetry(INITIAL_TELEMETRY);
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }, []);

  // ----------------------------------------------------
  // Live Simulation Heartbeat & Automated Rule Engine
  // ----------------------------------------------------
  useEffect(() => {
    if (!isLiveSimulation) return;

    const intervalMs = Math.max(1000, 3000 / simulationSpeed);
    const interval = setInterval(() => {
      setTickCount((t) => t + 1);

      // Jitter & calculate live telemetry
      setZones((prevZones) => {
        return prevZones.map((zone) => {
          // Slight thermal drift towards ambient / target
          const drift = (Math.random() - 0.48) * 0.15;
          let temp = +(zone.currentTemp + drift).toFixed(1);

          // If cooling, slowly pull towards target
          if (zone.hvacStatus === 'cooling' && temp > zone.targetTemp) {
            temp = +(temp - 0.08).toFixed(1);
          } else if (zone.hvacStatus === 'heating' && temp < zone.targetTemp) {
            temp = +(temp + 0.08).toFixed(1);
          }

          // Random slight fluctuation in power
          const powerJitter = (Math.random() - 0.5) * 0.6;
          const power = Math.max(1.0, +(zone.powerConsumptionKw + powerJitter).toFixed(1));

          // CO2 drift based on occupancy
          const co2Delta = zone.occupancy > 5 ? Math.round((Math.random() - 0.3) * 6) : -Math.round(Math.random() * 4);
          const co2 = Math.max(400, Math.min(1200, zone.co2Ppm + co2Delta));

          return {
            ...zone,
            currentTemp: temp,
            powerConsumptionKw: power,
            co2Ppm: co2
          };
        });
      });

      // Update aggregate telemetry
      setTelemetry((prev) => {
        const solarJitter = +(prev.solarGenKw + (Math.random() - 0.49) * 0.8).toFixed(1);
        const gridJitter = +(prev.gridPowerKw + (Math.random() - 0.48) * 1.2).toFixed(1);
        const total = +(gridJitter + Math.max(0, solarJitter)).toFixed(1);
        const now = new Date().toLocaleTimeString();

        return {
          ...prev,
          timestamp: now,
          totalPowerKw: total,
          solarGenKw: Math.max(0, solarJitter),
          gridPowerKw: Math.max(10, gridJitter),
          avgIndoorTemp: +(prev.avgIndoorTemp + (Math.random() - 0.5) * 0.05).toFixed(1),
          energyCostRatePerHour: Math.round(total * 2650)
        };
      });

      // Check Rule Engine triggers
      setRules((currentRules) => {
        return currentRules.map((rule) => {
          if (!rule.isEnabled) return rule;

          // Check if condition meets
          let triggered = false;
          if (rule.triggerCategory === 'temperature') {
            // Check target zone or all
            zones.forEach((z) => {
              if (rule.targetZoneId === 'all' || rule.targetZoneId === z.id) {
                if (rule.operator === '>=' && z.currentTemp >= rule.thresholdValue) {
                  triggered = true;
                }
              }
            });
          } else if (rule.triggerCategory === 'energy_peak') {
            if (telemetry.totalPowerKw >= rule.thresholdValue) {
              triggered = true;
            }
          }

          if (triggered && Math.random() < 0.2) {
            // Triggered
            return {
              ...rule,
              executionCount: rule.executionCount + 1,
              lastTriggeredTime: new Date().toLocaleTimeString()
            };
          }
          return rule;
        });
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isLiveSimulation, simulationSpeed, zones, telemetry.totalPowerKw]);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        tempUnit,
        setTempUnit,
        currency,
        setCurrency,
        activeView,
        setActiveView,
        isLiveSimulation,
        setIsLiveSimulation,
        simulationSpeed,
        setSimulationSpeed,
        tickCount,
        zones,
        telemetry,
        equipment,
        rules,
        alerts,
        insights,
        historicalData,
        selectedZone,
        setSelectedZoneId,
        selectedEquipment,
        setSelectedEquipmentId,
        updateZoneHvac,
        updateZoneLighting,
        toggleRule,
        addRule,
        deleteRule,
        executeRuleManually,
        acknowledgeAlert,
        resolveAlert,
        applyInsight,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

