import { Fragment, type ReactNode } from 'react';

// Small renderer for the subset of markdown used in lab instructions:
// paragraphs, "- " lists, ``` fenced blocks, `inline code`, **bold**.

function inline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      blocks.push(<pre key={blocks.length} className="md-pre">{buf.join('\n')}</pre>);
    } else if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) items.push(lines[i++].replace(/^(- |\d+\. )/, ''));
      const Tag = ordered ? 'ol' : 'ul';
      blocks.push(<Tag key={blocks.length}>{items.map((t, k) => <li key={k}>{inline(t)}</li>)}</Tag>);
    } else if (line.trim() === '') {
      i++;
    } else {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```') && !/^(- |\d+\. )/.test(lines[i])) buf.push(lines[i++]);
      blocks.push(<p key={blocks.length}>{inline(buf.join(' '))}</p>);
    }
  }
  return <div className={className ?? 'md'}>{blocks}</div>;
}
