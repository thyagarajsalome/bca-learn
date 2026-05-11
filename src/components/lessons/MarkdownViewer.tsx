import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownViewerProps {
  content: string;
  title?: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="w-full h-full bg-[#0c0f1a] overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full px-4 py-8 md:p-8 lg:p-12 pb-32">
        
        {/* Notice the added prose classes below: 
          We are explicitly adding large margins (mb-6, mt-8) to paragraphs, 
          headings, and lists to prevent the "chunk" look and mimic Notion's layout.
        */}
        <article className="prose prose-invert prose-sm md:prose-base lg:prose-lg max-w-none 
          prose-headings:text-[#e8eaf6] prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-2
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#1e2340] prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[#8890b5] prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-[#5b6af0] hover:prose-a:text-[#4ecca3]
          prose-strong:text-[#e8eaf6]
          prose-ul:my-6 prose-li:my-2
          prose-blockquote:border-l-[4px] prose-blockquote:border-[#5b6af0] prose-blockquote:bg-[#5b6af0]/10 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:not-italic
          prose-code:text-[#4ecca3] prose-code:bg-[#1e2340] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#13172a] prose-pre:border prose-pre:border-[#1e2340] shadow-xl rounded-xl prose-pre:my-8">
          
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
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
                  <code className={className} {...props}>{children}</code>
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