export interface PerceptionDrivers {
  effectiveness: number;
  trust: number;
  safety: number;
  access: number;
}

export interface TrendData {
  month: string;
  value: number;
}

export interface RegionalData {
  id: string;
  name: string;
  value: number;
  drivers: PerceptionDrivers;
}

export interface CountryData {
  id: string; // ISO 3-letter code
  name: string;
  value: number; // Overall perception score
  drivers: PerceptionDrivers;
  trend: TrendData[];
  volatility: number; // 0-100
  changePercent: number; // Month over month change
  regions?: RegionalData[];
  competitors?: {
    name: string;
    score: number;
  }[];
}

export interface DashboardState {
  selectedCountry: CountryData | null;
  selectedRegion: RegionalData | null;
  drugFilter: string;
  timeRange: string;
}

export interface AnalyticsPanelProps {
  country: CountryData | null;
  region: RegionalData | null;
  onRegionSelect?: (region: RegionalData | null) => void;
}