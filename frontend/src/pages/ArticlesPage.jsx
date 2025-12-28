import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { mockArticles } from '../data/mockArticles';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  useEffect(() => {
    loadArticles();
  }, [page, filter]);

  const loadArticles = () => {
    let filtered = mockArticles;
    
    if (filter === 'original') {
      filtered = filtered.filter(a => !a.is_updated);
    } else if (filter === 'updated') {
      filtered = filtered.filter(a => a.is_updated);
    }
    
    setArticles(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

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

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
