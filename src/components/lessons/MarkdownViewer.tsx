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
    <div className="w-full h-full bg-[#0c0f1a] overflow-y-auto">
      {/* Responsive container: 
        - p-4 on mobile, p-8 on tablets, p-12 on desktops 
        - max-w-3xl keeps line lengths readable 
      */}
      <div className="max-w-3xl mx-auto w-full px-4 py-8 md:p-8 lg:p-12 pb-32">
        
        {/* Tailwind Typography styles formatted for Dark Mode */}
        <article className="prose prose-invert prose-sm md:prose-base lg:prose-lg max-w-none 
          prose-headings:text-[#e8eaf6] 
          prose-p:text-[#8890b5] leading-relaxed
          prose-a:text-[#5b6af0] hover:prose-a:text-[#4ecca3]
          prose-strong:text-[#e8eaf6]
          prose-code:text-[#4ecca3] prose-code:bg-[#1e2340] prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-[#13172a] prose-pre:border prose-pre:border-[#1e2340] shadow-xl rounded-xl">
          
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
                    className="rounded-lg !my-0 !bg-transparent text-sm"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props}>{children}</code>
                );
              }
            }}
          >
            {content || '*No content available for this lesson yet.*'}
          </ReactMarkdown>

        </article>
      </div>
    </div>
  );
}