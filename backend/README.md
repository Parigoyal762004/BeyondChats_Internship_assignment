# BeyondChats Backend API

Node.js + Express API for scraping BeyondChats articles, managing them in PostgreSQL, and orchestrating AI enhancement via Gemini.

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Gemini API key (from Google AI)
- SerpAPI key (optional, for Google Search)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and update with your keys
cp .env.example .env

# Run database migrations
npm run migrate

# Start the server
npm start
```

Server runs on `http://localhost:5000`

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/beyondchats_dev
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_API_KEY=your_serpapi_key
```

## API Endpoints

### Articles

**GET /api/articles** - Get all articles (paginated)
```bash
curl "http://localhost:5000/api/articles?page=1&limit=10"
```

**GET /api/articles?type=updated** - Get only updated articles
```bash
curl "http://localhost:5000/api/articles?type=updated"
```

**GET /api/articles/:id** - Get single article
```bash
curl "http://localhost:5000/api/articles/1"
```

**POST /api/articles** - Create article
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Title",
    "content": "<p>Content here</p>",
    "author": "Jane Doe",
    "publicationDate": "2025-01-15T10:00:00Z",
    "sourceUrl": "https://example.com/article"
  }'
```

**PUT /api/articles/:id** - Update article
```bash
curl -X PUT http://localhost:5000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title"}'
```

**DELETE /api/articles/:id** - Delete article
```bash
curl -X DELETE http://localhost:5000/api/articles/1
```

## Running the Phases

### Phase 1: Initial Scrape

Scrapes 5 articles from BeyondChats blog and stores in database:

```bash
npm run scrape
```

### Phase 2: AI Enhancement

Searches Google for competitors, scrapes them, and uses Gemini to enhance each article:

```bash
npm run enhance
```

This takes 5-10 minutes depending on article count. Watch the console for progress.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   └── articleController.js # Route handlers
│   ├── routes/
│   │   └── articleRoutes.js     # Express routes
│   ├── services/
│   │   ├── scraperService.js              # Scrape articles
│   │   ├── articleService.js              # CRUD operations
│   │   ├── googleSearchService.js         # Google search
│   │   ├── contentScraperService.js       # Scrape competitor content
│   │   ├── llmService.js                  # Gemini API integration
│   │   └── referenceService.js            # Store references
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handler
│   └── index.js                 # Express app setup
├── scripts/
│   ├── migrate.js       # Database setup
│   ├── scrapePhase1.js  # Phase 1 orchestration
│   └── enhanceArticlesPhase2.js # Phase 2 orchestration
├── .env.example
├── package.json
└── README.md
```

## Database Schema

### articles
- `id` - Primary key
- `title` - Article title
- `content` - HTML content
- `author` - Author name
- `publication_date` - When published
- `source_url` - Original URL (unique)
- `is_updated` - Whether this is an enhanced version
- `scraped_at` - Timestamp of scraping
- `updated_at` - Last update timestamp

### article_references
- `id` - Primary key
- `article_id` - Foreign key to articles
- `reference_title` - Competitor article title
- `reference_url` - Competitor article URL
- `reference_source` - Domain of competitor
- `created_at` - Timestamp

## Error Handling

All errors return structured JSON:

```json
{
  "error": {
    "message": "Article not found",
    "code": "NOT_FOUND",
    "timestamp": "2025-01-15T10:30:45.123Z"
  }
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `404` - Not found
- `409` - Conflict (duplicate)
- `500` - Server error

## Development

Run with nodemon (auto-restart on file changes):

```bash
npm install -D nodemon
npx nodemon src/index.js
```

Check logs for request timing and database queries.
