import { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3-scale';
// We need topological data for the countries. Usually react-globe.gl examples fetch it.
// We can use the same file we used for 2D map if it's compatible (GeoJSON/TopoJSON), or fetch a standard one.
import HoverCard from './HoverCard';

interface WorldGlobeProps {
    selectedMetric: string;
    selectedCountry: string | null;
    onCountrySelect: (country: string | null) => void;
    drugStats: any;
    selectedDrug: string;
}

export default function WorldGlobe({ selectedMetric, selectedCountry, onCountrySelect, drugStats }: WorldGlobeProps) {
    const globeEl = useRef<any>(null);
    const [countries, setCountries] = useState({ features: [] });
    const [hoverD, setHoverD] = useState<any | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Load GeoJSON data
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);
    }, []);

    // Prepare color scale
    const colorScale = useMemo(() => {
        return d3.scaleLinear<string>()
            .domain([0, 0.5])
            .range(['#ef4444', '#10b981']) // Red to Green
            .clamp(true);
    }, []);

    // Helper to get stats for a country
    const getCountryStats = (countryName: string) => {
        if (!drugStats || !countryName) return null;

        // Normalize country name matching
        // API uses specific set: USA, Canada, UK, etc.
        // GeoJSON uses: United States of America, Canada, United Kingdom, etc.

        const normalize = (n: string) => {
            if (n === 'United States of America') return 'USA';
            if (n === 'United Kingdom') return 'UK';
            if (n === 'Australia') return 'Australia';
            if (n === 'Brazil') return 'Brazil';
            if (n === 'Canada') return 'Canada';
            if (n === 'China') return 'China';
            if (n === 'France') return 'France';
            if (n === 'Germany') return 'Germany';
            if (n === 'India') return 'India';
            if (n === 'Japan') return 'Japan';
            return null; // Ignore other countries
        };

        const normalizedName = normalize(countryName);
        const index = drugStats.countries.findIndex((c: string) => c === normalizedName || c === countryName);

        if (index !== -1) {
            return {
                effectiveness: drugStats.effectiveness[index],
                sideEffect: drugStats.sideEffect[index],
                access: drugStats.access[index],
                expensiveness: drugStats.expensiveness[index],
                competitive: drugStats.competition[index]
            };
        }
        return null;
    };

    // Metric Value Helper
    const getMetricValue = (stats: any) => {
        if (!stats) return 0;
        switch (selectedMetric) {
            case 'effectiveness': return stats.effectiveness;
            case 'sideEffect': return stats.sideEffect; // For map coloring, maybe invert? Higher side effects = red?
            case 'access': return stats.access;
            case 'expensiveness': return stats.expensiveness;
            case 'competitive': return stats.competitive;
            default: return 0;
        }
    };

    // Auto-rotate
    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ altitude: 2.5 });
        }
    }, []);

    return (
        <div
            className="w-full h-full cursor-move relative bg-[#0a0e1a]"
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        >
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                lineHoverPrecision={0}
                polygonsData={countries.features}
                polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
                polygonCapColor={d => {
                    const stats = getCountryStats((d as any).properties.ADMIN);
                    const value = getMetricValue(stats);
                    // If selected, highlight with a distinct color (Purple/Fuchsia)
                    if (selectedCountry && ((d as any).properties.ADMIN === selectedCountry || (d as any).properties.ISO_A3 === selectedCountry)) {
                        return '#d946ef'; // Fuchsia-500
                    }
                    if (!stats) return 'rgba(200, 200, 200, 0.1)'; // Gray for no data

                    if (selectedMetric === 'sideEffect' || selectedMetric === 'expensiveness') {
                        return colorScale(1 - value);
                    }
                    return colorScale(value);
                }}
                polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
                polygonStrokeColor={() => '#111'}
                polygonLabel={() => ''} // Disable default tooltip
                onPolygonHover={setHoverD}
                onPolygonClick={(d: any) => {
                    const name = d.properties.ADMIN;
                    onCountrySelect(name);
                }}
                width={window.innerWidth - 384} // Sidebar width approximation or simpler: use resize observer but this is fine for now
            />

            {/* Render HoverCard if hovering over a country */}
            {hoverD && (
                <HoverCard
                    countryName={(hoverD as any).properties.ADMIN}
                    metricName={selectedMetric}
                    metricValue={getMetricValue(getCountryStats((hoverD as any).properties.ADMIN))}
                    x={mousePos.x}
                    y={mousePos.y}
                />
            )}
        </div>
    );
}
