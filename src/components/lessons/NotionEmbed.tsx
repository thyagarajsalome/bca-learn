import { ExternalLink } from 'lucide-react';

interface NotionEmbedProps {
  url: string;
  title?: string;
}

export default function NotionEmbed({ url, title }: NotionEmbedProps) {
  return (
    <div className="flex flex-col h-full bg-[#0c0f1a]">
      {/* Header */}
      <div className="bg-[#13172a] border-b border-[#1e2340] p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#e8eaf6] truncate">{title || 'Notion Document'}</h2>
            <p className="text-sm text-[#8890b5]">Embedded Notion page</p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
          >
            <span className="text-sm">Open in Notion</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Notion iframe */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={url}
          title={title || 'Notion Document'}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          loading="lazy"
        />
      </div>
    </div>
  );
}