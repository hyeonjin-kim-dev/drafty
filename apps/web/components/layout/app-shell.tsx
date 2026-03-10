'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { RightPanel } from '@/components/layout/right-panel';
import type { MockBoard } from '@/data/mock-boards';
import type { InboxNote } from '@drafty/shared-types';

// 좌/우 패널 최소·최대 폭 (px)
const LEFT_MIN = 180;
const LEFT_MAX = 720;
const RIGHT_MIN = 220;
const RIGHT_MAX = 840;

type AppShellProps = {
  children: ReactNode;
  boards: MockBoard[];
  selectedBoardId: string;
  onSelectBoard: (id: string) => void;
  boardName: string;
  inboxNotes: InboxNote[];
  onAddToCanvas: (id: string) => void;
};

export function AppShell({
  children,
  boards,
  selectedBoardId,
  onSelectBoard,
  boardName,
  inboxNotes,
  onAddToCanvas,
}: AppShellProps) {
  const [leftWidth, setLeftWidth] = useState(224);
  const [rightWidth, setRightWidth] = useState(288);

  // 좌측 패널 드래그 리사이즈 시작
  function startLeftResize(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    const onMove = (ev: PointerEvent) => {
      setLeftWidth(Math.max(LEFT_MIN, Math.min(LEFT_MAX, startWidth + ev.clientX - startX)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  // 우측 패널 드래그 리사이즈 시작 (왼쪽으로 드래그 = 패널 확장)
  function startRightResize(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;
    const onMove = (ev: PointerEvent) => {
      setRightWidth(Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, startWidth + startX - ev.clientX)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white select-none">
      {/* 좌측: 사이드바 + 리사이즈 핸들 */}
      <div className="hidden md:flex shrink-0" style={{ width: leftWidth }}>
        <Sidebar boards={boards} selectedBoardId={selectedBoardId} onSelectBoard={onSelectBoard} />
        {/* 좌측 리사이즈 핸들 — 시각적으로 1px 선, grab 영역은 12px */}
        <div
          className="relative w-3 shrink-0 cursor-col-resize group bg-gradient-to-r from-gray-50 to-white"
          role="separator"
          aria-orientation="vertical"
          aria-label="왼쪽 패널 크기 조절"
          onPointerDown={startLeftResize}
        >
          <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gray-200 group-hover:bg-blue-400 transition-colors" />
        </div>
      </div>

      {/* 우측: 툴바 + (메인 캔버스 + 우측 패널) */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar boardName={boardName} />
        <div className="flex flex-1 min-h-0">
          {/* 중앙 메인 — 추후 React Flow 캔버스가 들어갈 자리 */}
          <main className="flex-1 min-w-0 min-h-0 overflow-hidden">{children}</main>

          {/* 우측: 리사이즈 핸들 + 패널 */}
          <div className="hidden lg:flex shrink-0" style={{ width: rightWidth }}>
            {/* 우측 리사이즈 핸들 — 시각적으로 1px 선, grab 영역은 12px */}
            <div
              className="relative w-3 shrink-0 cursor-col-resize group bg-gradient-to-r from-white to-gray-50"
              role="separator"
              aria-orientation="vertical"
              aria-label="오른쪽 패널 크기 조절"
              onPointerDown={startRightResize}
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gray-200 group-hover:bg-blue-400 transition-colors" />
            </div>
            <RightPanel inboxNotes={inboxNotes} onAddToCanvas={onAddToCanvas} />
          </div>
        </div>
      </div>
    </div>
  );
}
