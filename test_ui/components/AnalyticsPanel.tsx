import { TrendingUp, Activity, BarChart3, Info, FileText, AlertTriangle } from 'lucide-react';
import type { CountryData, RegionalData, AnalyticsPanelProps } from '../types/data';

function getMarketSentiment(value: number): string {
  if (value >= 8.5) return 'Dominant';
  if (value >= 7.5) return 'Strong';
  if (value >= 6.5) return 'Favorable';
  if (value >= 5.5) return 'Neutral';
  if (value >= 4.5) return 'Challenged';
  return 'Critical';
}

function getTrendDirection(changePercent: number): { label: string; color: string } {
  if (changePercent > 2) return { label: 'Accelerating', color: 'text-green-400' };
  if (changePercent > 0) return { label: 'Improving', color: 'text-green-400' };
  if (changePercent === 0) return { label: 'Stable', color: 'text-gray-400' };
  if (changePercent > -2) return { label: 'Declining', color: 'text-orange-400' };
  return { label: 'Deteriorating', color: 'text-red-400' };
}

function getPrimaryDrivers(drivers: { effectiveness: number; trust: number; safety: number; access: number }): string[] {
  const entries = Object.entries(drivers);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 2);
  const bottom = sorted.slice(-1);
  
  const insights: string[] = [];
  
  if (top[0][1] >= 8.0) {
    insights.push(`${capitalize(top[0][0])} perception remains a key strength (${top[0][1].toFixed(1)}/10)`);
  }
  
  if (bottom[0][1] < 6.0) {
    insights.push(`${capitalize(bottom[0][0])} concerns represent primary headwind (${bottom[0][1].toFixed(1)}/10)`);
  } else if (bottom[0][1] < 7.0) {
    insights.push(`${capitalize(bottom[0][0])} showing room for improvement (${bottom[0][1].toFixed(1)}/10)`);
  }
  
  return insights;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function AnalyticsPanel({ country, region }: AnalyticsPanelProps) {
  if (!country) {
    return (
      <div className="pt-12">
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 mb-2">No Selection</div>
          <div className="text-[11px] text-gray-700 leading-relaxed">
            Select a country to view market intelligence
          </div>
        </div>
      </div>
    );
  }

  const sentiment = getMarketSentiment(country.value);
  const trend = getTrendDirection(country.changePercent);
  const drivers = getPrimaryDrivers(country.drivers);

  return (
    <div className="space-y-6 pb-6">
      {/* Country Header */}
      <div>
        <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">
          Selected Market
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{country.name}</h2>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            {country.value.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">/10</div>
        </div>
        {country.changePercent !== 0 && (
          <div className={`flex items-center gap-1 mt-1 ${
            country.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {country.changePercent >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <Activity className="w-3 h-3" />
            )}
            <span className="text-xs font-medium">
              {country.changePercent >= 0 ? '+' : ''}{country.changePercent.toFixed(1)}% MoM
            </span>
          </div>
        )}
      </div>

      {/* Perception Drivers */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Perception Drivers
        </h3>
        <div className="space-y-2.5">
          {Object.entries(country.drivers).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500 capitalize">{key}</span>
                <span className="text-xs font-semibold text-white">{value.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${(value / 10) * 100}%`,
                    backgroundColor: value >= 7 ? '#10b981' : value >= 5 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Breakdown */}
      {country.regions && country.regions.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
            Regional Data
          </h3>
          <div className="space-y-2">
            {country.regions.map((region) => (
              <button
                key={region.id}
                onClick={() => (window as any).setSelectedRegion?.(region)}
                className="w-full bg-gray-900/20 border border-gray-800/30 hover:border-gray-700/50 rounded-lg p-2.5 text-left transition-all hover:bg-gray-900/30"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">{region.name}</div>
                  <div className="text-sm font-bold text-orange-400">{region.value.toFixed(1)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Analyst Insight */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Analyst Brief
        </h3>

        {/* Market Perception Summary */}
        <div className="mb-4">
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">
            Market Perception
          </div>
          <div className="text-sm font-bold text-white mb-2">
            {sentiment} Position
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {country.name} demonstrates a perception index of <span className="text-orange-400 font-semibold">{country.value.toFixed(1)}</span>, 
            {country.value >= 7.0 ? ' indicating robust market confidence' : country.value >= 5.5 ? ' reflecting moderate market acceptance' : ' signaling significant perception challenges'}.
          </p>
        </div>

        {/* Directional Trend */}
        <div className="mb-4 pb-4 border-b border-gray-800/30">
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">
            Trajectory
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold ${trend.color}`}>{trend.label}</span>
            <span className="text-[10px] text-gray-600 font-mono">
              {country.changePercent >= 0 ? '+' : ''}{country.changePercent.toFixed(1)}% MoM
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {trend.label === 'Accelerating' || trend.label === 'Improving' 
              ? `Metrics trending positively. Momentum indicators suggest sustained improvement.`
              : trend.label === 'Stable'
              ? `Perception holding steady with minimal variance.`
              : `Recent deterioration warrants monitoring.`
            }
          </p>
        </div>

        {/* Primary Factors */}
        <div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
            Key Drivers
          </div>
          <div className="space-y-2">
            {drivers.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500/60 flex-shrink-0 mt-1.5" />
                <p className="text-[11px] text-gray-500 leading-relaxed">{insight}</p>
              </div>
            ))}
            {country.volatility > 35 && (
              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-800/30">
                <AlertTriangle className="w-3 h-3 text-amber-500/70 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-500/70 leading-relaxed">
                  Elevated volatility ({country.volatility}/100)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trend Over Time */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Historical Performance
        </h3>
        
        {/* Sparkline */}
        <div className="relative h-12 mb-2">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
            </defs>
            
            {/* Area */}
            <path
              d={generateSparklinePath(country.trend, true)}
              fill="url(#sparkGradient)"
            />
            
            {/* Line */}
            <path
              d={generateSparklinePath(country.trend, false)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-600 mb-3">
          <span>{country.trend[0].month}</span>
          <span>{country.trend[country.trend.length - 1].month}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] text-gray-600 mb-1">Current</div>
            <div className="text-sm font-bold text-white">
              {country.trend[country.trend.length - 1].value.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-600 mb-1">6M Avg</div>
            <div className="text-sm font-bold text-white">
              {(country.trend.reduce((sum, t) => sum + t.value, 0) / country.trend.length).toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Volatility Indicator */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Volatility Index
        </h3>

        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <div className="text-xl font-bold text-white">
              {country.volatility}
            </div>
            <div className="text-xs text-gray-600">/ 100</div>
          </div>
          <div className="text-[10px] text-gray-600 mt-1">
            {country.volatility < 20 ? 'Low variance' : country.volatility < 40 ? 'Moderate' : 'High uncertainty'}
          </div>
        </div>

        <div className="w-full bg-gray-800/50 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${country.volatility}%`,
              backgroundColor: country.volatility < 20 ? '#10b981' : country.volatility < 40 ? '#f59e0b' : '#ef4444',
            }}
          />
        </div>
      </div>

      {/* Competitor Comparison */}
      {country.competitors && country.competitors.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
            Competitive Landscape
          </h3>

          <div className="space-y-2.5">
            {/* Current Drug */}
            <div className="pb-2.5 border-b border-blue-900/20">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[11px] font-medium text-blue-400">Aspirin (Focus)</div>
                <div className="text-sm font-bold text-blue-400">{country.value.toFixed(1)}</div>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-blue-500/80"
                  style={{ width: `${(country.value / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Competitors */}
            {country.competitors.map((competitor, index) => (
              <div key={index} className="pb-2.5 border-b border-gray-800/20 last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[11px] text-gray-500">{competitor.name}</div>
                  <div className="text-sm font-semibold text-gray-400">{competitor.score.toFixed(1)}</div>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-gray-600/60"
                    style={{ width: `${(competitor.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function generateSparklinePath(trend: { month: string; value: number }[], isArea: boolean): string {
  if (trend.length === 0) return '';

  const maxValue = Math.max(...trend.map(t => t.value));
  const minValue = Math.min(...trend.map(t => t.value));
  const range = maxValue - minValue || 1;

  const points = trend.map((t, i) => {
    const x = (i / (trend.length - 1)) * 100;
    const y = 35 - ((t.value - minValue) / range) * 30; // Inverted Y axis
    return { x, y };
  });

  let path = `M ${points[0].x} ${points[0].y}`;
  points.slice(1).forEach(p => {
    path += ` L ${p.x} ${p.y}`;
  });

  if (isArea) {
    path += ` L 100 40 L 0 40 Z`;
  }

  return path;
}