import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownViewerProps {
  content: string;
  title?: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="flex flex-col h-full bg-[#0c0f1a] overflow-auto">
      <div className="max-w-4xl mx-auto w-full p-6 md:p-12">
        {/* prose-invert automatically applies dark mode text styles */}
        <article className="prose prose-invert prose-pre:bg-[#13172a] prose-pre:border prose-pre:border-[#1e2340] max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-[#1e2340] text-[#4ecca3] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content || '*No content available for this lesson.*'}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}