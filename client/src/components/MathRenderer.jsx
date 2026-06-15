import { useMemo } from 'react';
import katex from 'katex';

function renderMath(latex) {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode: false, output: 'html' });
  } catch {
    return latex;
  }
}

export default function MathRenderer({ html, className = '' }) {
  const parsed = useMemo(() => {
    if (!html) return '';
    const parts = html.split(/(\$\$[^$]*\$\$|\$[^$]*\$)/g);
    return parts.map((part) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return renderMath(part.slice(2, -2));
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return renderMath(part.slice(1, -1));
      }
      return part;
    }).join('');
  }, [html]);

  if (!html) return null;
  return <span className={className} dangerouslySetInnerHTML={{ __html: parsed }} />;
}
