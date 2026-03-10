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
  content: string;
  style?: {
    backgroundColor?: string; // 다음 브랜치 색상 커스터마이즈 대비
  };
};
