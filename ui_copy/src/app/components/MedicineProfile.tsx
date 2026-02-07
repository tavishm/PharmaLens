import { useState } from 'react';
import { TrendingUp, TrendingDown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface MedicineProfileProps {
  medicine: string;
  selectedMetric: string;
}

const medicineData: Record<string, any> = {
  'Ozempic': {
    subtitle: 'Semaglutide • GLP-1 Receptor Agonist',
    indications: ['Type 2 Diabetes', 'Weight Management', 'Cardiovascular protection'],
    keyTrends: [
      { label: 'Overall Efficacy', value: '+3.2%', positive: true },
      { label: 'Long-term Safety', value: '+1.8%', positive: true },
      { label: 'Nausea Concerns', value: '-2.1%', positive: false },
    ],
    aiTrends: [
      {
        title: 'Intestinal Coverage',
        value: '65',
        description: 'Strong social media presence focusing on weight loss benefits',
      },
      {
        title: 'Clinical Efficacy',
        value: '88',
        description: 'Recent studies show significant HbA1c reduction',
      },
      {
        title: 'Side Effects',
        value: '42',
        description: 'GI side effects commonly mentioned in patient forums',
      },
    ],
    insights: [
      {
        title: 'Recent Activity',
        content: 'Increased social media activity following celebrity endorsements. 73% positive sentiment in diabetes communities.',
        tags: ['Weight Management', 'Social Trends'],
      },
      {
        title: 'Demonstrated significant GI/cardiovascular improvement over previous treatment',
        content: 'The product demonstrated significant cardiovascular benefits in the SELECT trial, leading to FDA label expansion...',
        tags: ['Cardiovascular prevention', 'Clinical', 'Diabetes'],
      },
      {
        title: 'Supply Concerns',
        content: 'Access friction increasing due to high demand and manufacturing constraints. Mentions up 45% in Q4 2025.',
        tags: ['Accessibility', 'Supply Chain'],
      },
    ],
  },
  'Keytruda': {
    subtitle: 'Pembrolizumab • PD-1 Inhibitor',
    indications: ['Melanoma', 'NSCLC', 'Head and Neck Cancer'],
    keyTrends: [
      { label: 'Treatment Response', value: '+4.5%', positive: true },
      { label: 'Insurance Coverage', value: '+2.3%', positive: true },
      { label: 'Fatigue Reports', value: '-1.5%', positive: false },
    ],
    aiTrends: [
      {
        title: 'Clinical Evidence',
        value: '92',
        description: 'Robust trial data across multiple tumor types',
      },
      {
        title: 'Patient Satisfaction',
        value: '78',
        description: 'High satisfaction among responding patients',
      },
      {
        title: 'Access Challenges',
        value: '38',
        description: 'Cost concerns in emerging markets',
      },
    ],
    insights: [
      {
        title: 'Expansion into New Indications',
        content: 'Growing mentions in colorectal cancer communities following recent approval. Patient advocacy groups highly engaged.',
        tags: ['Oncology', 'Clinical Trials'],
      },
      {
        title: 'Combination Therapy Discussions',
        content: 'Increasing references to combination with chemotherapy. Medical literature mentions up 67%.',
        tags: ['Treatment Protocols', 'Evidence'],
      },
    ],
  },
};

export default function MedicineProfile({ medicine, selectedMetric }: MedicineProfileProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(0);
  
  const medicineKey = medicine.split(' ')[0];
  const data = medicineData[medicineKey] || medicineData['Ozempic'];

  return (
    <div className="p-4 space-y-6">
      {/* Medicine Header */}
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-lg font-semibold mb-1">MEDICINE PROFILE</h2>
        <div className="text-xs text-gray-500 mb-3">Full Dataset + 23 days ago</div>
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold mb-1">{medicineKey}</h3>
          <p className="text-xs text-gray-400 mb-3">{data.subtitle}</p>
          <div className="flex flex-wrap gap-1.5">
            {data.indications.map((indication: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs"
              >
                {indication}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key Trends */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          Key Trends
        </h3>
        <div className="space-y-2">
          {data.keyTrends.map((trend: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-gray-800/30 rounded-lg">
              <span className="text-sm text-gray-300">{trend.label}</span>
              <div className="flex items-center gap-1">
                {trend.positive ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {trend.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Only Trends */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI-Only Trends
        </h3>
        <div className="space-y-3">
          {data.aiTrends.map((trend: any, i: number) => (
            <div key={i} className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{trend.title}</span>
                <span className="text-lg font-bold text-purple-400">{trend.value}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{trend.description}</p>
              <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{ width: `${trend.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perception Insights */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Perception Insights</h3>
        <div className="space-y-2">
          {data.insights.map((insight: any, i: number) => {
            const isExpanded = expandedInsight === i;
            
            return (
              <div
                key={i}
                className="bg-gray-800/30 rounded-lg overflow-hidden border border-gray-700/50"
              >
                <button
                  onClick={() => setExpandedInsight(isExpanded ? null : i)}
                  className="w-full p-3 text-left hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium mb-2">{insight.title}</h4>
                      <div className="flex flex-wrap gap-1">
                        {insight.tags.map((tag: string, j: number) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3">
                    <div className="pt-2 border-t border-gray-700/50">
                      <p className="text-sm text-gray-300 leading-relaxed">{insight.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Attribution */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
        <p>Data aggregated from multiple sources. Updates monthly. The perception data presented here does not reflect medical truth or clinical efficacy.</p>
      </div>
    </div>
  );
}
