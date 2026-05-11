import { useState, useEffect, useMemo } from 'react';
import { BlockNoteEditor, type PartialBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface NotionEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export default function NotionEditor({ markdown, onChange }: NotionEditorProps) {
  const [initialBlocks, setInitialBlocks] = useState<PartialBlock[] | "loading">("loading");

  // Load and parse existing markdown when editing a lesson
  useEffect(() => {
    let isMounted = true;
    async function loadMarkdown() {
      if (!markdown) {
        if (isMounted) setInitialBlocks([]);
        return;
      }
      
      // Create a temporary invisible editor just to parse the markdown
      const tempEditor = BlockNoteEditor.create();
      const blocks = await tempEditor.tryParseMarkdownToBlocks(markdown);
      
      if (isMounted) setInitialBlocks(blocks);
    }
    
    setInitialBlocks("loading");
    loadMarkdown();
    
    return () => { isMounted = false; };
  }, [markdown]);

  if (initialBlocks === "loading") {
    return (
      <div className="p-8 text-center border border-[#1e2340] rounded-lg bg-[#0c0f1a]">
        <div className="w-8 h-8 border-4 border-[#5b6af0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#8890b5]">Loading Editor...</p>
      </div>
    );
  }

  return <EditorInstance initialBlocks={initialBlocks} onChange={onChange} />;
}

// Inner component to handle the synchronous BlockNote creation
function EditorInstance({ initialBlocks, onChange }: { initialBlocks: PartialBlock[], onChange: (md: string) => void }) {
  const editor = useMemo(() => {
    return BlockNoteEditor.create({ 
      initialContent: initialBlocks.length > 0 ? initialBlocks : undefined 
    });
  }, [initialBlocks]);

  return (
    <div className="rounded-lg border border-[#1e2340] bg-[#0c0f1a] overflow-hidden">
      {/* BlockNote requires a light/dark theme. We force dark mode 
        and add some padding to make it feel roomy like Notion.
      */}
      <div className="p-4 md:p-8 min-h-[400px]">
        <BlockNoteView
          editor={editor}
          theme="dark"
          onChange={async () => {
            // Whenever you type, silently convert the blocks to markdown and save to state
            const md = await editor.blocksToMarkdownLossy(editor.document);
            onChange(md);
          }}
        />
      </div>
    </div>
  );
}