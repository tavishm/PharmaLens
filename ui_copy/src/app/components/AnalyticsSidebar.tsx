import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AnalyticsSidebarProps {
  selectedCountry: string | null;
  selectedMetric: string;
  selectedDrug: string;
  drugStats: any;
  similarDrug: string | null;
  similarDrugStats: any;
  onClose: () => void;
}

interface CountryData {
  flag: string;
  overallScore: number;
  trend: number;
  metrics: {
    effectiveness: number;
    sideEffect: number;
    access: number;
    expensiveness: number;
    competitive: number;
  };
  regions: Array<{
    name: string;
    score: number;
  }>;
  discussionPoints: string[];
  regionalInsights: string[];
}

const countryDatabase: Record<string, CountryData> = {
  'United States': {
    flag: '🇺🇸',
    overallScore: 75,
    trend: 3.2,
    metrics: {
      effectiveness: 75,
      sideEffect: 35,
      access: 78,
      expensiveness: 82,
      competitive: 80,
    },
    regions: [
      { name: 'California', score: 82 },
      { name: 'New York', score: 79 },
      { name: 'Texas', score: 71 },
      { name: 'Florida', score: 68 },
      { name: 'Midwest Region', score: 73 },
    ],
    discussionPoints: [
      'Insurance coverage expansion',
      'High efficacy in metabolic conditions',
      'California leading adoption',
      'Supply chain constraints',
      'Patient weight loss outcomes exceeding expectations',
      'Cardiovascular benefits documented',
    ],
    regionalInsights: [
      'Strong performance in coastal urban markets with high healthcare infrastructure density.',
      'Cost concerns elevated in southern states impacting access metrics by 12%.',
      'Social media sentiment trending positive (+15%) following recent clinical publications.',
    ],
  },
  'United Kingdom': {
    flag: '🇬🇧',
    overallScore: 76,
    trend: 2.1,
    metrics: {
      effectiveness: 76,
      sideEffect: 32,
      access: 79,
      expensiveness: 86,
      competitive: 81,
    },
    regions: [
      { name: 'England', score: 78 },
      { name: 'Scotland', score: 81 },
      { name: 'Wales', score: 72 },
      { name: 'Northern Ireland', score: 74 },
    ],
    discussionPoints: [
      'NHS approval secured',
      'Scotland highest prescribing rates',
      'NICE guideline compliance',
      'Reduced hospitalizations',
      'Long-term safety data favorable',
      'GP satisfaction ratings excellent',
    ],
    regionalInsights: [
      'NHS formulary inclusion driving rapid adoption across all regions.',
      'Scotland leading in evidence-based prescribing patterns.',
      'Patient forums show 89% positive sentiment, highest in Europe.',
    ],
  },
  'Germany': {
    flag: '🇩🇪',
    overallScore: 77,
    trend: 1.8,
    metrics: {
      effectiveness: 77,
      sideEffect: 30,
      access: 80,
      expensiveness: 87,
      competitive: 82,
    },
    regions: [
      { name: 'Bavaria', score: 80 },
      { name: 'North Rhine-Westphalia', score: 76 },
      { name: 'Baden-Württemberg', score: 82 },
      { name: 'Berlin', score: 73 },
      { name: 'Saxony', score: 75 },
    ],
    discussionPoints: [
      'G-BA positive reimbursement',
      'Strict regulatory approval',
      'Academic medical center endorsement',
      'Bavaria leading outcomes',
      'Comprehensive insurance coverage',
      'Clinical trial data transparency',
    ],
    regionalInsights: [
      'Highest clinical evidence trust scores globally driven by rigorous regulatory framework.',
      'Regional variations minimal, indicating consistent healthcare quality nationwide.',
      'Physicians cite peer-reviewed literature in 91% of prescription discussions.',
    ],
  },
  'China': {
    flag: '🇨🇳',
    overallScore: 68,
    trend: 5.4,
    metrics: {
      effectiveness: 68,
      sideEffect: 42,
      access: 72,
      expensiveness: 75,
      competitive: 72,
    },
    regions: [
      { name: 'Beijing', score: 78 },
      { name: 'Shanghai', score: 76 },
      { name: 'Guangdong', score: 70 },
      { name: 'Sichuan', score: 62 },
      { name: 'Henan', score: 59 },
    ],
    discussionPoints: [
      'National reimbursement list inclusion',
      'Beijing and Shanghai dominant',
      'WeChat health discussions trending',
      'Domestic clinical trials positive',
      'Tier 1 city rapid uptake',
      'Western provinces infrastructure gaps',
    ],
    regionalInsights: [
      'Tier 1 cities showing rapid adoption (+18% QoQ) following regulatory approval.',
      'Rural-urban divide significant: Tier 3 cities lagging by avg. 23 points.',
      'Social media discussions emphasize efficacy data from domestic clinical trials.',
    ],
  },
  'France': {
    flag: '🇫🇷',
    overallScore: 74,
    trend: 1.8,
    metrics: {
      effectiveness: 75,
      sideEffect: 30,
      access: 80,
      expensiveness: 85,
      competitive: 70,
    },
    regions: [
      { name: 'Île-de-France', score: 78 },
      { name: 'Provence-Alpes-Côte d\'Azur', score: 75 },
    ],
    discussionPoints: [
      'High reimbursement rates',
      'Pharmacy network distribution',
    ],
    regionalInsights: [
      'Strong adherence to treatment protocols in metropolitan areas.',
    ],
  },

  'India': {
    flag: '🇮🇳',
    overallScore: 64,
    trend: 4.1,
    metrics: {
      effectiveness: 64,
      sideEffect: 46,
      access: 60,
      expensiveness: 72,
      competitive: 70,
    },
    regions: [
      { name: 'Maharashtra', score: 72 },
      { name: 'Karnataka', score: 69 },
      { name: 'Tamil Nadu', score: 67 },
      { name: 'Uttar Pradesh', score: 55 },
      { name: 'Bihar', score: 51 },
    ],
    discussionPoints: [
      'Mumbai leading adoption',
      'Affordability primary concern',
      'Generic alternatives discussion',
      'Metropolitan vs rural divide',
      'Government procurement talks',
      'Diabetes management focus',
    ],
    regionalInsights: [
      'Metropolitan centers demonstrate strong awareness and willingness to adopt.',
      'Price sensitivity remains primary barrier in semi-urban and rural markets.',
      'Generic competition expected to significantly impact access within 18 months.',
    ],
  },
  'Japan': {
    flag: '🇯🇵',
    overallScore: 73,
    trend: 1.2,
    metrics: {
      effectiveness: 73,
      sideEffect: 34,
      access: 76,
      expensiveness: 82,
      competitive: 78,
    },
    regions: [
      { name: 'Tokyo', score: 79 },
      { name: 'Osaka', score: 75 },
      { name: 'Kanto Region', score: 76 },
      { name: 'Kyushu', score: 68 },
      { name: 'Hokkaido', score: 70 },
    ],
    discussionPoints: [
      'PMDA approval process',
      'Elderly patient focus',
      'Tokyo highest adoption',
      'Insurance coverage comprehensive',
      'Long-term safety valued',
      'Patient community positive feedback',
    ],
    regionalInsights: [
      'Elderly population adoption steady, driven by comprehensive insurance coverage.',
      'Physician community values long-term safety data and regulatory scrutiny.',
      'Online patient communities actively share treatment experiences, 84% positive.',
    ],
  },
  'Brazil': {
    flag: '🇧🇷',
    overallScore: 58,
    trend: -1.3,
    metrics: {
      effectiveness: 58,
      sideEffect: 52,
      access: 52,
      expensiveness: 65,
      competitive: 62,
    },
    regions: [
      { name: 'São Paulo', score: 68 },
      { name: 'Rio de Janeiro', score: 62 },
      { name: 'Brasília', score: 64 },
      { name: 'Bahia', score: 50 },
      { name: 'Amazonas', score: 45 },
    ],
    discussionPoints: [
      'Currency fluctuation impact',
      'São Paulo private market focus',
      'SUS access limited',
      'Affordability barriers',
      'Regional equity concerns',
      'Patient advocacy groups active',
    ],
    regionalInsights: [
      'Economic headwinds impacting private insurance coverage and out-of-pocket affordability.',
      'Public healthcare system (SUS) access limited, creating significant equity concerns.',
      'Regional disparities pronounced: Northern regions face infrastructure challenges.',
    ],
  },
  'Australia': {
    flag: '🇦🇺',
    overallScore: 76,
    trend: 2.7,
    metrics: {
      effectiveness: 76,
      sideEffect: 32,
      access: 78,
      expensiveness: 85,
      competitive: 81,
    },
    regions: [
      { name: 'New South Wales', score: 79 },
      { name: 'Victoria', score: 78 },
      { name: 'Queensland', score: 74 },
      { name: 'Western Australia', score: 72 },
      { name: 'South Australia', score: 73 },
    ],
    discussionPoints: [
      'PBS listing secured',
      'Sydney and Melbourne leading',
      'TGA fast-track approval',
      'Patient satisfaction high',
      'Evidence-based prescribing',
      'Cost-effectiveness favorable',
    ],
    regionalInsights: [
      'PBS listing enabling broad access across all socioeconomic groups.',
      'Strong clinical uptake supported by evidence-based prescribing culture.',
      'Patient satisfaction metrics among highest globally, 92% would recommend.',
    ],
  },
};

interface AnalyticsSidebarProps {
  selectedCountry: string | null;
  selectedMetric: string;
  selectedDrug: string;
  drugStats: any;
  similarDrug: string | null;
  similarDrugStats: any;
}

export default function AnalyticsSidebar({
  selectedCountry,
  selectedMetric,
  selectedDrug,
  drugStats,
  similarDrug,
  similarDrugStats,
  onClose
}: AnalyticsSidebarProps) {
  const [loadingDiscussionPoints, setLoadingDiscussionPoints] = useState(false);
  const [discussionPoints, setDiscussionPoints] = useState<string[]>([]);

  // ... (helper functions getMetricsForStats, realMetrics, similarMetrics, countryData construction remain same)

  const getMetricsForStats = (stats: any) => {
    if (!stats || !selectedCountry) return null;

    const countryIndex = stats.countries.findIndex((c: string) =>
      c === selectedCountry ||
      (c === 'USA' && (selectedCountry === 'United States' || selectedCountry === 'United States of America')) ||
      (c === 'UK' && (selectedCountry === 'United Kingdom' || selectedCountry === 'Great Britain'))
    );

    if (countryIndex === -1) return null;

    return {
      effectiveness: stats.effectiveness[countryIndex],
      sideEffect: stats.sideEffect[countryIndex],
      access: stats.access[countryIndex],
      expensiveness: stats.expensiveness[countryIndex],
      competitive: stats.competition[countryIndex],
    };
  };

  const realMetrics = getMetricsForStats(drugStats);
  const similarMetrics = getMetricsForStats(similarDrugStats);

  // ... (rest of data prep logic)
  const baseData = selectedCountry ? countryDatabase[selectedCountry] : null;

  const similarOverallScore = similarMetrics ? Math.round(
    ((similarMetrics.effectiveness +
      similarMetrics.sideEffect +
      similarMetrics.access +
      similarMetrics.expensiveness +
      similarMetrics.competitive) / 5) * 100
  ) : 0;

  const countryData: CountryData | null = selectedCountry ? {
    flag: baseData?.flag || '🌐',
    overallScore: realMetrics ? Math.round(
      ((realMetrics.effectiveness +
        realMetrics.sideEffect +
        realMetrics.access +
        realMetrics.expensiveness +
        realMetrics.competitive) / 5) * 100
    ) : 0,
    trend: 0,
    metrics: realMetrics ? {
      effectiveness: Math.round(realMetrics.effectiveness * 100),
      sideEffect: Math.round(realMetrics.sideEffect * 100),
      access: Math.round(realMetrics.access * 100),
      expensiveness: Math.round(realMetrics.expensiveness * 100),
      competitive: Math.round(realMetrics.competitive * 100),
    } : {
      effectiveness: 0, sideEffect: 0, access: 0, expensiveness: 0, competitive: 0
    },
    regions: [],
    discussionPoints: [],
    regionalInsights: []
  } : null;

  const [voices, setVoices] = useState<{ content: string, location: string, date: string }[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      if (!selectedDrug) return;
      setLoadingVoices(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/medicine_quotes/${selectedDrug}`);
        if (response.ok) {
          const data = await response.json();
          setVoices(data.quotes || []);
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
      } finally {
        setLoadingVoices(false);
      }
    };
    fetchVoices();
  }, [selectedDrug]);

  if (countryData && !baseData) {
    if (selectedCountry === 'United States' || selectedCountry === 'USA' || selectedCountry === 'United States of America') countryData.flag = '🇺🇸';
    else if (selectedCountry === 'United Kingdom' || selectedCountry === 'UK') countryData.flag = '🇬🇧';
    else if (selectedCountry === 'Germany') countryData.flag = '🇩🇪';
    else if (selectedCountry === 'India') countryData.flag = '🇮🇳';
    else if (selectedCountry === 'China') countryData.flag = '🇨🇳';
    else if (selectedCountry === 'Japan') countryData.flag = '🇯🇵';
    else if (selectedCountry === 'France') countryData.flag = '🇫🇷';
    else if (selectedCountry === 'Canada') countryData.flag = '🇨🇦';
    else if (selectedCountry === 'Brazil') countryData.flag = '🇧🇷';
    else if (selectedCountry === 'Australia') countryData.flag = '🇦🇺';
  }

  // Effect to fetch discussion points
  useEffect(() => {
    const fetchDiscussionPoints = async () => {
      if (!selectedDrug || !selectedCountry) {
        setDiscussionPoints([]);
        return;
      }

      setLoadingDiscussionPoints(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/cluster_labels/${selectedDrug}?country=${encodeURIComponent(selectedCountry)}&metric=${selectedMetric}`);
        if (response.ok) {
          const data = await response.json();
          setDiscussionPoints(data.labels);
        } else {
          setDiscussionPoints([]);
        }
      } catch (error) {
        console.error("Error fetching discussion points:", error);
        setDiscussionPoints([]);
      } finally {
        setLoadingDiscussionPoints(false);
      }
    };

    fetchDiscussionPoints();
  }, [selectedDrug, selectedCountry, selectedMetric]);


  if (!selectedCountry) {
    return (
      <div className="w-96 h-full flex flex-col bg-[#0d1420] border-l border-[#1a2332] z-20 shadow-xl relative">
        <div className="p-6 border-b border-[#1a2332]">
          <h2 className="text-xl font-bold text-white mb-2">Global Voices</h2>
          <p className="text-sm text-gray-400">Recent discussions about {selectedDrug}</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
          {loadingVoices ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-2 border-[#2a3544] border-t-[#4a86ff] rounded-full animate-spin" />
            </div>
          ) : voices.length > 0 ? (
            voices.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl bg-[#1a2332]/50 border border-[#2a3544] hover:bg-[#1a2332] transition-colors"
              >
                <p className="text-gray-300 text-sm italic mb-3">"{post.content}"</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-medium text-[#4a86ff]">{post.location}</span>
                  <span className="uppercase tracking-wide">{post.date}</span>
                </div>
              </motion.div>
            ))) : (
            <div className="text-center text-gray-500 py-8">No recent posts found.</div>
          )}
        </div>

        <div className="p-6 border-t border-[#1a2332] bg-[#0d1420]/50">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <Info className="w-4 h-4" />
            <span>Select a country on the map to view detailed analytics.</span>
          </div>
        </div>
      </div>
    );
  }

  // Selected Country State
  return (
    <AnimatePresence mode="wait">
      {selectedCountry && countryData && (
        <div className="w-[800px] h-full flex flex-row bg-[#0d1420]/95 backdrop-blur-xl border-l border-[#1a2332] shadow-2xl z-20 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-[#1a2332]/80 text-gray-400 hover:text-white hover:bg-[#2a3544] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Left Column - Comparison Chart */}
          <div className="flex-1 p-6 border-r border-[#1a2332] overflow-y-auto custom-scrollbar">
            <div className="mb-6">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 block">Head-to-Head Analysis</span>
              <h3 className="text-xl font-bold text-white">
                {selectedDrug} <span className="text-gray-500 text-base font-normal">vs</span> <span className="text-[#d946ef] font-bold">{similarDrug || 'Competitor'}</span>
              </h3>
            </div>

            {similarDrug ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-xl border border-[#2a3544] bg-[#1a2332]/50"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#2a3544]">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Overall Verdict</span>
                    <span className={`text-xl font-bold ${(countryData.overallScore || 0) > similarOverallScore
                      ? 'text-[#10b981]'
                      : (countryData.overallScore || 0) < similarOverallScore
                        ? 'text-[#ef4444]'
                        : 'text-white'
                      }`}>
                      {(countryData.overallScore || 0) > similarOverallScore ? 'Leading' : 'Lagging'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white">
                      {similarMetrics ? <CountUp end={similarOverallScore} duration={1.5} /> : 'N/A'}
                    </span>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Competitor Score</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Effectiveness", key: "effectiveness", color: "bg-[#3b82f6]" },
                    { label: "Side Effects", key: "sideEffect", color: "bg-[#ef4444]" },
                    { label: "Access", key: "access", color: "bg-[#f59e0b]" },
                    { label: "Affordability", key: "expensiveness", color: "bg-[#10b981]" },
                    { label: "Competition", key: "competitive", color: "bg-[#8b5cf6]" }
                  ].map((metric) => {
                    const currentVal = countryData.metrics[metric.key as keyof typeof countryData.metrics] || 0;
                    const similarVal = similarMetrics ? Math.round(similarMetrics[metric.key as keyof typeof similarMetrics] * 100) : 0;
                    return (
                      <div key={metric.key} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{metric.label}</span>
                          <div className="flex gap-3">
                            <span className="font-bold text-white">{currentVal}%</span>
                            <span className="text-gray-500">vs {similarVal}%</span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-[#0d1420] rounded-full overflow-hidden">
                          {/* Competitor Marker (faint bar) */}
                          <div
                            className="absolute top-0 left-0 h-full bg-gray-600/30"
                            style={{ width: `${similarVal}%` }}
                          />
                          {/* Current Value Bar */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${currentVal}%` }}
                            transition={{ duration: 1, delay: 0.1 }}
                            className={`absolute top-0 left-0 h-full rounded-full ${metric.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="p-4 rounded-lg bg-[#1a2332]/50 text-center text-gray-500 text-sm">
                No similar medicine data available.
              </div>
            )}
          </div>

          {/* Right Column - Country Details */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0d1420]/30 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-4xl">{countryData.flag}</span>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {selectedCountry}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 tracking-wider uppercase">
                  <span>Overall Score</span>
                  <div className="h-px w-8 bg-gray-700" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black text-[#4a86ff] tracking-tighter">
                  <CountUp end={countryData.overallScore} duration={2} />
                </div>
                <div className={`text-xs font-bold flex items-center justify-end gap-1 ${countryData.trend >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {countryData.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{Math.abs(countryData.trend)}% vs Global</span>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Info size={14} /> Key Metrics ({selectedDrug})
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Effectiveness", value: countryData.metrics.effectiveness, color: "bg-[#3b82f6]" },
                  { label: "Side Effects", value: countryData.metrics.sideEffect, color: "bg-[#ef4444]" },
                  { label: "Access", value: countryData.metrics.access, color: "bg-[#f59e0b]" },
                  { label: "Affordability", value: countryData.metrics.expensiveness, color: "bg-[#10b981]" },
                  { label: "Competition", value: countryData.metrics.competitive, color: "bg-[#8b5cf6]" }
                ].map((metric, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05, backgroundColor: "#252e40" }}
                    className="py-4 px-3 rounded-xl border border-[#2a3544] bg-[#1a2332] flex flex-col items-center justify-center text-center gap-2 transition-colors cursor-default shadow-lg"
                  >
                    <div className={`w-2 h-2 rounded-full ${metric.color}`} />
                    <span className="text-xs text-gray-400 font-medium uppercase leading-none tracking-tight">{metric.label}</span>
                    <span className="text-2xl font-black text-white leading-tight">
                      <CountUp end={metric.value} duration={1.5} />%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Discussion Points */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Info size={14} /> Discussion Points
              </h3>
              <div className="space-y-3">
                {loadingDiscussionPoints ? (
                  <div className="flex justify-center p-4">
                    <div className="w-6 h-6 border-2 border-[#2a3544] border-t-[#4a86ff] rounded-full animate-spin" />
                  </div>
                ) : discussionPoints.length > 0 ? (
                  discussionPoints.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#1a2332]/40 border border-[#2a3544] text-sm text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4a86ff] mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-[#1a2332]/50 text-center text-gray-500 text-sm">
                    No discussion points available for this region.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}