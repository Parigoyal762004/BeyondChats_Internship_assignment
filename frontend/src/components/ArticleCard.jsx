import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  const formattedDate = new Date(article.updated_at || article.scraped_at).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 flex-1 line-clamp-2">
            {article.title}
          </h2>
          <span
            className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              article.is_updated
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {article.is_updated ? 'Updated' : 'Original'}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>{article.author || 'Unknown Author'}</span>
          <span>{formattedDate}</span>
        </div>

        <Link
          to={`/articles/${article.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
}
