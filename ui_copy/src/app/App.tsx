import { useState, useEffect } from 'react';
import TopNavigation from './components/TopNavigation';
import WorldGlobe from './components/WorldGlobe';
import AnalyticsSidebar from './components/AnalyticsSidebar';
import DrugInfoSidebar from './components/DrugInfoSidebar';
import MentionsGraph from './components/MentionsGraph';
import MapLegend from './components/MapLegend';

export default function App() {
  const [selectedMetric, setSelectedMetric] = useState('effectiveness');
  const [selectedDrug, setSelectedDrug] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<string[]>([]);

  // Fetch medicine list on mount
  useState(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/medicine_names');
        if (!response.ok) throw new Error('Failed to fetch medicines');

        const data = await response.json();
        const sortedMedicines = Object.entries(data)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .map(([name]) => name);

        setMedicines(sortedMedicines);
        if (sortedMedicines.length > 0 && !sortedMedicines.includes(selectedDrug)) {
          setSelectedDrug(sortedMedicines[0]);
        }
      } catch (error) {
        console.error('Error fetching medicine list:', error);
        // Fallback to default list if API fails
        setMedicines(['Rybelsus', 'Ozempic', 'Wegovy', 'Mounjaro']);
      }
    };

    fetchMedicines();
  });

  const [drugData, setDrugData] = useState<DrugData | null>(null);
  const [loading, setLoading] = useState(false);


  // Fetch medicine stats when selectedDrug changes
  const [drugStats, setDrugStats] = useState<any>(null);

  // New states for comparison
  const [similarDrug, setSimilarDrug] = useState<string | null>(null);
  const [similarDrugStats, setSimilarDrugStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedDrug) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/medicine_stats/${selectedDrug}`);
        if (!response.ok) throw new Error('Failed to fetch medicine stats');
        const data = await response.json();
        setDrugStats(data);
      } catch (error) {
        console.error('Error fetching medicine stats:', error);
      }
    };

    const fetchSimilarDrug = async () => {
      if (!selectedDrug) return;
      setSimilarDrug(null);
      setSimilarDrugStats(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/similar_medicine/${selectedDrug}`);
        if (!response.ok) throw new Error('Failed to fetch similar medicine');
        const data = await response.json();
        if (data.similar_medicine) {
          setSimilarDrug(data.similar_medicine);
        }
      } catch (error) {
        console.error('Error fetching similar drug:', error);
      }
    }

    fetchStats();
    fetchSimilarDrug();
  }, [selectedDrug]);

  // Fetch stats for similar drug when found
  useEffect(() => {
    const fetchSimilarStats = async () => {
      if (!similarDrug) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/medicine_stats/${similarDrug}`);
        if (!response.ok) throw new Error('Failed to fetch similar medicine stats');
        const data = await response.json();
        setSimilarDrugStats(data);
      } catch (error) {
        console.error('Error fetching similar medicine stats:', error);
      }
    };
    fetchSimilarStats();
  }, [similarDrug]);

  return (
    <div className="h-screen w-screen bg-[#0a0e1a] text-white flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNavigation
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        selectedDrug={selectedDrug}
        onDrugChange={setSelectedDrug}
        medicineList={medicines}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Drug Info - Hidden when country selected */}
        <div className={`w-80 h-full flex-shrink-0 border-r border-[#1a2332] bg-[#0d1420] z-10 relative transition-all duration-300 ${selectedCountry ? 'hidden' : 'block'}`}>
          <DrugInfoSidebar selectedDrug={selectedDrug} />
        </div>

        {/* Center Column - Map, Legend, and Graph */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Map Area with Legend */}
          <div className="flex-1 relative">
            <WorldGlobe
              selectedMetric={selectedMetric}
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
              selectedDrug={selectedDrug}
              drugStats={drugStats}
            />
            {/* Legend in Top Right Corner */}
            <div className="absolute top-4 right-4 z-10">
              <MapLegend />
            </div>
          </div>

          {/* Graph Below Map */}
          <div className="h-64 border-t border-[#1a2332]">
            <MentionsGraph selectedDrug={selectedDrug} selectedMetric={selectedMetric} selectedCountry={selectedCountry} />
          </div>
        </div>

        {/* Right Sidebar - Analytics */}
        <AnalyticsSidebar
          selectedCountry={selectedCountry}
          selectedMetric={selectedMetric}
          selectedDrug={selectedDrug}
          drugStats={drugStats}
          similarDrug={similarDrug}
          similarDrugStats={similarDrugStats}
          onClose={() => setSelectedCountry(null)}
        />
      </div>
    </div>
  );
}