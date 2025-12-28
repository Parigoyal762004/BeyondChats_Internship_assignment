# BeyondChats Frontend

React + Tailwind CSS frontend for viewing and comparing original vs. AI-enhanced articles.

## Prerequisites

- Node.js 18+
- Backend running on `http://localhost:5000`

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000
```

## Features

- **Article List**: Browse all articles with filtering (Original/Updated)
- **Article Detail**: Read full articles with references
- **Responsive Design**: Works on mobile, tablet, desktop
- **Original vs. Enhanced**: Toggle between versions for updated articles
- **References**: View sources used for enhancement

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Footer.jsx           # Footer with links
│   │   ├── ArticleCard.jsx      # Article list card
│   │   ├── ArticleDetail.jsx    # Full article display
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   └── ErrorBoundary.jsx    # Error handling
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── ArticlesPage.jsx     # Article listing
│   │   └── ArticleDetailPage.jsx # Article detail
│   ├── utils/
│   │   └── api.js               # API client
│   ├── App.jsx                  # Main app component
│   ├── index.js                 # React entry point
│   └── index.css                # Tailwind styles
├── public/
│   └── index.html               # HTML template
├── tailwind.config.js           # Tailwind config
├── postcss.config.js            # PostCSS config
├── package.json
└── README.md
```

## Build

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

In Vercel dashboard:
1. Add environment variable: `REACT_APP_API_URL`
2. Set to your backend API URL

## API Integration

All API calls go through `src/utils/api.js`. Update `REACT_APP_API_URL` to point to your backend.

## Styling

Uses Tailwind CSS with utility classes. No custom CSS needed for most components.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
