import { AppShell } from '@/components/layout/app-shell';

export default function HomePage() {
  return (
    <AppShell>
      <BoardCanvas />
    </AppShell>
  );
}

function BoardCanvas() {
  return (
    <div
      className="relative flex flex-col h-full w-full overflow-hidden bg-white"
      style={{
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* 중앙 안내 텍스트 — 추후 실제 노드로 교체됨 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 select-none pointer-events-none">
        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-2xl">
          🗂️
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">캔버스 영역</p>
          <p className="text-xs text-gray-400 mt-0.5">
            다음 브랜치에서 React Flow 캔버스가 여기에 들어옵니다
          </p>
        </div>

        {/* 더미 노드 mock — 실제 앱처럼 보이게 */}
        <div className="mt-6 flex gap-3 pointer-events-auto">
          <div className="w-40 rounded-lg border border-gray-200 bg-white shadow-sm p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">💡 아이디어 노트</p>
            <p className="text-xs text-gray-400 leading-relaxed">여기에 메모 내용이 표시됩니다</p>
          </div>
          <div className="w-40 rounded-lg border border-gray-200 bg-white shadow-sm p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">📎 참고 자료</p>
            <p className="text-xs text-gray-400 leading-relaxed">이미지, 파일, 링크가 연결됩니다</p>
          </div>
          <div className="w-40 rounded-lg border border-blue-100 bg-blue-50 shadow-sm p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">✦ AI 요약</p>
            <p className="text-xs text-blue-400 leading-relaxed">AI가 정리한 내용이 들어옵니다</p>
          </div>
        </div>
      </div>

      {/* 하단 줌 컨트롤 placeholder */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-1.5">
        <button
          disabled
          aria-label="축소"
          className="w-6 h-6 flex items-center justify-center text-gray-400 text-sm cursor-not-allowed hover:bg-gray-100 rounded transition-colors"
        >
          −
        </button>
        <span className="text-xs text-gray-400 font-medium w-10 text-center">100%</span>
        <button
          disabled
          aria-label="확대"
          className="w-6 h-6 flex items-center justify-center text-gray-400 text-sm cursor-not-allowed hover:bg-gray-100 rounded transition-colors"
        >
          ＋
        </button>
      </div>
    </div>
  );
}
