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
  type ReactFlowInstance,
  type Node,
} from '@xyflow/react';
import type { MockBoard } from '@/data/mock-boards';
import { getBoardCanvasSnapshot } from '@/data/mock-board-canvas';
import { CanvasEmptyState } from '@/components/canvas/canvas-empty-state';
import { NoteNode } from '@/components/canvas/note-node';
import type { NoteNodeData, InboxNote } from '@drafty/shared-types';

// 선택 상태 구조 — 아직 실제 선택 UI는 없지만 다음 브랜치에서 사용
type CanvasSelection = {
  nodeIds: string[];
  edgeIds: string[];
};

// 컴포넌트 외부 모듈 상수로 선언 — 내부 선언 시 렌더마다 새 객체 생성 → React Flow 노드 리마운트 발생
const nodeTypes: NodeTypes = {
  note: NoteNode,
};
const edgeTypes: EdgeTypes = {};

type BoardCanvasProps = {
  board: MockBoard;
  pendingInboxNotes: InboxNote[]; // inbox → canvas 대기 큐
  onInboxNoteAdded: (id: string) => void; // 소비 완료 콜백
};

export function BoardCanvas({ board, pendingInboxNotes, onInboxNoteAdded }: BoardCanvasProps) {
  const snapshot = getBoardCanvasSnapshot(board.id);

  const [nodes, setNodes, onNodesChange] = useNodesState(snapshot.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(snapshot.initialEdges);
  const [selection, setSelection] = useState<CanvasSelection>({
    nodeIds: [],
    edgeIds: [],
  });
  // ReactFlow 인스턴스 캡처 — useReactFlow()는 Provider 컨텍스트 내부에서만 호출 가능하므로 onInit 패턴 사용
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

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

  // pendingInboxNotes 큐 순차 소비 — inbox에서 캔버스로 추가된 노드 처리
  useEffect(() => {
    if (pendingInboxNotes.length === 0 || !rfInstance) return;

    const note = pendingInboxNotes[0];
    const center = rfInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    // 여러 개가 동시에 추가될 때 겹침 방지용 오프셋
    const offset = (pendingInboxNotes.length - 1) * 20;

    const newNode: Node<NoteNodeData, 'note'> = {
      id: `note-${Date.now()}`,
      type: 'note',
      position: { x: center.x + offset, y: center.y + offset },
      data: { markdown: note.markdown, title: note.title },
      style: { width: 200, height: 140 },
    };

    setNodes((prev) => [...prev, newNode]);
    onInboxNoteAdded(note.id);
  }, [pendingInboxNotes, rfInstance, setNodes, onInboxNoteAdded]);

  // 빈 캔버스 더블클릭 시 NoteNode 생성 — 노드 위 더블클릭 버블링 차단을 위해 pane 클래스 검사
  const onPaneDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as Element;
      if (!target.classList.contains('react-flow__pane')) return;
      if (!rfInstance) return;

      const position = rfInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const newNode: Node<NoteNodeData, 'note'> = {
        id: `note-${Date.now()}`,
        type: 'note',
        position,
        data: { markdown: '' },
        style: { width: 180, height: 130 },
      };
      setNodes((prev) => [...prev, newNode]);
    },
    [rfInstance, setNodes],
  );

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
        onInit={setRfInstance}
        onDoubleClick={onPaneDoubleClick}
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
