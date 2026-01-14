import React from 'react';
import { ExternalLink } from 'lucide-react';

const PublicationDetail = ({ item, t, getText, lang }) => {
  const getPublisherLink = () => {
    if (!item.publisherLink) return '#';

    if (typeof item.publisherLink === 'string') {
      return item.publisherLink.startsWith('http') ? item.publisherLink : `https://${item.publisherLink}`;
    }

    if (typeof item.publisherLink === 'object') {
      const link = item.publisherLink[lang] || item.publisherLink.en;
      if (typeof link === 'string') {
        return link.startsWith('http') ? link : `https://${link}`;
      }
    }
    return '#';
  };

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="aspect-[3/4] max-w-xs mx-auto mb-6">
            <img
              src={item.thumbnail || '/images/base.jpg'}
              alt={getText(item.title)}
              className="w-full h-auto object-contain rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/images/base.jpg';
              }}
            />
          </div>

          <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-xs uppercase tracking-wider text-neutral-600 mb-4">
            {t.translation}
          </span>
          <h2 className="text-2xl md:text-4xl font-light mb-2">{getText(item.title)}</h2>
          <p className="text-lg md:text-xl text-neutral-600">{getText(item.author)}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.publisher}</h3>
            <p>{getText(item.publisher)}</p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.year}</h3>
            <p>{item.year}</p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.pages}</h3>
            <p>{item.pages}</p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.isbn}</h3>
            <p className="font-mono text-sm">{item.isbn}</p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.translationLabel}</h3>
            <p>{getText(item.languageFrom)} → {getText(item.languageTo)}</p>
          </div>
        </div>

        {item.additionalInfo && (
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.additionalInfo}</h3>
            <p className="text-neutral-700 leading-relaxed">{getText(item.additionalInfo)}</p>
          </div>
        )}

        {item.publisherLink && (
          <a
            href={getPublisherLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <span>{t.viewPublisher}</span>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

export default PublicationDetail;