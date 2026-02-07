import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MentionsGraphProps {
  selectedDrug: string;
}

interface MentionData {
  year: string;
  mentions: number;
}

const mentionsData: Record<string, MentionData[]> = {
  'Ozempic': [
    { year: '2016', mentions: 120 },
    { year: '2017', mentions: 850 },
    { year: '2018', mentions: 1850 },
    { year: '2019', mentions: 3200 },
    { year: '2020', mentions: 5100 },
    { year: '2021', mentions: 8900 },
    { year: '2022', mentions: 15600 },
    { year: '2023', mentions: 28400 },
    { year: '2024', mentions: 45200 },
    { year: '2025', mentions: 62800 },
  ],
  'Keytruda': [
    { year: '2016', mentions: 2800 },
    { year: '2017', mentions: 4200 },
    { year: '2018', mentions: 6500 },
    { year: '2019', mentions: 9800 },
    { year: '2020', mentions: 14200 },
    { year: '2021', mentions: 18900 },
    { year: '2022', mentions: 24600 },
    { year: '2023', mentions: 31200 },
    { year: '2024', mentions: 38700 },
    { year: '2025', mentions: 45300 },
  ],
  'Humira': [
    { year: '2016', mentions: 18500 },
    { year: '2017', mentions: 21200 },
    { year: '2018', mentions: 24800 },
    { year: '2019', mentions: 27600 },
    { year: '2020', mentions: 29400 },
    { year: '2021', mentions: 31200 },
    { year: '2022', mentions: 32800 },
    { year: '2023', mentions: 28900 },
    { year: '2024', mentions: 24600 },
    { year: '2025', mentions: 20400 },
  ],
  'Eliquis': [
    { year: '2016', mentions: 8200 },
    { year: '2017', mentions: 10500 },
    { year: '2018', mentions: 13400 },
    { year: '2019', mentions: 16800 },
    { year: '2020', mentions: 20100 },
    { year: '2021', mentions: 23700 },
    { year: '2022', mentions: 27200 },
    { year: '2023', mentions: 30600 },
    { year: '2024', mentions: 33800 },
    { year: '2025', mentions: 36500 },
  ],
  'Revlimid': [
    { year: '2016', mentions: 12400 },
    { year: '2017', mentions: 14200 },
    { year: '2018', mentions: 16100 },
    { year: '2019', mentions: 17800 },
    { year: '2020', mentions: 19200 },
    { year: '2021', mentions: 20400 },
    { year: '2022', mentions: 21200 },
    { year: '2023', mentions: 17800 },
    { year: '2024', mentions: 14600 },
    { year: '2025', mentions: 11800 },
  ],
  'Dupixent': [
    { year: '2016', mentions: 180 },
    { year: '2017', mentions: 920 },
    { year: '2018', mentions: 2400 },
    { year: '2019', mentions: 4800 },
    { year: '2020', mentions: 8200 },
    { year: '2021', mentions: 12600 },
    { year: '2022', mentions: 18400 },
    { year: '2023', mentions: 25800 },
    { year: '2024', mentions: 34200 },
    { year: '2025', mentions: 43600 },
  ],
  'Enbrel': [
    { year: '2016', mentions: 15800 },
    { year: '2017', mentions: 16200 },
    { year: '2018', mentions: 16400 },
    { year: '2019', mentions: 15900 },
    { year: '2020', mentions: 15200 },
    { year: '2021', mentions: 14600 },
    { year: '2022', mentions: 13800 },
    { year: '2023', mentions: 12900 },
    { year: '2024', mentions: 12100 },
    { year: '2025', mentions: 11400 },
  ],
  'Imbruvica': [
    { year: '2016', mentions: 5200 },
    { year: '2017', mentions: 6800 },
    { year: '2018', mentions: 8600 },
    { year: '2019', mentions: 10200 },
    { year: '2020', mentions: 11800 },
    { year: '2021', mentions: 13200 },
    { year: '2022', mentions: 14400 },
    { year: '2023', mentions: 13900 },
    { year: '2024', mentions: 12800 },
    { year: '2025', mentions: 11600 },
  ],
  'Opdivo': [
    { year: '2016', mentions: 3400 },
    { year: '2017', mentions: 5200 },
    { year: '2018', mentions: 7600 },
    { year: '2019', mentions: 10400 },
    { year: '2020', mentions: 13800 },
    { year: '2021', mentions: 17200 },
    { year: '2022', mentions: 20800 },
    { year: '2023', mentions: 24600 },
    { year: '2024', mentions: 28400 },
    { year: '2025', mentions: 32200 },
  ],
  'Xarelto': [
    { year: '2016', mentions: 9400 },
    { year: '2017', mentions: 11200 },
    { year: '2018', mentions: 13600 },
    { year: '2019', mentions: 16200 },
    { year: '2020', mentions: 18800 },
    { year: '2021', mentions: 21400 },
    { year: '2022', mentions: 23800 },
    { year: '2023', mentions: 26200 },
    { year: '2024', mentions: 28400 },
    { year: '2025', mentions: 30200 },
  ],
};

export default function MentionsGraph({ selectedDrug }: MentionsGraphProps) {
  const data = mentionsData[selectedDrug] || mentionsData['Ozempic'];

  return (
    <div className="h-56 bg-[#0d1420] border-t border-[#1a2332] px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Drug Mentions Over Time (2016-2025)
        </h3>
        <div className="text-xs text-gray-500">{selectedDrug}</div>
      </div>
      <div className="bg-[#0a0e1a] rounded-lg p-4 border border-[#1a2332] h-[calc(100%-2.5rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 9 }}
              axisLine={{ stroke: '#1a2332' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 9 }}
              axisLine={{ stroke: '#1a2332' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0d1420',
                border: '1px solid #1a2332',
                borderRadius: '8px',
                color: '#e5e7eb',
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Line 
              type="monotone" 
              dataKey="mentions" 
              stroke="#4a86ff" 
              strokeWidth={2}
              dot={{ fill: '#4a86ff', r: 2 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}