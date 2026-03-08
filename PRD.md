---

# Drafty PRD

**Version:** 0.1
**Product Name:** Drafty
**Author:** OpenAI
**Status:** Draft
**Target Release:** MVP v1

---

# 1. 제품 개요

## 1.1 제품 정의

**Drafty**는 사용자가 생각, 자료, 이미지, 파일, 일정, 문서를 **무한 확장 캔버스(board)** 위에 자유롭게 쌓고 연결할 수 있는 개인용 메모/정리 웹앱이다.

사용자는 메모를 구조 없이 빠르게 던져 넣을 수 있고, 이후 AI가 현재 워크스페이스 맥락을 파악해 노트를 **분류, 그룹화, 요약, 정리 제안**한다.
또한 사용자는 웹 UI뿐 아니라 **CLI**를 통해 터미널에서 바로 메모를 추가할 수 있다.

Drafty는 초기 버전에서 **개인 중심 동기화**에 집중하며, **다중 사용자 실시간 공동 편집은 지원하지 않는다.**

---

# 2. 문제 정의

## 2.1 사용자 문제

기존 메모 앱은 다음 중 하나에 치우쳐 있다.

- 빠른 캡처는 되지만 시각적 구조화가 어렵다
- 시각적 보드는 좋지만 메모 입력이 번거롭다
- AI 요약은 있어도 워크스페이스 맥락 기반 정리가 약하다
- 터미널에서 빠르게 기록하는 흐름을 지원하지 않는다

사용자는 실제로 다음과 같은 니즈를 가진다.

- “일단 생각나는 대로 막 적고 싶다”
- “나중에 정리하고 싶다”
- “시각적으로 배치하고 연결하고 싶다”
- “메모, 이미지, 파일, 일정, 문서를 한 공간에서 다루고 싶다”
- “터미널에서도 바로 기록하고 싶다”
- “내 계정으로 여러 기기에서 이어서 보고 싶다”

## 2.2 제품이 해결할 핵심

Drafty는 아래 두 가지를 동시에 제공한다.

1. **자유로운 수집**
    - 무한 캔버스
    - 빠른 메모
    - 파일/이미지/문서 첨부
    - CLI 입력

2. **지능형 정리**
    - AI 기반 분류
    - 관련 노트 묶기
    - 보드 구조화 제안
    - 제목/태그/요약/링크 추천

---

# 3. 목표와 비목표

## 3.1 목표

MVP 기준 목표는 다음과 같다.

- 사용자가 보드 위에 자유롭게 노드를 배치할 수 있다
- 메모, 이미지, 파일, 문서, 일정, 보드 링크 노드를 지원한다
- 노드 간 화살표 연결이 가능하다
- 계정 기반 저장 및 동기화가 된다
- CLI로 메모를 보드 또는 inbox에 저장할 수 있다
- AI가 현재 보드/워크스페이스를 바탕으로 정리 제안을 생성한다
- 사용자는 AI 제안을 검토 후 적용할 수 있다

## 3.2 비목표

MVP에서 하지 않는 것

- 다중 사용자 공동 편집
- 실시간 협업 커서/동시 편집
- 오프라인 우선 아키텍처
- 복잡한 팀/권한 관리
- 완전한 문서 협업 시스템
- 외부 캘린더 양방향 동기화
- 고급 화이트보드 드로잉 기능
- 모바일 네이티브 앱

---

# 4. 타겟 사용자

## 4.1 주요 사용자군

### 1) 개인 창작자 / 기획자

- 아이디어를 빠르게 모으고 싶음
- 이미지, 링크, 문서, 메모를 한 공간에 쌓고 싶음
- 정리는 나중에 하고 싶음

### 2) 개발자 / PM / 디자이너

- 프로젝트 아이디어, 작업 항목, 참고자료를 함께 놓고 정리하고 싶음
- CLI에서 바로 메모하고 싶음
- AI로 임시 메모를 구조화하고 싶음

### 3) 연구형 사용자

- 자료 수집량이 많음
- 문서, 스크랩, 간단한 해석 메모를 함께 다룸
- 연결 구조와 시각적 배치가 중요함

---

# 5. 핵심 사용자 시나리오

## 5.1 시나리오 A: 자유 메모 후 AI 정리

1. 사용자가 보드에 생각나는 메모를 여러 개 빠르게 생성한다
2. 이미지와 PDF를 몇 개 첨부한다
3. 관계 있는 항목끼리 일부만 화살표로 연결한다
4. “AI 정리”를 실행한다
5. AI가 그룹, 제목, 태그, 추천 링크, 배치 제안을 보여준다
6. 사용자가 제안을 일부 적용한다

## 5.2 시나리오 B: CLI inbox 캡처

1. 사용자가 터미널에서 `drafty memo "랜딩 카피 수정 아이디어"`를 입력한다
2. 메모는 inbox board에 저장된다
3. 나중에 웹에서 inbox를 열어 메모를 본다
4. “AI로 정리”를 실행한다
5. AI가 기존 보드와의 관련성을 찾아 적절한 보드 이동 또는 새 그룹 생성을 제안한다

## 5.3 시나리오 C: 보드 간 탐색

1. 사용자가 “제품 전략” 보드에서 정리 중이다
2. 세부 실행 항목은 “실행 backlog” 보드로 분리하고 싶다
3. 보드 링크 노드를 생성한다
4. 링크 노드를 클릭하면 대상 보드로 이동한다

---

# 6. 제품 원칙

## 6.1 속도 우선

입력과 배치는 즉각적이어야 한다.
사용자는 “정리”보다 “생각 캡처”를 먼저 할 수 있어야 한다.

## 6.2 구조는 나중에

초기 입력 시 사용자가 구조를 강요받지 않아야 한다.

## 6.3 AI는 제안자

AI는 자동 파괴적으로 바꾸지 않는다.
항상 **제안 → 검토 → 적용** 흐름을 따른다.

## 6.4 개인용 동기화 중심

협업 대신, 개인의 여러 기기 사용성을 우선한다.

## 6.5 단순한 모델

보드, 노드, 엣지라는 간단한 추상화 위에 기능을 쌓는다.

---

# 7. 핵심 기능 요구사항

---

## 7.1 인증 및 계정

### 설명

사용자는 계정을 생성하고 로그인하여 자신의 보드와 데이터를 동기화할 수 있어야 한다.

### 요구사항

- 이메일 기반 회원가입/로그인 지원
- 세션 유지
- 계정별 데이터 완전 분리
- 계정 삭제 시 사용자 데이터 삭제 가능
- 초기 MVP에서는 개인 workspace만 지원

### 우선순위

P0

---

## 7.2 보드(Board)

### 설명

보드는 무한 확장 캔버스이며, 여러 종류의 노드와 엣지를 포함한다.

### 요구사항

- 보드 생성/이름 변경/삭제/보관
- 무한 캔버스에서 pan/zoom 가능
- viewport 상태 저장
- 보드 목록 조회 가능
- 기본 board:
    - Inbox
    - Untitled board 생성 가능

### 우선순위

P0

---

## 7.3 노드(Node)

### 공통 설명

모든 콘텐츠는 노드로 표현된다.
모든 노드는 위치, 크기, 타입, 메타데이터를 가진다.

### 공통 요구사항

- 생성/편집/삭제 가능
- 드래그 이동 가능
- 크기 조절 가능
- z-index 관리
- 복제 가능
- 멀티 선택 가능
- 키보드 삭제 지원

### 노드 타입

#### 1) Note Node

- 제목
- 본문 rich text
- 태그
- 색상/스타일
- 체크리스트 optional

#### 2) Image Node

- 이미지 업로드
- 썸네일 표시
- 확대 보기
- 캡션 optional

#### 3) File Node

- 파일 업로드
- 파일명, 타입, 크기 표시
- 다운로드/열기
- 미리보기 가능한 타입은 preview

#### 4) Document Node

- 문서 링크 또는 업로드 문서
- 제목/요약
- 추후 PDF 텍스트 인덱싱 대상

#### 5) Calendar Node

- 날짜/시간 범위
- 설명
- 일정 카드 형태

#### 6) Board Link Node

- 대상 보드 지정
- 클릭 시 해당 보드로 이동

#### 7) AI Summary Node

- AI가 생성한 요약/정리 결과 저장용
- 사용자 편집 가능

### 우선순위

P0: note, image, file, board link
P1: document, calendar, ai summary

---

## 7.4 엣지(Arrow / Edge)

### 설명

노드 간 관계를 시각적으로 연결하는 화살표

### 요구사항

- source node → target node 연결 가능
- 방향성 표시
- label optional
- 색상/스타일 optional
- 삭제 가능
- board 내에서만 연결 가능

### 제약

- 보드 간 edge는 MVP에서 지원하지 않음
- 보드 간 연결은 board link node로 처리

### 우선순위

P0

---

## 7.5 검색

### 설명

사용자는 자신의 메모와 자료를 빠르게 찾을 수 있어야 한다.

### 요구사항

- 제목 검색
- 본문 검색
- 태그 검색
- 보드 내 검색
- 전체 workspace 검색
- 최근 수정순 정렬
- 관련도 정렬

### 검색 종류

#### 1) 키워드 검색

- Supabase Postgres full-text search 활용

#### 2) 의미 검색

- pgvector 기반 유사도 검색
- AI 정리 시 관련 노트/보드 찾기에 사용

### 우선순위

P0: 키워드 검색
P1: 의미 검색

---

## 7.6 AI 정리

### 설명

사용자가 구조 없이 생성한 노트와 자료를 현재 워크스페이스 맥락에 따라 AI가 정리 제안한다.

### 입력 맥락

- 현재 보드 제목
- 현재 보드 내 노드 텍스트
- 노드 타입 분포
- 기존 태그
- 연결 구조
- 최근 생성된 노드
- 유사 보드/유사 노트 검색 결과

### AI가 수행할 작업

- 유사 항목 묶기
- 그룹명 제안
- 노트 제목 개선
- 태그 추천
- 요약 생성
- 보드 내 재배치 제안
- 관련 노드 간 링크 제안
- 특정 노드를 다른 보드로 옮길지 제안
- inbox 항목을 적절한 보드로 분류 제안

### UX 원칙

- AI는 직접 반영하지 않음
- 항상 “제안안”을 먼저 보여줌
- 사용자는 항목별로 선택 적용 가능
- 전체 적용도 가능

### 출력 형식

AI는 구조화된 JSON plan을 반환해야 한다

예시 작업 타입:

- create_group
- rename_node
- move_node
- add_tag
- create_edge
- create_summary_note
- suggest_board_move

### 우선순위

P1

---

## 7.7 CLI

### 설명

사용자는 터미널에서 직접 Drafty에 메모를 추가할 수 있어야 한다.

### 명령 예시

- `drafty memo "새 기능 아이디어"` (빠른 메모)
- `drafty memo -i` (vim interactive 모드)
- `drafty memo --board "제품전략" "AI organize 개선"`
- `drafty memo --inbox "방금 떠오른 생각"`
- `drafty boards`
- `drafty search "랜딩"`
- `drafty organize --board "Inbox"`

### 요구사항

- personal access token 기반 인증
- 기본 memo 입력은 inbox 저장
- 특정 board 지정 가능
- 간단한 검색 가능
- AI organize 실행 가능
- 출력은 plain text 우선
- **vim 형태의 interactive 입력 모드 지원**
    - `-i` 또는 `--interactive` 플래그로 진입
    - Insert mode에서 메모 텍스트 입력
    - ESC 후 command mode로 전환
    - Multiline 메모 입력 가능
    - 기본 vi/vim 키바인딩 지원 가능

### 비목표

- CLI에서 캔버스 시각화
- CLI에서 rich node layout 편집

### 우선순위

P1

---

## 7.8 첨부파일

### 설명

사용자는 이미지, 파일, 문서를 보드에 첨부할 수 있어야 한다.

### 요구사항

- 드래그 앤 드롭 업로드
- 이미지 preview
- 파일 metadata 저장
- storage 경로 관리
- 업로드 실패 복구
- 파일 삭제 시 storage 정리

### 저장 방식

- Supabase Storage 사용
- DB에는 metadata와 storage path 저장

### 우선순위

P0

---

## 7.9 동기화

### 설명

동일 계정으로 여러 기기에서 접속했을 때 최신 상태를 불러올 수 있어야 한다.

### 요구사항

- 모든 변경은 계정에 저장됨
- 새 기기 로그인 시 보드/노드 복원
- 저장은 자동 저장
- 보드 단위로 최신 상태 fetch
- 단일 사용자 멀티 디바이스 사용 고려

### 충돌 정책

MVP에서는 다음 정책 채택

- entity version 필드 사용
- last write wins 기본
- revision 기록으로 복구 가능

### 우선순위

P0

---

## 7.10 히스토리 / 복구

### 설명

사용자가 실수로 정리/이동/삭제했을 때 복구할 수 있어야 한다.

### 요구사항

- node/edge/board 변경에 대한 revision 저장
- 최근 변경 취소 최소 1단계
- 향후 revision timeline 확장 가능

### 우선순위

P1

---

# 8. 정보 구조

## 8.1 핵심 객체

- User
- Workspace
- Board
- Node
- Edge
- Attachment
- Tag
- AI Task
- Revision
- CLI Token

## 8.2 객체 관계

- User 1:N Board
- Board 1:N Node
- Board 1:N Edge
- Node 1:N Attachment
- User 1:N CLI Token
- Board 1:N AI Task

---

# 9. 사용자 경험(UX) 요구사항

## 9.1 메인 화면

- 좌측: board 목록 / 검색 / inbox 진입
- 중앙: 현재 board canvas
- 우측(optional): node detail / AI organize panel

## 9.2 기본 상호작용

- 더블클릭: note node 생성
- 드래그: 노드 이동
- 휠/트랙패드: zoom
- space + drag: pan
- selection box: 다중 선택
- delete/backspace: 삭제

## 9.3 빠른 입력

- 상단 quick add
- 키보드 단축키로 note 생성
- 붙여넣기 시 텍스트면 note, 이미지면 image node 생성

## 9.4 AI organize UX

- 버튼: “정리 제안 받기”
- 로딩 중 진행 상태 표시
- 완료 시 제안 패널 표시
- 항목별 체크박스
- “전체 적용” / “선택 적용”
- 적용 후 undo 가능

---

# 10. 비기능 요구사항

## 10.1 성능

- 보드 최초 로드: 2초 이내 목표
- 일반 노드 drag 반응: 60fps 체감 목표
- 300개 이하 노드 보드에서 사용성 유지
- AI organize는 비동기 처리

## 10.2 안정성

- 자동 저장 실패 시 재시도
- 네트워크 오류 시 사용자에게 상태 표시
- 업로드 실패 시 복구 안내

## 10.3 보안

- 모든 데이터는 사용자별 접근 제한
- Supabase RLS 적용
- Storage 접근도 사용자 범위 제한
- PAT는 해시 저장
- 민감 토큰은 서버 측에서만 검증

## 10.4 확장성

- 노드 타입 추가 가능 구조
- AI provider 교체 가능
- Storage provider 교체 가능 인터페이스 고려

---

# 11. 기술 아키텍처 요구사항

## 11.1 프론트엔드

- Next.js
- TypeScript
- React
- Canvas/Node graph: React Flow
- Rich text: Tiptap
- 상태관리: Zustand 또는 React Query + local state
- UI: Tailwind 기반

## 11.2 백엔드

- Next.js API routes 또는 별도 backend service
- Supabase:
    - Postgres
    - Auth
    - Storage
    - pgvector
    - RLS

## 11.3 AI 계층

- 별도 AI worker/service
- 역할:
    - 임베딩 생성
    - organize plan 생성
    - 요약/태그/링크 제안

- 결과는 DB에 task/result로 저장

## 11.4 CLI

- 서버 API 클라이언트
- 토큰 기반 인증
- 웹과 같은 비즈니스 규칙 공유 가능한 API 사용

---

# 12. Supabase 기준 데이터 요구사항

## 12.1 테이블 개요

### users

- id
- email
- created_at

### workspaces

- id
- user_id
- name
- created_at

### boards

- id
- workspace_id
- title
- description
- is_inbox
- viewport_x
- viewport_y
- viewport_zoom
- created_at
- updated_at
- archived_at

### nodes

- id
- board_id
- type
- title
- content_json
- plain_text
- x
- y
- width
- height
- z_index
- style_json
- metadata_json
- version
- created_at
- updated_at
- deleted_at

### edges

- id
- board_id
- source_node_id
- target_node_id
- label
- style_json
- version
- created_at
- updated_at
- deleted_at

### attachments

- id
- node_id
- user_id
- bucket
- storage_path
- file_name
- mime_type
- file_size
- metadata_json
- created_at

### tags

- id
- workspace_id
- name
- color
- created_at

### node_tags

- node_id
- tag_id

### board_links

- node_id
- target_board_id

### ai_tasks

- id
- workspace_id
- board_id
- status
- type
- input_json
- output_json
- error_message
- created_at
- updated_at
- completed_at

### embeddings

- id
- entity_type
- entity_id
- workspace_id
- embedding vector
- plain_text
- updated_at

### revisions

- id
- entity_type
- entity_id
- workspace_id
- patch_json
- actor_type
- created_at

### cli_tokens

- id
- user_id
- token_hash
- name
- last_used_at
- created_at
- revoked_at

---

# 13. 권한 요구사항

## 13.1 권한 원칙

- 사용자는 자신의 workspace 데이터만 접근 가능
- 모든 board, node, edge, attachment는 소유 workspace/user 범위 내에서만 접근 가능

## 13.2 RLS 정책 원칙

- `workspace.user_id = auth.uid()` 기준
- 모든 읽기/쓰기 정책은 workspace ownership 확인
- storage object도 user path prefix 기준 제한

---

# 14. API 요구사항

## 14.1 Board API

- `POST /boards`
- `GET /boards`
- `GET /boards/:id`
- `PATCH /boards/:id`
- `DELETE /boards/:id`

## 14.2 Node API

- `POST /boards/:id/nodes`
- `PATCH /nodes/:id`
- `DELETE /nodes/:id`
- `POST /nodes/:id/duplicate`

## 14.3 Edge API

- `POST /boards/:id/edges`
- `PATCH /edges/:id`
- `DELETE /edges/:id`

## 14.4 Search API

- `GET /search?q=...`
- `GET /boards/:id/search?q=...`

## 14.5 AI API

- `POST /boards/:id/organize`
- `GET /ai-tasks/:id`
- `POST /ai-tasks/:id/apply`

## 14.6 CLI API

- `POST /cli/tokens`
- `DELETE /cli/tokens/:id`
- `POST /cli/memo`
- `GET /cli/boards`
- `GET /cli/search`
- `POST /cli/organize`

---

# 15. AI 기능 상세 요구사항

## 15.1 AI organize 입력

- board title
- board description
- current nodes summary
- selected nodes optional
- board edges
- recent activity
- related notes by vector search
- related notes by keyword search

## 15.2 AI organize 출력

JSON schema 기반

필수 필드:

- summary
- groups[]
- actions[]
- confidence
- warnings[]

## 15.3 액션 타입 정의

- rename_node
- retitle_group
- move_node
- resize_node
- add_tag
- remove_tag
- create_edge
- remove_edge
- create_summary_node
- suggest_board_link
- suggest_move_to_board

## 15.4 적용 정책

- 사용자가 승인한 action만 적용
- 적용 전 revision 기록
- 실패한 action은 개별 에러 보고

## 15.5 안전장치

- 대량 삭제 action 금지
- 기존 attachment 삭제 제안 금지
- board 삭제 제안 금지
- destructive action은 MVP에서 미지원

---

# 16. CLI 상세 요구사항

## 16.1 설치

- npm 또는 standalone binary 추후 고려
- MVP는 npm global 설치 기준

## 16.2 인증 흐름

- 웹에서 PAT 발급
- CLI에서 `drafty login --token <token>`
- 토큰은 로컬 config 저장

## 16.3 주요 명령

### memo (일반 모드)

- `drafty memo "메모 내용"`
- 텍스트 메모 생성
- `--board <name>` 플래그로 대상 보드 지정
- `--tag <tag1,tag2>` 플래그로 태그 추가
- 기본은 inbox 보드에 저장

### memo (interactive 모드)

- `drafty memo -i` 또는 `drafty memo --interactive`
- vim 스타일 상호작용 지원
    - **Insert mode (기본)**
        - 메모 텍스트 자유롭게 입력
        - Multiline 지원
        - Ctrl+C로 종료 (저장 안 함)
        - ESC로 command mode 진입
    - **Command mode**
        - ESC 키로 진입, `:` 명령 입력
        - `:save`, `:w` - 메모 저장 후 종료
        - `:quit`, `:q!` - 저장 안 하고 종료
        - `:board <board_name>` - 대상 보드 지정
        - `:tag <tag1,tag2>` - 태그 추가 (쉼표 구분)
        - `:title <title>` - 메모 제목 설정
        - `:preview` - 현재 메모 내용 미리보기
        - `:clear` - 메모 내용 초기화
        - `i` - insert mode로 돌아가기

### boards

- board 목록 출력

### search

- 키워드 검색

### organize

- board 또는 inbox 정리 요청

### whoami

- 현재 계정 확인

## 16.4 에러 처리

- 인증 실패
- board not found
- network timeout
- rate limit
- invalid token

---

# 17. 분석 및 성공 지표

## 17.1 북극성 지표

- 주간 활성 사용자 중 **보드 생성 + 메모 작성 + 재방문** 비율

## 17.2 핵심 지표

- DAU / WAU
- 사용자당 생성 board 수
- 사용자당 생성 node 수
- inbox 사용률
- AI organize 실행률
- AI organize 적용률
- CLI 활성 사용자 비율
- 검색 사용률
- 파일 업로드 성공률
- 7일/30일 리텐션

## 17.3 품질 지표

- 보드 로딩 시간
- autosave 성공률
- organize task 성공률
- 적용 후 undo 비율
- 오류 로그 수

---

# 18. MVP 범위

## 포함

- 이메일 로그인
- board CRUD
- note/image/file/board-link node
- edges
- autosave
- 검색(키워드)
- inbox board
- CLI memo
- AI organize 초안 제안
- 제안 검토 후 적용
- Supabase Auth/DB/Storage

## 제외

- 협업
- 공유 링크
- 댓글
- 모바일 앱
- 외부 캘린더 연동
- 고급 권한 관리
- 실시간 presence
- 완전한 문서 OCR 파이프라인
- 외부 웹 클리퍼

---

# 19. 출시 단계 제안

## Phase 1: Core Canvas

- 인증
- boards
- note nodes
- image/file upload
- edges
- autosave

## Phase 2: Search + Inbox + CLI

- workspace search
- inbox board
- CLI memo/search
- board link nodes

## Phase 3: AI Organize

- embeddings
- organize tasks
- proposal UI
- apply flow
- revisions

## Phase 4: Polish

- 성능 개선
- 대형 보드 최적화
- 더 좋은 정렬/스냅 UX
- AI 품질 개선

---

# 20. 오픈 이슈

아래는 PRD 이후 설계 단계에서 확정해야 할 항목이다.

1. note editor를 어디까지 rich text로 할 것인가
2. image/file/document node의 UI 차이를 얼마나 둘 것인가
3. AI organize가 자동 배치를 어느 수준까지 제안할 것인가
4. 보드 내 그룹을 독립 엔티티로 둘지, 단순 레이아웃 개념으로 둘지
5. CLI를 TypeScript로 할지 Python으로 할지
6. AI provider를 로컬 모델 우선으로 할지 외부 API fallback을 둘지
7. 검색 결과를 board 단위와 global 단위에서 어떻게 섞어 보여줄지
8. revision granularity를 patch 단위로 할지 snapshot 단위로 할지

---

# 21. 최종 제품 정의 문장

**Drafty는 사용자가 웹과 CLI 어디서든 생각을 빠르게 수집하고, 무한 캔버스 위에서 시각적으로 연결하며, AI의 정리 제안을 통해 구조 없는 초안을 체계적인 작업 공간으로 바꿔가는 개인용 workspace 앱이다.**
