import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  title?: string;
  onProgress?: (pageNumber: number) => void;
  onComplete?: () => void;
}

export default function PDFViewer({ url, title, onProgress, onComplete }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const changePage = (offset: number) => {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
      onProgress?.(newPageNumber);

      // Check if user completed the document
      if (newPageNumber === numPages) {
        onComplete?.();
      }
    }
  };

  const changeScale = (offset: number) => {
    const newScale = scale + offset;
    if (newScale >= 0.5 && newScale <= 3.0) {
      setScale(newScale);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0f1a]" onContextMenu={(e) => e.preventDefault()}>
      {/* Header */}
      <div className="bg-[#13172a] border-b border-[#1e2340] p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#e8eaf6] truncate">{title || 'PDF Document'}</h2>
            <p className="text-sm text-[#8890b5]">
              Page {pageNumber} of {numPages}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changeScale(-0.25)}
              className="p-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm text-[#8890b5] w-12 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => changeScale(0.25)}
              className="p-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {loading && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#5b6af0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#8890b5]">Loading PDF...</p>
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          className="max-w-full"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="shadow-lg"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Footer Navigation */}
      <div className="bg-[#13172a] border-t border-[#1e2340] p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, numPages) }, (_, i) => {
              let pageNum;
              if (numPages <= 5) {
                pageNum = i + 1;
              } else if (pageNumber <= 3) {
                pageNum = i + 1;
              } else if (pageNumber >= numPages - 2) {
                pageNum = numPages - 4 + i;
              } else {
                pageNum = pageNumber - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPageNumber(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    pageNumber === pageNum
                      ? 'bg-[#5b6af0] text-white'
                      : 'bg-[#0c0f1a] text-[#8890b5] hover:bg-[#1e2340] hover:text-[#e8eaf6]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}