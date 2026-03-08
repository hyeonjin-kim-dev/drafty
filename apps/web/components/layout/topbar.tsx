type TopbarProps = {
  boardName: string;
};

export function Topbar({ boardName }: TopbarProps) {
  return (
    <header className="flex items-center h-12 px-4 border-b border-gray-200 bg-white shrink-0">
      {/* 좌측 — 현재 보드 제목 */}
      <h1 className="text-sm font-semibold text-gray-900 min-w-0 truncate">{boardName}</h1>

      {/* 우측 — 검색 + AI Organize + 사용자 아바타 (ml-auto로 우측 고정) */}
      <div className="ml-auto shrink-0 flex items-center gap-2">
        {/* 검색창 placeholder */}
        <div className="relative">
          <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-gray-400">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M10.5 10.5L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            disabled
            placeholder="검색..."
            aria-label="보드 내 검색 (준비 중)"
            className="w-36 pl-8 pr-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-md text-gray-400 placeholder:text-gray-400 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* AI Organize 버튼 placeholder */}
        <button
          disabled
          aria-label="AI Organize (준비 중)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-400 bg-white cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <span aria-hidden="true">✦</span>
          <span>AI Organize</span>
        </button>

        {/* 사용자 아바타 placeholder */}
        <button
          disabled
          aria-label="사용자 메뉴 (준비 중)"
          className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold flex items-center justify-center cursor-not-allowed"
        >
          U
        </button>
      </div>
    </header>
  );
}
