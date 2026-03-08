export type MockBoard = {
  id: string;
  name: string;
  emoji: string;
};

export const mockBoards: MockBoard[] = [
  { id: 'inbox', name: 'Inbox', emoji: '📥' },
  { id: 'product-ideas', name: 'Product Ideas', emoji: '💡' },
  { id: 'research', name: 'Research', emoji: '🔬' },
  { id: 'writing', name: 'Writing', emoji: '✍️' },
];

export const DEFAULT_BOARD_ID = 'product-ideas';
