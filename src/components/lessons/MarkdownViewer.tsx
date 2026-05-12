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
      <div className="max-w-4xl mx-auto w-full px-6 py-8 md:px-10 lg:py-12 pb-32">
        
        {/* Optimized for ChatGPT/Gemini Output
          Added explicit styling for nested lists, tables, code formats, and overall spacing
        */}
        <article className="prose prose-invert max-w-none 
          prose-base md:prose-lg
          prose-headings:text-[#e8eaf6] prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-4 prose-h1:pb-4 border-[#1e2340]
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[#1e2340]/60 prose-h2:pb-3
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-[#e8eaf6]/90
          prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3
          
          prose-p:text-[#a5accc] prose-p:leading-8 prose-p:mb-6 prose-p:text-[1.05rem]
          
          prose-a:text-[#5b6af0] hover:prose-a:text-[#4ecca3] prose-a:underline-offset-4 prose-a:transition-colors
          
          prose-strong:text-[#e8eaf6] prose-strong:font-semibold
          
          prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
          prose-li:my-3 prose-li:text-[#a5accc] prose-li:leading-7
          prose-li:marker:text-[#5b6af0]
          
          prose-blockquote:border-l-[4px] prose-blockquote:border-[#5b6af0] 
          prose-blockquote:bg-[#5b6af0]/10 prose-blockquote:py-3 prose-blockquote:px-6 
          prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:not-italic
          prose-blockquote:text-[#a5accc]
          
          prose-code:text-[#4ecca3] prose-code:bg-[#4ecca3]/10 prose-code:px-1.5 prose-code:py-0.5 
          prose-code:rounded-md prose-code:font-medium prose-code:text-sm
          prose-code:before:content-none prose-code:after:content-none
          
          prose-pre:bg-[#13172a] prose-pre:border prose-pre:border-[#1e2340] 
          prose-pre:shadow-2xl prose-pre:rounded-xl prose-pre:my-8 prose-pre:p-0
          
          prose-table:w-full prose-table:my-8 prose-table:border-collapse prose-table:overflow-hidden prose-table:rounded-xl
          prose-th:bg-[#13172a] prose-th:text-[#e8eaf6] prose-th:font-semibold prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-[#1e2340]
          prose-td:border prose-td:border-[#1e2340] prose-td:p-4 prose-td:text-[#a5accc]
          
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
          
          prose-hr:border-[#1e2340] prose-hr:my-10
          ">
          
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group">
                    <div className="absolute top-0 right-0 px-3 py-1 text-xs text-[#8890b5] bg-[#1e2340] rounded-bl-lg rounded-tr-xl font-mono">
                      {match[1]}
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !my-0 !bg-[#13172a] !p-6 text-sm md:text-base leading-relaxed overflow-x-auto border border-[#1e2340]"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
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
