import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArticleDetail from '../components/ArticleDetail';
import { mockArticles } from '../data/mockArticles';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const found = mockArticles.find(a => a.id === parseInt(id));
    if (found) {
      setArticle(found);
    } else {
      setError('Article not found');
    }
  }, [id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/articles')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Articles
        </button>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const displayArticle = article;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/articles')}
        className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-flex items-center gap-2"
      >
        ← Back to Articles
      </button>

      <ArticleDetail
        article={displayArticle}
        onToggleVersion={
          article.is_updated
            ? () => setShowOriginal(!showOriginal)
            : null
        }
      />
    </div>
  );
}
