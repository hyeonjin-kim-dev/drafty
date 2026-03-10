import { NodeResizer, type Node, type NodeProps } from '@xyflow/react';
import type { NoteNodeData } from '@drafty/shared-types';

// React Flow 의존 타입은 이 파일 내부에서만 정의 (shared-types는 프레임워크 비종속 유지)
export type NoteNodeType = Node<NoteNodeData, 'note'>;

export function NoteNode({ data, selected }: NodeProps<NoteNodeType>) {
  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={80}
        lineStyle={{ border: '1px solid rgba(59,130,246,0.4)' }}
        handleStyle={{
          width: 6,
          height: 6,
          borderRadius: 1,
          backgroundColor: '#3b82f6',
          border: '1px solid #fff',
        }}
      />
      <div
        className={[
          'w-full h-full bg-white rounded-none',
          'shadow-[0_1px_4px_rgba(0,0,0,0.07)]',
          'p-3 text-sm text-gray-800 whitespace-pre-wrap break-words',
          selected ? 'ring-1 ring-inset ring-blue-500/50' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {data.content}
      </div>
    </>
  );
}
