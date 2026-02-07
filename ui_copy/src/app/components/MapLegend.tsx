export default function MapLegend() {
  return (
    <div className="bg-[#0d1420]/95 backdrop-blur-sm border border-[#2a3544] rounded px-2 py-1.5 shadow-lg">
      <div className="text-[8px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">Heat Scale</div>
      <div className="flex items-center gap-1">
        <div className="flex h-1.5 rounded overflow-hidden" style={{ width: '60px' }}>
          <div className="flex-1" style={{ backgroundColor: '#ef4444' }} />
          <div className="flex-1" style={{ backgroundColor: '#f97316' }} />
          <div className="flex-1" style={{ backgroundColor: '#f59e0b' }} />
          <div className="flex-1" style={{ backgroundColor: '#14b8a6' }} />
          <div className="flex-1" style={{ backgroundColor: '#0ea5e9' }} />
        </div>
      </div>
      <div className="flex justify-between mt-0.5 text-[7px] text-gray-500" style={{ width: '60px' }}>
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}