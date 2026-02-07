import { useState } from 'react';
import TopNavigation from './components/TopNavigation';
import WorldHeatMap from './components/WorldHeatMap';
import AnalyticsSidebar from './components/AnalyticsSidebar';
import DrugInfoSidebar from './components/DrugInfoSidebar';
import MentionsGraph from './components/MentionsGraph';
import MapLegend from './components/MapLegend';

export default function App() {
  const [selectedMetric, setSelectedMetric] = useState('perception');
  const [selectedDrug, setSelectedDrug] = useState('Ozempic');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="size-full bg-[#0a0e1a] text-white flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNavigation
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        selectedDrug={selectedDrug}
        onDrugChange={setSelectedDrug}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Drug Info */}
        <DrugInfoSidebar selectedDrug={selectedDrug} />

        {/* Center Column - Map, Legend, and Graph */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map Area with Legend */}
          <div className="flex-1 relative">
            <WorldHeatMap
              selectedMetric={selectedMetric}
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
              selectedDrug={selectedDrug}
            />
            {/* Legend in Top Right Corner */}
            <div className="absolute top-4 right-4 z-10">
              <MapLegend />
            </div>
          </div>

          {/* Graph Below Map */}
          <MentionsGraph selectedDrug={selectedDrug} />
        </div>

        {/* Right Sidebar - Analytics */}
        <AnalyticsSidebar
          selectedCountry={selectedCountry}
          selectedMetric={selectedMetric}
          selectedDrug={selectedDrug}
        />
      </div>
    </div>
  );
}