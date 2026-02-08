import { motion } from 'framer-motion';

interface HoverCardProps {
    countryName: string;
    metricName: string;
    metricValue: number;
    x: number;
    y: number;
}

export default function HoverCard({ countryName, metricName, metricValue, x, y }: HoverCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none"
            style={{
                left: x + 20,
                top: y + 20,
            }}
        >
            <div className="bg-[#0d1420]/80 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold text-sm tracking-wide">{countryName}</h4>
                    {/* Flag could be added here if we had mapping */}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{metricName}</span>
                    <span className={`text-sm font-bold ${metricValue > 0.7 ? 'text-green-400' : metricValue < 0.4 ? 'text-red-400' : 'text-blue-400'}`}>
                        {Math.round(metricValue * 100)}%
                    </span>
                </div>

                <div className="w-full bg-gray-700/50 h-1 mt-2 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${metricValue > 0.7 ? 'bg-green-500' : metricValue < 0.4 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${metricValue * 100}%` }}
                    />
                </div>

                <div className="mt-2 text-[10px] text-gray-500 italic">
                    Click for details
                </div>
            </div>
        </motion.div>
    );
}
