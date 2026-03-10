import type { InboxNote } from '@drafty/shared-types';

export const mockInboxNotes: InboxNote[] = [
  {
    id: 'inbox-1',
    markdown: '장보기 목록\n\n- 우유\n- 계란\n- 빵',
    createdAt: '2026-03-11T08:12:00.000Z',
  },
  {
    id: 'inbox-2',
    markdown: '팀 미팅 전 확인할 것',
    createdAt: '2026-03-11T09:30:00.000Z',
  },
  {
    id: 'inbox-3',
    title: 'Drafty 캡처 기능 아이디어',
    markdown:
      '# Drafty 캡처 기능 아이디어\n\n## 문제\n\n현재 메모를 빠르게 capture할 방법이 없다.\n\n## 해결책 후보\n\n1. **글로벌 단축키** — 어떤 앱에서도 즉시 열기\n2. **CLI 명령어** — `drafty add "메모 내용"` 형식\n3. **브라우저 익스텐션** — 웹 페이지 하이라이트 캡처\n\n가장 빠른 MVP는 CLI부터 시작하는 것이 좋아 보인다.',
    createdAt: '2026-03-10T14:22:00.000Z',
  },
  {
    id: 'inbox-4',
    title: '리서치 노트: Markdown 파싱 전략',
    markdown:
      '# 리서치 노트: Markdown 파싱 전략\n\n외부 라이브러리 없이 정규식으로 처리 가능한 범위:\n\n- `#` heading 제거\n- `**bold**`, `*italic*` 제거\n- `` `code` `` 제거\n- `[text](url)` → text만 추출\n- `- ` 리스트 마커 제거\n\n충분히 미리보기 용도로 사용 가능하다.',
    createdAt: '2026-03-10T16:45:00.000Z',
  },
  {
    id: 'inbox-5',
    markdown:
      '## 온보딩 플로우 개선\n\n신규 사용자가 처음 접속했을 때 빈 캔버스만 보이면 당황할 수 있다. 기본 메모 몇 개를 미리 채워두거나, 튜토리얼 모달을 보여주는 방안을 검토해보자.',
    createdAt: '2026-03-09T11:00:00.000Z',
  },
];
