import { useState } from 'react';
import { Header } from './components/Header';
import { ChoroplethMap } from './components/ChoroplethMap';
import { SelectedCountryPanel } from './components/SelectedCountryPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ContextPanel } from './components/ContextPanel';
import { countryDataset } from './data/mockData';
import type { CountryData, RegionalData } from './types/data';

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    countryDataset.find(c => c.id === 'IND') || null
  );
  const [selectedRegion, setSelectedRegion] = useState<RegionalData | null>(null);
  const [drugFilter, setDrugFilter] = useState('Aspirin');

  const handleCountrySelect = (country: CountryData | null) => {
    setSelectedCountry(country);
    setSelectedRegion(null); // Reset region when country changes
  };

  return (
    <div className="min-h-screen bg-[#0a0e13] text-white flex flex-col">
      <Header 
        drugFilter={drugFilter}
        onDrugChange={setDrugFilter}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-[calc(100vh-88px)] grid grid-cols-12 gap-6 px-6 py-4">
          {/* Left Context Panel - Scrollable */}
          <div className="col-span-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <ContextPanel />
          </div>

          {/* Map Section - Center, Fixed Height */}
          <div className="col-span-7 flex flex-col">
            <ChoroplethMap 
              countryData={countryDataset}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
            />
          </div>
          
          {/* Right Analytics Panel - Scrollable */}
          <div className="col-span-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <AnalyticsPanel 
              country={selectedCountry}
              region={selectedRegion}
              onRegionSelect={setSelectedRegion}
            />
          </div>
        </div>
      </main>
    </div>
  );
}