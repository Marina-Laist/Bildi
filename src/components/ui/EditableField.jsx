export function EditableField({ label, value, onChange, editing, type = 'text', icon: Icon, textarea = false }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={14} className="text-slate-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        {editing ? (
          textarea ? (
            <textarea
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              rows={3}
              className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          ) : (
            <input
              type={type}
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )
        ) : (
          <p className="text-sm font-medium text-slate-700 break-words">{value || <span className="text-slate-300 italic">Sin datos</span>}</p>
        )}
      </div>
    </div>
  )
}
