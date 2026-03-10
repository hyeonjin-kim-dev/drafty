'use client';

import type { InboxNote } from '@drafty/shared-types';
import { extractTitle, stripMarkdown } from '@/lib/markdown-preview';

type RightPanelProps = {
  inboxNotes: InboxNote[];
  onAddToCanvas: (id: string) => void;
};

export function RightPanel({ inboxNotes, onAddToCanvas }: RightPanelProps) {
  return (
    <aside className="flex flex-1 min-w-0 flex-col bg-gray-50 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center h-12 px-4 border-b border-gray-200 shrink-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Inbox</span>
        {inboxNotes.length > 0 && (
          <span className="ml-2 text-[10px] font-medium text-gray-400 bg-gray-200 rounded-full px-1.5 py-0.5 leading-none">
            {inboxNotes.length}
          </span>
        )}
      </div>

      {/* 카드 목록 / 빈 상태 */}
      {inboxNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 flex-1 px-4 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">아직 Inbox에 메모가 없습니다</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-0">
          {inboxNotes.map((note) => (
            <li key={note.id}>
              <InboxNoteCard note={note} onAddToCanvas={onAddToCanvas} />
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

// ---- 파일 내 로컬 컴포넌트 ----

type InboxNoteCardProps = {
  note: InboxNote;
  onAddToCanvas: (id: string) => void;
};

function InboxNoteCard({ note, onAddToCanvas }: InboxNoteCardProps) {
  const title = extractTitle(note.markdown, note.title);
  const preview = stripMarkdown(note.markdown, 60);

  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-3 flex flex-col gap-1.5 hover:border-gray-300 transition-colors">
      <p className="text-sm font-semibold text-gray-800 truncate leading-snug">{title}</p>
      {preview && (
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed break-words">{preview}</p>
      )}
      <div className="flex items-center justify-between mt-1">
        <time className="text-[10px] text-gray-300">{formatCapturedAt(note.createdAt)}</time>
        <button
          type="button"
          onClick={() => onAddToCanvas(note.id)}
          className="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          {/* 캔버스에 추가 아이콘 (인라인 SVG) */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          캔버스에 추가
        </button>
      </div>
    </div>
  );
}

// ---- 파일 내 로컬 헬퍼 ----

function formatCapturedAt(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}
