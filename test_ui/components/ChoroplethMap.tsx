import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import type { CountryData } from '../types/data';

interface ChoroplethMapProps {
  countryData: CountryData[];
  selectedCountry: CountryData | null;
  onCountrySelect: (country: CountryData | null) => void;
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

function getHeatColor(value: number | undefined): string {
  if (!value) return 'rgba(40, 44, 52, 0.6)'; // Default gray for no data
  
  // Deep maroon to bright orange gradient
  if (value >= 8.5) return '#ff9147'; // Bright orange
  if (value >= 8.0) return '#ff7e3a';
  if (value >= 7.5) return '#ff6b2d';
  if (value >= 7.0) return '#f55a28';
  if (value >= 6.5) return '#e64a24';
  if (value >= 6.0) return '#d63a20';
  if (value >= 5.5) return '#c02c1d';
  if (value >= 5.0) return '#a52219';
  if (value >= 4.5) return '#8b1a16';
  return '#6d1412'; // Deep maroon
}

export function ChoroplethMap({ countryData, selectedCountry, onCountrySelect }: ChoroplethMapProps) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    country: CountryData | null;
  }>({ visible: false, x: 0, y: 0, country: null });

  // Create a map for quick lookups
  const dataMap = new Map(countryData.map(c => [c.id, c]));

  const handleMouseMove = (geo: any, event: React.MouseEvent) => {
    const countryId = geo.id || geo.properties.ISO_A3;
    const country = dataMap.get(countryId);
    
    if (country) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        country,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, country: null });
  };

  const handleClick = (geo: any) => {
    const countryId = geo.id || geo.properties.ISO_A3;
    const country = dataMap.get(countryId);
    
    if (country) {
      onCountrySelect(selectedCountry?.id === country.id ? null : country);
    }
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-[#0f1419] to-[#0a0e13] rounded-xl border border-gray-800/50 overflow-hidden"
        style={{
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative p-4">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 140,
              center: [0, 20],
            }}
            style={{
              width: '100%',
              height: 'auto',
            }}
          >
            <ZoomableGroup center={[0, 20]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryId = geo.id || geo.properties.ISO_A3;
                    const country = dataMap.get(countryId);
                    const isSelected = selectedCountry?.id === countryId;
                    const fillColor = getHeatColor(country?.value);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke={isSelected ? '#ff9147' : 'rgba(255, 255, 255, 0.08)'}
                        strokeWidth={isSelected ? 1.2 : 0.4}
                        style={{
                          default: {
                            outline: 'none',
                            transition: 'all 0.25s ease',
                          },
                          hover: {
                            fill: country ? fillColor : 'rgba(60, 64, 72, 0.6)',
                            stroke: country ? '#ff9147' : 'rgba(255, 255, 255, 0.15)',
                            strokeWidth: country ? 1 : 0.4,
                            outline: 'none',
                            filter: country ? 'brightness(1.4) drop-shadow(0 0 12px rgba(255, 145, 71, 0.4))' : 'none',
                            cursor: country ? 'pointer' : 'default',
                          },
                          pressed: {
                            outline: 'none',
                          },
                        }}
                        onMouseMove={(event) => handleMouseMove(geo, event)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(geo)}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Tooltip */}
        {tooltip.visible && tooltip.country && (
          <div
            className="fixed bg-gray-900/98 backdrop-blur-md border border-orange-500/20 rounded-lg px-4 py-3 pointer-events-none z-50"
            style={{
              left: `${tooltip.x + 20}px`,
              top: `${tooltip.y - 60}px`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 145, 71, 0.1)',
            }}
          >
            <div className="text-white font-semibold mb-1.5 text-sm">{tooltip.country.name}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {tooltip.country.value.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">/10</div>
            </div>
            <div className="text-xs text-gray-600 mt-0.5">Click to view analytics</div>
          </div>
        )}
      </div>
    </div>
  );
}