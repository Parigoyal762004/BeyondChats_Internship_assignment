import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Content Enhanced by AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover how articles can be automatically enhanced using AI research and competitor
            analysis. This project demonstrates the power of intelligent content optimization.
          </p>

          <Link
            to="/articles"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
          >
            Explore Articles
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-blue-600">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Research</h3>
            <p className="text-gray-600 text-sm">
              Each article is analyzed against top Google results to identify missing content
              and opportunities for improvement.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-green-600">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Enhancement</h3>
            <p className="text-gray-600 text-sm">
              Google Gemini API intelligently restructures and improves articles while preserving
              the original voice and message.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-purple-600">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Citations</h3>
            <p className="text-gray-600 text-sm">
              Enhanced articles include references to competitor sources, maintaining
              transparency and enabling further research.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </span>
              <span>
                <strong>Scrape:</strong> Extract articles from the BeyondChats blog
              </span>
            </li>
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </span>
              <span>
                <strong>Research:</strong> Search Google for top-ranking competitor articles
              </span>
            </li>
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </span>
              <span>
                <strong>Enhance:</strong> Use AI to improve structure and content quality
              </span>
            </li>
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                4
              </span>
              <span>
                <strong>Display:</strong> Show original and enhanced versions side-by-side
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
