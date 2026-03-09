'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { BoardCanvas } from '@/components/canvas/board-canvas';
import { mockBoards, DEFAULT_BOARD_ID } from '@/data/mock-boards';

export default function HomePage() {
  const [selectedBoardId, setSelectedBoardId] = useState(DEFAULT_BOARD_ID);
  const selectedBoard = mockBoards.find((b) => b.id === selectedBoardId) ?? mockBoards[0];

  return (
    <AppShell
      boards={mockBoards}
      selectedBoardId={selectedBoardId}
      onSelectBoard={setSelectedBoardId}
      boardName={`${selectedBoard.emoji} ${selectedBoard.name}`}
    >
      <BoardCanvas board={selectedBoard} />
    </AppShell>
  );
}
