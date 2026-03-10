import type { Node, Edge, Viewport } from '@xyflow/react';
import type { NoteNodeData } from '@drafty/shared-types';

type NoteNode = Node<NoteNodeData, 'note'>;

type BoardCanvasSnapshot = {
  initialNodes: Node[];
  initialEdges: Edge[];
  defaultViewport: Viewport;
};

const EMPTY_SNAPSHOT: BoardCanvasSnapshot = {
  initialNodes: [],
  initialEdges: [],
  defaultViewport: { x: 0, y: 0, zoom: 1 },
};

const productIdeasNodes: NoteNode[] = [
  {
    id: 'note-1',
    type: 'note',
    position: { x: 80, y: 100 },
    data: { markdown: '# 첫 번째 아이디어\n\n사용자가 메모를 빠르게 캡처할 수 있는 기능' },
    style: { width: 180, height: 130 },
  },
  {
    id: 'note-2',
    type: 'note',
    position: { x: 320, y: 60 },
    data: { markdown: '# 두 번째 아이디어\n\n**태그 시스템**으로 메모를 분류' },
    style: { width: 180, height: 130 },
  },
  {
    id: 'note-3',
    type: 'note',
    position: { x: 190, y: 280 },
    data: { markdown: '# 세 번째 아이디어\n\nAI 요약으로 긴 메모를 한 줄로 압축' },
    style: { width: 180, height: 130 },
  },
];

// 보드 ID → 캔버스 초기 상태 맵핑
const snapshotMap: Record<string, BoardCanvasSnapshot> = {
  'product-ideas': {
    initialNodes: productIdeasNodes,
    initialEdges: [],
    defaultViewport: { x: 0, y: 0, zoom: 1 },
  },
};

export function getBoardCanvasSnapshot(boardId: string): BoardCanvasSnapshot {
  return snapshotMap[boardId] ?? EMPTY_SNAPSHOT;
}
