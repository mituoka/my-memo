import DOMPurify from 'dompurify';

export function parseMarkdown(content: string): string {
  // まず入力をエスケープしてXSS攻撃を防ぐ
  let html = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // 見出し（# ## ###）
  html = html.replace(/^### (.*$)/gm, '<h3 class="markdown-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="markdown-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="markdown-h1">$1</h1>');

  // 太字（**text**）
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="markdown-bold">$1</strong>');

  // 斜体（*text*）
  html = html.replace(/\*(.*?)\*/g, '<em class="markdown-italic">$1</em>');

  // インラインコード（`code`）
  html = html.replace(/`([^`]+)`/g, '<code class="markdown-code">$1</code>');

  // コードブロック（```code```）
  html = html.replace(/```([^`]+)```/g, '<pre class="markdown-codeblock"><code>$1</code></pre>');

  // 引用（> text）
  html = html.replace(/^&gt; (.*$)/gm, '<blockquote class="markdown-quote">$1</blockquote>');

  // リンク（[text](url)） - より安全な URL バリデーション
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // URLの基本的なバリデーション
    if (url.match(/^https?:\/\/[^\s<>"']+$/)) {
      return `<a href="${url}" class="markdown-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    return match; // 無効なURLはそのまま表示
  });

  // リスト（- item または * item）
  html = html.replace(/^[-*] (.*$)/gm, '<li class="markdown-list-item">$1</li>');
  html = html.replace(/(<li class="markdown-list-item">.*<\/li>)/s, '<ul class="markdown-list">$1</ul>');

  // 番号付きリスト（1. item）
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="markdown-ordered-item">$1</li>');
  html = html.replace(/(<li class="markdown-ordered-item">.*<\/li>)/s, '<ol class="markdown-ordered-list">$1</ol>');

  // 改行の処理
  html = html.replace(/\n/g, '<br>');

  // DOMPurifyでHTMLをサニタイズ
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'strong', 'em', 'code', 'pre', 'blockquote', 
      'a', 'ul', 'ol', 'li', 'br'
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style', 'iframe'],
    STRIP_COMMENTS: true
  });

  return sanitizedHtml;
}

export function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = `heading-${index}`;
      headings.push({ level, text, id });
    }
  });

  return headings;
}