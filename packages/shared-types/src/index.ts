export type EntityId = string;
export type TimestampISO = string;

export type NodeType =
  | 'note'
  | 'image'
  | 'file'
  | 'board_link'
  | 'document'
  | 'calendar'
  | 'ai_summary';

export type NoteNodeData = {
  markdown: string; // raw markdown; source of truth
  title?: string; // 명시적 제목; 없으면 markdown 첫 줄에서 fallback
  style?: {
    backgroundColor?: string; // 다음 브랜치 색상 커스터마이즈 대비
  };
};

// CLI/inbox 임시 메모 — 프레임워크 비종속 도메인 타입
export type InboxNote = {
  id: EntityId;
  markdown: string;
  title?: string;
  createdAt: TimestampISO;
};
