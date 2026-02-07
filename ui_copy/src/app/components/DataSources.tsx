import { User, Stethoscope, Shield } from 'lucide-react';

interface DataSourcesProps {
  sources: {
    patients: boolean;
    providers: boolean;
    government: boolean;
  };
  onToggleSource: (source: 'patients' | 'providers' | 'government') => void;
}

const sourceConfig = [
  {
    id: 'patients' as const,
    label: 'Patients',
    icon: User,
    count: '2.4M',
  },
  {
    id: 'providers' as const,
    label: 'Healthcare Providers',
    icon: Stethoscope,
    count: '125K',
  },
  {
    id: 'government' as const,
    label: 'Government/Regulatory',
    icon: Shield,
    count: '8K',
  },
];

export default function DataSources({ sources, onToggleSource }: DataSourcesProps) {
  return (
    <div className="p-4 border-b border-gray-800">
      <h3 className="text-xs font-semibold text-gray-400 mb-3">DATA SOURCES</h3>
      <div className="space-y-2">
        {sourceConfig.map((source) => {
          const Icon = source.icon;
          const isActive = sources[source.id];
          
          return (
            <button
              key={source.id}
              onClick={() => onToggleSource(source.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-800/50' : 'opacity-50 hover:opacity-75'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{source.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{source.count}</span>
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-600'
                  }`}
                >
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
