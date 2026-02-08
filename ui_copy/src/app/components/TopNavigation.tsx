import { Download, Share2, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

interface TopNavigationProps {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  selectedDrug: string;
  onDrugChange: (drug: string) => void;
  medicineList: string[];
}

const metrics = [
  { id: 'effectiveness', label: 'Effectiveness' },
  { id: 'sideEffect', label: 'Side effect mention frequency' },
  { id: 'access', label: 'Access friction' },
  { id: 'expensiveness', label: 'Affordability' },
  { id: 'competitive', label: 'Competitive pressure' },
];

export default function TopNavigation({
  selectedMetric,
  onMetricChange,
  selectedDrug,
  onDrugChange,
  medicineList,
}: TopNavigationProps) {
  const [searchQuery, setSearchQuery] = useState(selectedDrug);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter based on the passed medicineList
  const filteredDrugs = medicineList.filter(drug =>
    drug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  const handleDrugSelect = (drug: string) => {
    setSearchQuery(drug);
    onDrugChange(drug);
    setShowSuggestions(false);
  };

  return (
    <div className="h-16 bg-[#0d1420] border-b border-[#1a2332] flex items-center justify-between px-6">
      {/* Left: Product Name and Selectors */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold tracking-tight">PharmaLens</h1>

        {/* Drug Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search drug..."
            className="bg-[#1a2332] text-white pl-10 pr-4 py-2 rounded border border-[#2a3544] hover:border-[#3a4554] focus:outline-none focus:border-[#4a86ff] text-sm font-medium transition-colors min-w-[200px]"
          />
          {showSuggestions && filteredDrugs.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a2332] border border-[#2a3544] rounded shadow-xl z-50 max-h-64 overflow-y-auto">
              {filteredDrugs.map((drug) => (
                <button
                  key={drug}
                  onClick={() => handleDrugSelect(drug)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-[#2a3544] transition-colors"
                >
                  {drug}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Metric Selector */}
        <div className="relative">
          <select
            value={selectedMetric}
            onChange={(e) => onMetricChange(e.target.value)}
            className="appearance-none bg-[#1a2332] text-white px-4 py-2 pr-10 rounded border border-[#2a3544] hover:border-[#3a4554] focus:outline-none focus:border-[#4a86ff] cursor-pointer text-sm font-medium transition-colors min-w-[200px]"
          >
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#2a3544] border border-[#2a3544] hover:border-[#3a4554] rounded text-sm font-medium transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#4a86ff] hover:bg-[#5a96ff] rounded text-sm font-medium transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}