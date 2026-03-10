/**
 * markdown 본문에서 표시용 제목 추출.
 * 명시적 제목이 있으면 그대로 반환.
 * 없으면 첫 줄에서 '#' heading 기호를 제거해 반환.
 * 비어 있으면 '(제목 없음)' 반환.
 */
export function extractTitle(markdown: string, explicitTitle?: string): string {
  if (explicitTitle?.trim()) return explicitTitle.trim();

  const firstLine = markdown.split('\n')[0]?.trim() ?? '';
  if (!firstLine) return '(제목 없음)';

  // '#' heading 기호 및 앞뒤 공백 제거
  const withoutHeading = firstLine.replace(/^#{1,6}\s+/, '').trim();
  return withoutHeading || '(제목 없음)';
}

/**
 * markdown 문법 기호를 제거한 순수 텍스트 반환 (카드/노드 미리보기용).
 * heading, bold, italic, inline code, link, list marker 제거.
 * maxLength 이후는 잘라낸다 (기본 80자).
 */
export function stripMarkdown(markdown: string, maxLength = 80): string {
  let text = markdown
    // heading 제거
    .replace(/^#{1,6}\s+/gm, '')
    // bold/italic (***text***, **text**, *text*, ___text___, __text__, _text_)
    .replace(/(\*{1,3}|_{1,3})(.+?)\1/g, '$2')
    // inline code
    .replace(/`([^`]+)`/g, '$1')
    // link [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // 리스트 마커 (-, *, +, 숫자.)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 여러 줄을 공백으로 합침
    .replace(/\n+/g, ' ')
    .trim();

  if (text.length > maxLength) {
    text = text.slice(0, maxLength).trimEnd() + '…';
  }

  return text;
}
