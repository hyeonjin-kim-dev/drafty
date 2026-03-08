import type { NodeType } from '@drafty/shared-types';

const plannedNodeTypes: NodeType[] = ['note', 'image', 'file', 'board_link'];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Drafty</h1>
        <p className="text-base text-slate-300">
          현재 프로젝트는 모노레포 및 개발환경 초기 구성을 진행한 상태입니다.
        </p>
        <p className="text-base text-slate-300">
          이번 브랜치에서는 제품 기능 대신 실행 가능한 기본 웹앱 골격에 집중했습니다.
        </p>
        <p className="text-sm text-slate-400">초기 예정 노드 타입: {plannedNodeTypes.join(', ')}</p>
      </section>
    </main>
  );
}
