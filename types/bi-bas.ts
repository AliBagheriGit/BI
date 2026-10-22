export type Language = 'fa' | 'en';
export type ThemeMode = 'dark' | 'light' | 'cyber';
export type TempUnit = 'C' | 'F';
export type CurrencyUnit = 'IRR' | 'USD';

export type HvacMode = 'auto' | 'cooling' | 'heating' | 'eco' | 'off';
export type FanSpeed = 'auto' | 'low' | 'med' | 'high';
export type LightingMode = 'auto' | 'manual' | 'scheduled' | 'off';
export type EquipmentStatus = 'nominal' | 'warning' | 'critical' | 'maintenance' | 'offline';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface BuildingZone {
  id: string;
  name: string;
  nameFa: string;
  floor: number;
  areaSqMeters: number;
  occupancy: number;
  maxCapacity: number;
  currentTemp: number; // in Celsius
  targetTemp: number;
  humidity: number; // percentage
  co2Ppm: number; // ppm
  luxLevel: number; // Lux
  airQualityIndex: number; // AQI 0-500
  hvacStatus: HvacMode;
  fanSpeed: FanSpeed;
  lightingStatus: boolean;
  lightingBrightness: number; // 0-100%
  powerConsumptionKw: number;
  damperPositionPct: number; // 0-100%
  lastMotionDetectedMinutesAgo: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TelemetrySnapshot {
  timestamp: string;
  totalPowerKw: number;
  gridPowerKw: number;
  solarGenKw: number;
  batteryStorageKw: number;
  avgIndoorTemp: number;
  outdoorTemp: number;
  avgHumidity: number;
  outdoorHumidity: number;
  avgCo2: number;
  chillerCop: number; // Coefficient of Performance
  totalOccupancy: number;
  waterFlowRateLpm: number; // Litres per minute
  energyCostRatePerHour: number; // calculated live
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  zoneId?: string;
  zoneName?: string;
  zoneNameFa?: string;
  equipmentId?: string;
  equipmentName?: string;
  severity: AlertSeverity;
  title: string;
  titleFa: string;
  message: string;
  messageFa: string;
  acknowledged: boolean;
  resolved: boolean;
  actionRecommended?: string;
  actionRecommendedFa?: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  triggerCategory: 'temperature' | 'occupancy' | 'energy_peak' | 'time_schedule' | 'air_quality' | 'lux';
  operator: '>' | '<' | '>=' | '<=' | '==' | 'between';
  thresholdValue: number;
  thresholdSecondary?: number;
  targetZoneId: 'all' | string;
  actionType: 'set_hvac_mode' | 'adjust_temp' | 'dim_lights' | 'turn_off_lights' | 'trigger_alert' | 'shed_load';
  actionParameter: string | number;
  isEnabled: boolean;
  lastTriggeredTime?: string;
  executionCount: number;
  createdAt: string;
}

export interface EquipmentAsset {
  id: string;
  name: string;
  nameFa: string;
  type: 'chiller' | 'ahu' | 'solar_inverter' | 'cooling_tower' | 'boiler' | 'generator' | 'ups';
  model: string;
  serialNumber: string;
  location: string;
  locationFa: string;
  healthScore: number; // 0-100%
  status: EquipmentStatus;
  efficiencyCop?: number;
  runningHours: number;
  mtbfHours: number; // Mean Time Between Failures
  loadPercentage: number;
  operatingTemp: number;
  vibrationMmPerSec: number;
  lastServiceDate: string;
  nextServiceDueDate: string;
  powerKw: number;
}

export interface HistoricalDataPoint {
  timeLabel: string;
  hvacPowerKw: number;
  lightingPowerKw: number;
  serverPowerKw: number;
  otherPowerKw: number;
  solarGeneratedKw: number;
  indoorTemp: number;
  outdoorTemp: number;
  targetTemp: number;
  occupancyCount: number;
  costEstimate: number;
  carbonEmissionKg: number;
}

export interface BiInsightRecommendation {
  id: string;
  category: 'energy' | 'maintenance' | 'comfort' | 'automation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  titleFa: string;
  impact: string;
  impactFa: string;
  description: string;
  descriptionFa: string;
  potentialMonthlySavingsToman: number;
  potentialMonthlySavingsUsd: number;
  energyReductionKwh: number;
  co2ReductionKg: number;
  implemented: boolean;
  actionPayload?: {
    type: string;
    params: Record<string, unknown>;
  };
}

export interface EnergyTariff {
  peakRateTomanPerKwh: number;
  offPeakRateTomanPerKwh: number;
  midRateTomanPerKwh: number;
  tomanToUsdRate: number;
}

