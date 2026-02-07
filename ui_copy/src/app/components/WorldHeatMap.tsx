import { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

interface WorldHeatMapProps {
  selectedMetric: string;
  selectedCountry: string | null;
  onCountrySelect: (country: string | null) => void;
  selectedDrug: string;
}

interface CountryMetrics {
  perception: number;
  trust: number;
  access: number;
  sideEffect: number;
  competition: number;
}

// Enterprise color scale: deep blue → teal → amber → red
const getHeatColor = (value: number): string => {
  if (value >= 0.75) return '#0ea5e9'; // Deep cyan/blue
  if (value >= 0.65) return '#14b8a6'; // Teal
  if (value >= 0.55) return '#f59e0b'; // Amber
  if (value >= 0.45) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

// Map common country name variations to our database keys
const countryNameMap: Record<string, string> = {
  'United States of America': 'USA',
  'United States': 'USA',
  'USA': 'USA',
  'US': 'USA',
  'UK': 'UK',
  'United Kingdom': 'UK',
  'Great Britain': 'UK',
  'Republic of Korea': 'South Korea',
  'Korea': 'South Korea',
  'Russian Federation': 'Russia',
  'People\'s Republic of China': 'China',
  'Republic of the Philippines': 'Philippines',
  'Kingdom of Saudi Arabia': 'Saudi Arabia',
  'Islamic Republic of Iran': 'Iran',
};

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function WorldHeatMap({ selectedMetric, selectedCountry, onCountrySelect, selectedDrug }: WorldHeatMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [countryMetrics, setCountryMetrics] = useState<Record<string, CountryMetrics>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/medicine_stats/${selectedDrug}`);
        const data = await response.json();

        console.log(data)

        const metrics: Record<string, CountryMetrics> = {};
        const countries = data.countries;

        countries.forEach((country: string, index: number) => {
          // Normalize country name from API if need, simpler to just use API name
          metrics[country] = {
            perception: data.perception[index],
            trust: data.trust[index],
            access: data.access[index],
            sideEffect: data.sideEffect[index],
            competition: data.competition[index]
          };
        });
        setCountryMetrics(metrics);
      } catch (error) {
        console.error("Error fetching medicine stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDrug) {
      fetchData();
    }
  }, [selectedDrug]);


  const getMetricValue = (countryName: string): number => {
    // Try to match TopoJSON name to our API country name
    // 1. Direct match
    // 2. Map match
    let key = countryName;
    if (countryMetrics[key]) {
      // found
    } else if (countryNameMap[countryName] && countryMetrics[countryNameMap[countryName]]) {
      key = countryNameMap[countryName];
    } else {
      // Try simple name matching if not found (e.g. "United States" vs "USA")
      const found = Object.keys(countryMetrics).find(k => k.toLowerCase() === countryName.toLowerCase() || countryName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(countryName.toLowerCase()));
      if (found) key = found;
    }

    const metrics = countryMetrics[key];
    if (!metrics) return 0; // Default or 0

    switch (selectedMetric) {
      case 'trust':
        return metrics.trust;
      case 'access':
        return metrics.access;
      case 'sideEffect':
        return metrics.sideEffect;
      case 'competitive':
        return metrics.competition;
      case 'perception':
      default:
        return metrics.perception;
    }
  };

  const hasDataForCountry = (countryName: string) => {
    // Logic duplicated from getMetricValue a bit, could be cleaner
    let key = countryName;
    if (countryMetrics[key]) return true;
    if (countryNameMap[countryName] && countryMetrics[countryNameMap[countryName]]) return true;
    const found = Object.keys(countryMetrics).find(k => k.toLowerCase() === countryName.toLowerCase() || countryName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(countryName.toLowerCase()));
    return !!found;
  }

  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties.name;
    if (hasDataForCountry(countryName)) {
      if (selectedCountry === countryName) {
        onCountrySelect(null);
      } else {
        onCountrySelect(countryName);
      }
    }
  };

  const handleCountryHover = (geo: any, event: React.MouseEvent) => {
    const countryName = geo.properties.name;
    if (hasDataForCountry(countryName)) {
      setHoveredCountry(countryName);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div className="size-full relative bg-[#0a0e1a] flex items-center justify-center overflow-hidden">
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 20],
        }}
        width={800}
        height={400}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const hasData = hasDataForCountry(countryName);
                const metricValue = getMetricValue(countryName);
                const isSelected = selectedCountry === countryName;
                const isHovered = hoveredCountry === countryName;
                const isDimmed = selectedCountry && !isSelected;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hasData ? getHeatColor(metricValue) : '#1a1a1a'}
                    stroke={isSelected ? '#ffffff' : '#0a0e1a'}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    opacity={isDimmed ? 0.3 : 1}
                    onMouseEnter={(e) => hasData && handleCountryHover(geo, e as unknown as React.MouseEvent)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => hasData && handleCountryClick(geo)}
                    style={{
                      default: { outline: 'none' },
                      hover: {
                        fill: hasData ? getHeatColor(metricValue) : '#1a1a1a',
                        outline: 'none',
                        cursor: hasData ? 'pointer' : 'default',
                        filter: hasData ? 'brightness(1.3)' : 'none',
                      },
                      pressed: { outline: 'none' },
                    }}
                    className={hasData ? 'transition-all duration-200' : ''}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Minimal Tooltip */}
      {hoveredCountry && !selectedCountry && (
        <div
          className="fixed z-50 bg-[#0d1420]/95 backdrop-blur-sm border border-[#2a3544] rounded px-3 py-2 pointer-events-none"
          style={{
            left: `${Math.min(tooltipPosition.x + 15, window.innerWidth - 180)}px`,
            top: `${Math.min(tooltipPosition.y + 15, window.innerHeight - 80)}px`,
          }}
        >
          <div className="text-sm font-semibold mb-1">{hoveredCountry}</div>
          <div className="text-xs text-gray-400">
            Score: <span className="text-white font-medium">{(getMetricValue(hoveredCountry) * 100).toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}