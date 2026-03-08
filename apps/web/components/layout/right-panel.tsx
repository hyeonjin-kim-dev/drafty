const PLACEHOLDER_FIELDS = [
  { label: '제목', width: 'w-3/4' },
  { label: '타입', width: 'w-1/2' },
  { label: '생성일', width: 'w-2/3' },
  { label: '태그', width: 'w-1/3' },
];

export function RightPanel() {
  return (
    <aside className="flex flex-1 min-w-0 flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center h-12 px-4 border-b border-gray-200">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          선택된 항목
        </span>
      </div>

      {/* 빈 상태 안내 */}
      <div className="flex flex-col items-center justify-center gap-3 flex-1 px-4 text-center">
        <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
              x="3"
              y="3"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="13"
              y="3"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="3"
              y="13"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="13"
              y="13"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          노드를 선택하면
          <br />
          상세 정보가 여기에 표시됩니다
        </p>
      </div>

      {/* 속성 필드 skeleton placeholder */}
      <div className="px-4 py-4 border-t border-gray-200 flex flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">속성</p>
        {PLACEHOLDER_FIELDS.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-300 font-medium">{field.label}</span>
            <div className={`h-5 rounded bg-gray-200 ${field.width}`} aria-hidden="true" />
          </div>
        ))}
      </div>
    </aside>
  );
}
