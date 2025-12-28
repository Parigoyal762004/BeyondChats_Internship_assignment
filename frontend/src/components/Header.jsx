import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="font-bold text-blue-600">BC</span>
            </div>
            <h1 className="text-2xl font-bold">BeyondChats</h1>
          </Link>
          <nav className="flex gap-8">
            <Link to="/" className="hover:text-blue-100 transition">
              Home
            </Link>
            <Link to="/articles" className="hover:text-blue-100 transition">
              Articles
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
