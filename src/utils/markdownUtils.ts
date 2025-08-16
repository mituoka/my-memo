export function parseMarkdown(content: string): string {
  let html = content;

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
  html = html.replace(/^> (.*$)/gm, '<blockquote class="markdown-quote">$1</blockquote>');

  // リンク（[text](url)）
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link" target="_blank" rel="noopener noreferrer">$1</a>');

  // リスト（- item または * item）
  html = html.replace(/^[-*] (.*$)/gm, '<li class="markdown-list-item">$1</li>');
  html = html.replace(/(<li class="markdown-list-item">.*<\/li>)/s, '<ul class="markdown-list">$1</ul>');

  // 番号付きリスト（1. item）
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="markdown-ordered-item">$1</li>');
  html = html.replace(/(<li class="markdown-ordered-item">.*<\/li>)/s, '<ol class="markdown-ordered-list">$1</ol>');

  // 改行の処理
  html = html.replace(/\n/g, '<br>');

  return html;
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