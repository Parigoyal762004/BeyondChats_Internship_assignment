import React from 'react';

export default function ArticleDetail({ article, onToggleVersion }) {
  const formattedDate = new Date(article.updated_at || article.scraped_at).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <article className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{article.title}</h1>
            <div className="flex gap-4 text-gray-600 text-sm">
              <span>By {article.author || 'Unknown Author'}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
              article.is_updated
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {article.is_updated ? 'Enhanced Version' : 'Original'}
          </span>
        </div>

        {onToggleVersion && (
          <button
            onClick={onToggleVersion}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
          >
            {article.is_updated ? '← View Original Version' : 'View Enhanced Version →'}
          </button>
        )}
      </div>

      <div className="border-t border-gray-200 py-6">
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(article.content),
          }}
        />
      </div>

      {article.references && article.references.length > 0 && (
        <ReferenceSection references={article.references} />
      )}

      <div className="border-t border-gray-200 mt-6 pt-6">
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          View Original Source
        </a>
      </div>
    </article>
  );
}

function ReferenceSection({ references }) {
  if (!references || references.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">References</h3>
      <ol className="space-y-3">
        {references
          .filter((ref) => ref.title && ref.url)
          .map((ref, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="font-semibold text-gray-600">[{index + 1}]</span>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline transition break-all"
              >
                {ref.title} - {ref.source}
              </a>
            </li>
          ))}
      </ol>
    </div>
  );
}

/**
 * Simple HTML sanitization to prevent XSS
 * Removes dangerous tags but allows basic formatting
 */
function sanitizeHtml(html) {
  if (!html) return '';
  
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/style="[^"]*"/gi, '');
}
