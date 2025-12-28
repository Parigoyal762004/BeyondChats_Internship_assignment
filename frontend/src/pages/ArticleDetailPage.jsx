import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchArticleById } from '../utils/api';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [originalArticle, setOriginalArticle] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArticleById(id);

      if (!data) {
        setError('Article not found');
        return;
      }

      setArticle(data);

      // If this is an enhanced article, try to find the original
      if (data.is_updated && data.source_url.includes('#enhanced')) {
        const originalUrl = data.source_url.replace('#enhanced', '');
        try {
          const result = await fetchArticleById(data.id);
          // Search for original by checking related articles
          // For now, we'll just mark that there's an enhanced version
        } catch (err) {
          console.log('Could not find original article');
        }
      }
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading article..." />;
  }

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

  const displayArticle = showOriginal && originalArticle ? originalArticle : article;

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
