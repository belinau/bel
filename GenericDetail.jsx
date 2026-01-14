import React from 'react';
import { ExternalLink, Calendar, MapPin, Film, Users } from 'lucide-react';

const GenericDetail = ({ item, t, getText, categories }) => {
  const getCategoryLabel = () => {
    if (Array.isArray(item.type)) {
      return item.type
        .map(typeId => {
          const category = categories.find(c => c.id === typeId);
          return category ? category.label : typeId;
        })
        .join(', ');
    }
    return categories.find(c => c.id === item.type)?.label || item.type;
  };

  const getFormattedUrl = (url) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
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
            {getCategoryLabel()}
          </span>
          <h2 className="text-2xl md:text-4xl font-light mb-4">{getText(item.title)}</h2>

          <div className="flex flex-wrap gap-4 text-neutral-600 mb-6">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {item.year}
            </span>
            {item.venue && (
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <div dangerouslySetInnerHTML={{ __html: getText(item.venue) }} />
              </div>
            )}
            {item.producer && (
              <span className="flex items-center gap-2">
                <Users size={16} />
                {getText(item.producer)}
              </span>
            )}
          </div>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-8">{getText(item.description)}</p>

          {item.credits && item.credits.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                <Users size={16} />
                {t.credits}
              </h3>
              <div className="space-y-2">
                {item.credits.map((credit, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-neutral-500 min-w-[100px] md:min-w-[120px] text-sm">{getText(credit.role)}</span>
                    <span className="font-medium text-sm">{credit.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {item.producerLink && (
          <div className="mb-8">
            <a
              href={getFormattedUrl(item.producerLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <span>{t.viewProducer}</span>
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        {item.media && item.media.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
              <Film size={16} />
              {t.documentation}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {item.media.map((media, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden bg-neutral-100">
                  {media.type === 'image' ? (
                    <img src={media.url} alt="" className="w-full h-auto object-contain max-h-64" />
                  ) : (
                    <iframe src={media.url} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {item.press && item.press.length > 0 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">{t.press}</h3>
            <div className="space-y-4">
              {item.press.map((item, idx) => (
                <a key={idx} href={getFormattedUrl(item.url)} target="_blank" rel="noopener noreferrer" className="block border-l-2 border-neutral-200 hover:border-neutral-400 pl-4 transition-colors group">
                  <p className="text-neutral-700 group-hover:text-neutral-900 text-sm">{getText(item.text)}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericDetail;