'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type OnSelectionChangeParams,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import type { MockBoard } from '@/data/mock-boards';
import { getBoardCanvasSnapshot } from '@/data/mock-board-canvas';
import { CanvasEmptyState } from '@/components/canvas/canvas-empty-state';

// 선택 상태 구조 — 아직 실제 선택 UI는 없지만 다음 브랜치에서 사용
type CanvasSelection = {
  nodeIds: string[];
  edgeIds: string[];
};

// 확장 포인트: 추후 커스텀 노드/엣지 타입을 여기에 등록
const nodeTypes: NodeTypes = {};
const edgeTypes: EdgeTypes = {};

type BoardCanvasProps = {
  board: MockBoard;
};

export function BoardCanvas({ board }: BoardCanvasProps) {
  const snapshot = getBoardCanvasSnapshot(board.id);

  const [nodes, setNodes, onNodesChange] = useNodesState(snapshot.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(snapshot.initialEdges);
  const [selection, setSelection] = useState<CanvasSelection>({
    nodeIds: [],
    edgeIds: [],
  });

  // 보드 전환 시 캔버스 상태 초기화
  useEffect(() => {
    const next = getBoardCanvasSnapshot(board.id);
    setNodes(next.initialNodes);
    setEdges(next.initialEdges);
    setSelection({ nodeIds: [], edgeIds: [] });
  }, [board.id, setNodes, setEdges]);

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelection({
      nodeIds: params.nodes.map((n) => n.id),
      edgeIds: params.edges.map((e) => e.id),
    });
  }, []);

  // 향후 우측 패널 연동 등에서 selection을 활용할 수 있도록 _ prefix 없이 유지
  void selection;

  const defaultViewport = useMemo(() => snapshot.defaultViewport, [snapshot.defaultViewport]);

  return (
    <div className="relative h-full w-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        minZoom={0.1}
        maxZoom={4}
        panOnDrag
        zoomOnScroll
        selectionOnDrag={false}
        connectOnClick={false}
        deleteKeyCode={null}
        multiSelectionKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#d1d5db" />
      </ReactFlow>

      {/* 빈 캔버스 안내 — 노드가 없을 때만 표시 */}
      {nodes.length === 0 && <CanvasEmptyState emoji={board.emoji} boardName={board.name} />}
    </div>
  );
}
