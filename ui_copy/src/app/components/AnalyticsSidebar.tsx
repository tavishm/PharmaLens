import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AnalyticsSidebarProps {
  selectedCountry: string | null;
  selectedMetric: string;
  selectedDrug: string;
}

interface CountryData {
  flag: string;
  overallScore: number;
  trend: number;
  metrics: {
    perception: number;
    sideEffect: number;
    access: number;
    trust: number;
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
      perception: 75,
      sideEffect: 35,
      access: 78,
      trust: 82,
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
      perception: 76,
      sideEffect: 32,
      access: 79,
      trust: 86,
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
      perception: 77,
      sideEffect: 30,
      access: 80,
      trust: 87,
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
      perception: 68,
      sideEffect: 42,
      access: 72,
      trust: 75,
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
  'India': {
    flag: '🇮🇳',
    overallScore: 64,
    trend: 4.1,
    metrics: {
      perception: 64,
      sideEffect: 46,
      access: 60,
      trust: 72,
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
      perception: 73,
      sideEffect: 34,
      access: 76,
      trust: 82,
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
      perception: 58,
      sideEffect: 52,
      access: 52,
      trust: 65,
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
      perception: 76,
      sideEffect: 32,
      access: 78,
      trust: 85,
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

export default function AnalyticsSidebar({ selectedCountry, selectedMetric, selectedDrug }: AnalyticsSidebarProps) {
  if (!selectedCountry) {
    return (
      <div className="w-96 bg-[#0d1420] border-l border-[#1a2332] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#1a2332] rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 text-sm">Select a country on the map to view detailed analytics</p>
        </div>
      </div>
    );
  }

  const data = countryDatabase[selectedCountry] || countryDatabase['United States'];
  const TrendIcon = data.trend >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="w-96 bg-[#0d1420] border-l border-[#1a2332] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#1a2332]">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{selectedCountry}</h2>
            <div className="text-xs text-gray-500 mt-0.5">{selectedDrug}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold">{data.overallScore}</span>
              <div className={`flex items-center gap-1 text-sm ${data.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{data.trend >= 0 ? '+' : ''}{data.trend}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Overall Performance Index</div>
      </div>

      {/* Key Metrics with Percentages */}
      <div className="p-6 border-b border-[#1a2332]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Key Metrics</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-300">Effectiveness perception</span>
              <span className="text-sm font-semibold">{data.metrics.perception}%</span>
            </div>
            <div className="h-2 bg-[#1a2332] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.metrics.perception}%`,
                  backgroundColor: data.metrics.perception >= 70 ? '#0ea5e9' : data.metrics.perception >= 60 ? '#14b8a6' : data.metrics.perception >= 50 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-300">Side effect mention frequency</span>
              <span className="text-sm font-semibold">{data.metrics.sideEffect}%</span>
            </div>
            <div className="h-2 bg-[#1a2332] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.metrics.sideEffect}%`,
                  backgroundColor: data.metrics.sideEffect >= 70 ? '#ef4444' : data.metrics.sideEffect >= 60 ? '#f59e0b' : data.metrics.sideEffect >= 50 ? '#14b8a6' : '#0ea5e9',
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-300">Access friction</span>
              <span className="text-sm font-semibold">{data.metrics.access}%</span>
            </div>
            <div className="h-2 bg-[#1a2332] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.metrics.access}%`,
                  backgroundColor: data.metrics.access >= 70 ? '#0ea5e9' : data.metrics.access >= 60 ? '#14b8a6' : data.metrics.access >= 50 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-300">Trust in evidence</span>
              <span className="text-sm font-semibold">{data.metrics.trust}%</span>
            </div>
            <div className="h-2 bg-[#1a2332] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.metrics.trust}%`,
                  backgroundColor: data.metrics.trust >= 70 ? '#0ea5e9' : data.metrics.trust >= 60 ? '#14b8a6' : data.metrics.trust >= 50 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-300">Competitive pressure</span>
              <span className="text-sm font-semibold">{data.metrics.competitive}%</span>
            </div>
            <div className="h-2 bg-[#1a2332] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.metrics.competitive}%`,
                  backgroundColor: data.metrics.competitive >= 70 ? '#0ea5e9' : data.metrics.competitive >= 60 ? '#14b8a6' : data.metrics.competitive >= 50 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Most Discussed Points */}
      <div className="p-6 border-b border-[#1a2332]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Most Discussed Points</h3>
        <div className="space-y-2.5">
          {data.discussionPoints.map((point, index) => (
            <div key={index} className="flex gap-2.5">
              <div className="w-1.5 h-1.5 bg-[#4a86ff] rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Regional Breakdown</h3>
        <div className="space-y-2.5">
          {data.regionalInsights.map((insight, index) => (
            <div key={index} className="flex gap-2.5">
              <div className="w-1.5 h-1.5 bg-[#14b8a6] rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}