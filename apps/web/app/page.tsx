'use client';

import { useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { BoardCanvas } from '@/components/canvas/board-canvas';
import { mockBoards, DEFAULT_BOARD_ID } from '@/data/mock-boards';
import { mockInboxNotes } from '@/data/mock-inbox-notes';
import type { InboxNote } from '@drafty/shared-types';

export default function HomePage() {
  const [selectedBoardId, setSelectedBoardId] = useState(DEFAULT_BOARD_ID);
  const selectedBoard = mockBoards.find((b) => b.id === selectedBoardId) ?? mockBoards[0];

  const [inboxNotes, setInboxNotes] = useState<InboxNote[]>(mockInboxNotes);
  const [pendingInboxNotes, setPendingInboxNotes] = useState<InboxNote[]>([]);

  // "캔버스에 추가" 클릭: 목록에서 즉시 제거(optimistic) + 대기 큐에 추가
  const handleAddToCanvas = useCallback((id: string) => {
    setInboxNotes((prev) => {
      const note = prev.find((n) => n.id === id);
      if (!note) return prev;
      setPendingInboxNotes((q) => [...q, note]);
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  // 캔버스에서 노드 생성 완료 후 대기 큐에서 제거
  const handleInboxNoteAdded = useCallback((id: string) => {
    setPendingInboxNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <AppShell
      boards={mockBoards}
      selectedBoardId={selectedBoardId}
      onSelectBoard={setSelectedBoardId}
      boardName={`${selectedBoard.emoji} ${selectedBoard.name}`}
      inboxNotes={inboxNotes}
      onAddToCanvas={handleAddToCanvas}
    >
      <BoardCanvas
        board={selectedBoard}
        pendingInboxNotes={pendingInboxNotes}
        onInboxNoteAdded={handleInboxNoteAdded}
      />
    </AppShell>
  );
}
