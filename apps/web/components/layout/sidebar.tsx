'use client';

import type { MockBoard } from '@/data/mock-boards';

type SidebarProps = {
  boards: MockBoard[];
  selectedBoardId: string;
  onSelectBoard: (id: string) => void;
};

export function Sidebar({ boards, selectedBoardId, onSelectBoard }: SidebarProps) {
  return (
    <aside className="flex flex-1 min-w-0 flex-col bg-gray-50">
      {/* 로고 영역 */}
      <div className="flex items-center gap-1.5 px-4 h-12 border-b border-gray-200">
        <span className="text-sm font-bold tracking-tight text-gray-900">Drafty</span>
        <span className="text-xs text-gray-400 font-medium">beta</span>
      </div>

      {/* 보드 목록 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-2 py-2 gap-0.5">
        <p className="px-2 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Boards
        </p>

        {boards.map((board) => {
          const isSelected = board.id === selectedBoardId;
          return (
            <button
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              aria-current={isSelected ? 'page' : undefined}
              className={[
                'flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                isSelected
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100',
              ].join(' ')}
            >
              <span className="text-base leading-none">{board.emoji}</span>
              <span className="truncate">{board.name}</span>
            </button>
          );
        })}
      </div>

      {/* 하단 — New Board 버튼 */}
      <div className="px-2 py-2 border-t border-gray-200">
        <button
          disabled
          aria-label="새 보드 만들기 (준비 중)"
          className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm text-gray-400 cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          <span className="text-base leading-none">＋</span>
          <span>New Board</span>
        </button>
      </div>
    </aside>
  );
}
