import { useState, useMemo } from 'react';
import { Check, Copy } from 'lucide-react';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-cyan-500/25 bg-[#070d1e] shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0b142d] border-b border-cyan-500/15 text-[11px] font-mono text-cyan-300">
        <span>{lang || 'code'}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-cyan-100/90 leading-relaxed">
        <code>{escapeHtml(code)}</code>
      </pre>
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns = [
    {
      regex: /^\*\*(.+?)\*\*/,
      render: (m: RegExpMatchArray) => (
        <strong key={key++} className="font-semibold text-white">
          {m[1]}
        </strong>
      ),
    },
    {
      regex: /^\*(.+?)\*/,
      render: (m: RegExpMatchArray) => (
        <em key={key++} className="italic text-slate-200">
          {m[1]}
        </em>
      ),
    },
    {
      regex: /^`([^`]+)`/,
      render: (m: RegExpMatchArray) => (
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 text-[0.88em] font-mono border border-cyan-500/25"
        >
          {m[1]}
        </code>
      ),
    },
    {
      regex: /^\[(.+?)\]\((.+?)\)/,
      render: (m: RegExpMatchArray) => (
        <a
          key={key++}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline hover:text-cyan-300 transition-colors"
        >
          {m[1]}
        </a>
      ),
    },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const p of patterns) {
      const m = remaining.match(p.regex);
      if (m) {
        nodes.push(p.render(m));
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      const nextSpecial = remaining.search(/(\*\*|\*|`|\[)/);
      if (nextSpecial === -1) {
        nodes.push(<span key={key++}>{remaining}</span>);
        remaining = '';
      } else if (nextSpecial === 0) {
        nodes.push(<span key={key++}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
      } else {
        nodes.push(<span key={key++}>{remaining.slice(0, nextSpecial)}</span>);
        remaining = remaining.slice(nextSpecial);
      }
    }
  }

  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const blocks = useMemo(() => {
    const lines = content.split('\n');
    const result: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        result.push(<CodeBlock key={key++} code={codeLines.join('\n')} lang={lang} />);
        continue;
      }

      // Headings
      const headingMatch = line.match(/^(#{1,4})\s+(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const headingClasses = [
          'text-xl font-bold text-white mt-4 mb-2',
          'text-lg font-bold text-white mt-3.5 mb-1.5',
          'text-base font-semibold text-cyan-200 mt-3 mb-1',
          'text-sm font-semibold text-cyan-300 mt-2.5 mb-1',
        ];
        result.push(
          <div key={key++} className={headingClasses[level - 1] || 'text-sm font-semibold'}>
            {renderInline(text)}
          </div>
        );
        i++;
        continue;
      }

      // Blockquotes
      if (line.trim().startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().slice(1).trim());
          i++;
        }
        result.push(
          <blockquote
            key={key++}
            className="my-3 pl-3.5 border-l-2 border-cyan-400 bg-cyan-950/20 py-1 text-slate-300 italic text-sm rounded-r-md"
          >
            {renderInline(quoteLines.join(' '))}
          </blockquote>
        );
        continue;
      }

      // Ordered list
      if (/^\d+\.\s+/.test(line.trim())) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
          i++;
        }
        result.push(
          <ol key={key++} className="my-2 space-y-1 pl-5 list-decimal marker:text-cyan-400 text-sm">
            {items.map((item, idx) => (
              <li key={idx} className="text-slate-300 leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Unordered list
      if (/^[-*•]\s+/.test(line.trim())) {
        const items: string[] = [];
        while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
          i++;
        }
        result.push(
          <ul key={key++} className="my-2 space-y-1 pl-5 list-disc marker:text-cyan-400 text-sm">
            {items.map((item, idx) => (
              <li key={idx} className="text-slate-300 leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        result.push(<hr key={key++} className="my-4 border-cyan-500/20" />);
        i++;
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].trim().startsWith('```') &&
        !lines[i].trim().startsWith('#') &&
        !lines[i].trim().startsWith('>') &&
        !/^\d+\.\s+/.test(lines[i].trim()) &&
        !/^[-*•]\s+/.test(lines[i].trim()) &&
        lines[i].trim() !== '---'
      ) {
        paraLines.push(lines[i]);
        i++;
      }

      if (paraLines.length > 0) {
        result.push(
          <p key={key++} className="my-1.5 leading-relaxed text-slate-200 text-sm">
            {renderInline(paraLines.join(' '))}
          </p>
        );
      }
    }

    return result;
  }, [content]);

  return <div className="space-y-1">{blocks}</div>;
}
