import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm">
            BeyondChats Content Optimizer © 2025
          </p>
          <a
            href="https://github.com/Parigoyal762004/BeyondChats_Internship_assignment"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition text-sm"
          >
            GitHub Repository
          </a>
        </div>
        <p className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          This project demonstrates AI-powered content enhancement using Google Gemini,
          competitor research, and structured data storage.
        </p>
      </div>
    </footer>
  );
}
