import { Pill, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DrugInfoSidebarProps {
  selectedDrug: string;
}

interface NewsArticle {
  title: string;
  date: string;
  source: string;
  url: string;
}

interface DrugSummary {
  description: string;
  usage: string;
  sideEffects: string;
}

interface DrugData {
  medicine: string;
  summary: DrugSummary;
  news: NewsArticle[];
}

export default function DrugInfoSidebar({ selectedDrug }: DrugInfoSidebarProps) {
  const [drugData, setDrugData] = useState<DrugData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrugInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/drug_info/${selectedDrug}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setDrugData(data);
      } catch (error) {
        console.error("Error fetching drug info:", error);
        // Fallback or empty state could be handled here
        setDrugData(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDrug) {
      fetchDrugInfo();
    }
  }, [selectedDrug]);

  if (loading) {
    return (
      <div className="w-80 h-full bg-[#0d1420] border-r border-[#1a2332] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4a86ff] animate-spin" />
      </div>
    )
  }

  if (!drugData) {
    return (
      <div className="w-80 h-full bg-[#0d1420] border-r border-[#1a2332] p-6 text-gray-400">
        Select a drug to view details.
      </div>
    )
  }

  return (
    <div className="w-80 h-full bg-[#0d1420] border-r border-[#1a2332] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#1a2332]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#1a2332] rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-[#4a86ff]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{drugData.medicine}</h2>
            <p className="text-sm text-gray-400">AI Generated Summary</p>
          </div>
        </div>
      </div>

      {/* Drug Details */}
      <div className="p-6 border-b border-[#1a2332]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Drug Information</h3>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-200 leading-relaxed">{drugData.summary.description}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Usage</div>
            <div className="text-sm text-gray-200 leading-relaxed">{drugData.summary.usage}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Common Side Effects</div>
            <div className="text-sm text-gray-200 leading-relaxed">{drugData.summary.sideEffects}</div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Relevant News</h3>
        <div className="space-y-3">
          {drugData.news.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3 rounded-lg bg-[#151b29] border border-[#1a2332] hover:border-[#4a86ff] hover:bg-[#1a2332] transition-all duration-200"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-1">
                  <h4 className="text-sm text-gray-200 group-hover:text-[#4a86ff] leading-snug mb-1.5 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="truncate max-w-[100px]">{article.source}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#4a86ff] flex-shrink-0 mt-0.5 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
      {/* Voices Section */}
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Voices (Global)</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-[#1a2332] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-[#1a2332]/50 rounded-lg border border-[#2a3544] italic text-gray-300 text-sm">
              "After taking {selectedDrug}, I noticed a significant improvement in my levels within weeks."
            </div>
            <div className="p-4 bg-[#1a2332]/50 rounded-lg border border-[#2a3544] italic text-gray-300 text-sm">
              "The side effects were manageable, mostly nausea in the beginning."
            </div>
            <div className="p-4 bg-[#1a2332]/50 rounded-lg border border-[#2a3544] italic text-gray-300 text-sm">
              "Hard to get a prescription filled at my local pharmacy lately."
            </div>
            <div className="text-xs text-center text-gray-500 mt-4">
              * Sample posts from global discussion
            </div>
          </div>
        )}
      </div>
    </div>
  );
}