import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchArticles } from '../utils/api';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [limit] = useState(12);

  useEffect(() => {
    loadArticles();
  }, [page, filter]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchArticles(page, limit, filter === 'all' ? null : filter);
      setArticles(result.data || []);
      setPagination(result.pagination);
    } catch (err) {
      setError('Failed to load articles. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  if (loading && articles.length === 0) {
    return <LoadingSpinner text="Loading articles..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
      <p className="text-gray-600 mb-8">
        Browse original articles from BeyondChats and their AI-enhanced versions
      </p>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['all', 'original', 'updated'].map((btn) => (
          <button
            key={btn}
            onClick={() => handleFilterChange(btn)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              filter === btn
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {btn === 'all' && 'All Articles'}
            {btn === 'original' && 'Original Only'}
            {btn === 'updated' && 'Enhanced Only'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No articles found. Run Phase 1 scraper first.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded ${
                  page === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-600">
                Page {page} of {pagination.pages}
              </span>

              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className={`px-4 py-2 rounded ${
                  page === pagination.pages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
