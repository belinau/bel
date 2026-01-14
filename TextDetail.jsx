import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

const TextDetail = ({ item, t, getText }) => {
  return (
    <div className="p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 bg-neutral-100 rounded-lg">
            <BookOpen className="w-1/2 h-1/2 text-neutral-400" />
          </div>

          <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-xs uppercase tracking-wider text-neutral-600 mb-4">
            {t.text || 'Text'}
          </span>
          <h2 className="text-2xl md:text-4xl font-light mb-4">{getText(item.title)}</h2>

          <div className="flex flex-wrap gap-4 text-neutral-600 mb-6">
            <span className="flex items-center gap-2">
              <BookOpen size={16} />
              {item.year}
            </span>
          </div>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-8">{getText(item.description)}</p>
        </div>

        {item.pdfUrl && (
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
              <BookOpen size={16} />
              PDF Document
            </h3>
            <div className="rounded-lg overflow-hidden bg-white shadow-lg">
              <iframe
                src={getText(item.pdfUrl)}
                width="100%"
                height="600px"
                title="PDF Document"
                className="border-0"
                onError={(e) => {
                  const iframe = e.target;
                  iframe.style.display = 'none';
                  const fallbackDiv = iframe.parentElement?.querySelector('.pdf-fallback');
                  if (fallbackDiv) fallbackDiv.style.display = 'block';
                }}
              />
              <div className="pdf-fallback p-6 text-center bg-gray-50" style={{display: 'none'}}>
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">PDF: {getText(item.pdfUrl).split('/').pop()}</p>
                <a
                  href={getText(item.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
                >
                  <span>Open PDF in New Tab</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        )}

        {item.additionalInfo && (
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.additionalInfo}</h3>
            <p className="text-neutral-700 leading-relaxed">{getText(item.additionalInfo)}</p>
          </div>
        )}

        {item.pdfUrl && (
          <a href={getText(item.pdfUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors">
            <span>Download PDF</span>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

export default TextDetail;