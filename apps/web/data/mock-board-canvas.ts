import type { Node, Edge, Viewport } from '@xyflow/react';

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

// 보드 ID → 캔버스 초기 상태 맵핑
// 현재는 모든 보드가 빈 캔버스. 추후 보드별 저장 데이터로 교체 예정.
const snapshotMap: Record<string, BoardCanvasSnapshot> = {};

export function getBoardCanvasSnapshot(boardId: string): BoardCanvasSnapshot {
  return snapshotMap[boardId] ?? EMPTY_SNAPSHOT;
}
