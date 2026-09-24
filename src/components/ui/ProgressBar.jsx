export function ProgressBar({ value = 0, max = 100, label, color = 'blue', showPercent = true, size = 'sm', className = '' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  }

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-5',
    xl: 'h-8',
  }

  const textColors = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
    purple: 'text-purple-700',
  }

  if (size === 'xl') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex justify-between items-end mb-2">
          {label && <span className="text-base font-semibold text-slate-700">{label}</span>}
          <span className={`text-4xl font-bold ${textColors[color]}`}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
          <div
            className={`h-8 rounded-full transition-all duration-700 flex items-center justify-end pr-3 ${colors[color]}`}
            style={{ width: `${pct}%` }}
          >
            {pct > 15 && (
              <span className="text-white text-sm font-bold">{pct}%</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (size === 'lg') {
    return (
      <div className={`w-full ${className}`}>
        {(label || showPercent) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
            {showPercent && <span className={`text-lg font-bold ${textColors[color]}`}>{pct}%</span>}
          </div>
        )}
        <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden">
          <div
            className={`h-5 rounded-full transition-all duration-700 ${colors[color]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-slate-600">{label}</span>}
          {showPercent && <span className="text-sm font-medium text-slate-700">{pct}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full ${heights[size] || heights.sm}`}>
        <div
          className={`${heights[size] || heights.sm} rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
