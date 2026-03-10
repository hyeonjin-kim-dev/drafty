type CanvasEmptyStateProps = {
  emoji: string;
  boardName: string;
};

export function CanvasEmptyState({ emoji, boardName }: CanvasEmptyStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <div className="flex flex-col items-center gap-2.5 px-6 py-5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
        <span className="text-2xl leading-none" aria-hidden="true">
          {emoji}
        </span>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">{boardName}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Inbox 패널에서 메모를 추가하거나 캔버스를 더블클릭해 시작하세요
          </p>
        </div>
      </div>
    </div>
  );
}
