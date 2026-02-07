import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  drugFilter: string;
  onDrugChange: (drug: string) => void;
}

export function Header({ drugFilter }: HeaderProps) {
  return (
    <header className="border-b border-gray-800/50 bg-[#0a0e13]">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
              Real-time Patient Perception Intelligence
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              PharmaLens
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/60 border border-gray-700/50 rounded-lg hover:bg-gray-900 hover:border-gray-600 transition-all">
              <span className="text-sm font-medium text-white">{drugFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
