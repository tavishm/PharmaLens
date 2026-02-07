export function ContextPanel() {
  return (
    <div className="space-y-8">
      {/* Methodology */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Methodology
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Composite perception index derived from multi-channel sentiment analysis across digital health communities, news coverage, and social platforms.
        </p>
      </div>

      {/* Index Scale */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Index Scale
        </h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: '#ff9147' }} />
            <span className="text-[11px] text-gray-500">8.5+ Market Leader</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: '#ff6b2d' }} />
            <span className="text-[11px] text-gray-500">7.0-8.4 Above Avg</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: '#d63a20' }} />
            <span className="text-[11px] text-gray-500">5.5-6.9 Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: '#a52219' }} />
            <span className="text-[11px] text-gray-500">4.0-5.4 Below</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: '#6d1412' }} />
            <span className="text-[11px] text-gray-500">&lt;4.0 Risk</span>
          </div>
        </div>
      </div>

      {/* Coverage */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Coverage
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          32 markets representing 68% of global pharmaceutical revenue.
        </p>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Sub-national data available for US, India, China.
        </p>
      </div>

      {/* Signal Sources */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
          Signal Sources
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">Patient Communities</span>
            <span className="text-[11px] text-gray-600 font-mono">32%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">Social Media</span>
            <span className="text-[11px] text-gray-600 font-mono">28%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">News & Media</span>
            <span className="text-[11px] text-gray-600 font-mono">24%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">Clinical Forums</span>
            <span className="text-[11px] text-gray-600 font-mono">16%</span>
          </div>
        </div>
      </div>

      {/* Data Freshness */}
      <div className="pt-6 border-t border-gray-800/30">
        <p className="text-[10px] text-gray-600 leading-relaxed">
          Updated continuously<br />
          Last refresh: 2 hours ago
        </p>
      </div>
    </div>
  );
}
