import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MentionsGraphProps {
  selectedDrug: string;
  selectedMetric: string;
  selectedCountry?: string | null;
}

interface MentionData {
  year: string;
  count: number;
}

export default function MentionsGraph({ selectedDrug, selectedMetric, selectedCountry }: MentionsGraphProps) {
  const [data, setData] = useState<MentionData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDrug) return;

      setLoading(true);
      try {
        let url = `http://127.0.0.1:8000/mentions_over_time/${selectedDrug}?metric=${selectedMetric}`;
        if (selectedCountry) {
          url += `&country=${encodeURIComponent(selectedCountry)}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          const formattedData = result.map((item: any) => ({
            year: item.year,
            count: item.value || item.count // Handle both structures if needed
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch mentions data");
          setData([]); // Clear data on error
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDrug, selectedMetric, selectedCountry]);

  return (
    <div className="h-full bg-[#0d1420] border-t border-[#1a2332] px-6 py-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4a86ff]"></span>
          Mentions Over Time ({selectedMetric})
        </h3>
        <div className="text-xs text-gray-500">{selectedDrug}</div>
      </div>

      <div className="bg-[#0a0e1a] rounded-lg p-4 border border-[#1a2332] flex-1 min-h-0 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/80 z-10">
            <div className="w-6 h-6 border-2 border-[#2a3544] border-t-[#4a86ff] rounded-full animate-spin" />
          </div>
        )}

        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" vertical={false} />
              <XAxis
                dataKey="year"
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={{ stroke: '#1a2332' }}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1420',
                  border: '1px solid #1a2332',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                  fontSize: '12px'
                }}
                cursor={{ stroke: '#2a3544', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4a86ff"
                strokeWidth={2}
                dot={{ fill: '#0a0e1a', stroke: '#4a86ff', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#4a86ff', stroke: '#fff' }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          !loading && (
            <div className="h-full flex items-center justify-center text-gray-500 text-xs">
              No data available for this selection.
            </div>
          )
        )}
      </div>
    </div>
  );
}