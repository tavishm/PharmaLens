import { Layers, Activity, AlertCircle, DollarSign, FileText, Users } from 'lucide-react';

interface PerceptionMetricsProps {
  selectedMetric: string;
  onSelectMetric: (metric: string) => void;
}

const metrics = [
  {
    id: 'combined',
    label: 'Combined Perception In...',
    description: 'Unified score across dimensions',
    icon: Layers,
  },
  {
    id: 'effectiveness',
    label: 'Effectiveness Perception',
    description: 'Perceived therapeutic benefit',
    icon: Activity,
  },
  {
    id: 'sideEffects',
    label: 'Side-Effect Mentions',
    description: 'Frequency of adverse event reports',
    icon: AlertCircle,
  },
  {
    id: 'access',
    label: 'Access Friction',
    description: 'Cost and availability concerns',
    icon: DollarSign,
  },
  {
    id: 'trust',
    label: 'Trust in Evidence',
    description: 'Clinical validation references',
    icon: FileText,
  },
  {
    id: 'competition',
    label: 'Competitive Pressure',
    description: 'Alternative treatment mentions',
    icon: Users,
  },
];

export default function PerceptionMetrics({ selectedMetric, onSelectMetric }: PerceptionMetricsProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-400 mb-3">PERCEPTION METRICS</h3>
        <div className="space-y-1">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const isSelected = selectedMetric === metric.id;
            
            return (
              <button
                key={metric.id}
                onClick={() => onSelectMetric(metric.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
                      {metric.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {metric.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
