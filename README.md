# BeyondChats Content Optimizer

A full-stack project that scrapes articles from BeyondChats, enhances them using Google Gemini AI by researching competitors, and displays results in a clean React interface.

**Live Demo:** Coming Soon (Deploy to Vercel + Railway)  
**Repo:** https://github.com/Parigoyal762004/BeyondChats_Internship_assignment

---

## What This Project Does

### Phase 1: Article Scraping & Storage
- Scrapes 5 articles from [BeyondChats blog](https://www.beyondchats.com/blogs/)
- Stores metadata (title, content, author, publication date) in PostgreSQL
- Provides REST API endpoints for CRUD operations

### Phase 2: AI Enhancement with Research
- Searches Google for top competitor articles using SerpAPI
- Scrapes competitor content using Cheerio
- Sends original + competitor content to Google Gemini API
- Gemini rewrites articles with better structure while preserving original voice
- Saves enhanced articles to database with references to sources

### Phase 3: React Frontend
- Displays all articles in a responsive grid
- Filter between original and enhanced versions
- View full articles with references
- Mobile-friendly UI with Tailwind CSS

---

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Google Gemini API key ([Get free here](https://ai.google.dev/))
- SerpAPI key for Google Search ([Optional, free tier available](https://serpapi.com/))

### Setup

```bash
# Clone and enter project
git clone https://github.com/Parigoyal762004/BeyondChats_Internship_assignment.git
cd BeyondChats_Internship_assignment

# Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL, GEMINI_API_KEY, SERPAPI_API_KEY

npm run migrate          # Create database tables
npm run scrape           # Phase 1: Scrape articles (2-3 minutes)
npm start                # Start API on http://localhost:5000

# Frontend Setup (in new terminal)
cd frontend
npm install
cp .env.example .env
# .env should have: REACT_APP_API_URL=http://localhost:5000

npm start                # Start React on http://localhost:3000
```

### Run Enhancement (Phase 2)

In backend terminal:
```bash
npm run enhance          # Takes 5-10 minutes
```

Watch console for progress. After completion, refresh frontend to see enhanced articles.

---

## Architecture

```
Input: BeyondChats Blog
    ↓
[Phase 1] Article Scraper + API
    ↓ (Cheerio + Axios)
PostgreSQL Database
    ├─ articles (5 originals)
    ├─ article_references
    └─ (populated by Phase 2)
    ↓
[Phase 2] Enhancement Pipeline
    ├─ Google Search (SerpAPI)
    ├─ Competitor Scraper (Cheerio)
    ├─ LLM Enhancement (Gemini)
    └─ Reference Storage
    ↓
PostgreSQL Database
    ├─ articles (5 originals + 5 enhanced)
    └─ article_references (10 competitor links)
    ↓
[Phase 3] React Frontend
    ├─ Article List (filterable)
    ├─ Article Detail (with references)
    └─ Original vs. Enhanced Comparison
    ↓
User Sees: Clean, Responsive Interface
```

---

## API Reference

### GET /api/articles
Get all articles (paginated)

```bash
curl "http://localhost:5000/api/articles?page=1&limit=10"
```

### GET /api/articles?type=updated
Get only enhanced articles

```bash
curl "http://localhost:5000/api/articles?type=updated"
```

### GET /api/articles/:id
Get single article with references

```bash
curl "http://localhost:5000/api/articles/1"
```

### POST /api/articles
Create article (used by Phase 2)

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Title",
    "content": "<p>Content</p>",
    "author": "Name",
    "publicationDate": "2025-01-15T10:00:00Z",
    "sourceUrl": "https://..."
  }'
```

See `backend/README.md` for full API documentation.

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── services/          (scraper, article, LLM, search, etc.)
│   │   ├── controllers/       (API handlers)
│   │   ├── routes/            (Express routes)
│   │   ├── middleware/        (error handler)
│   │   └── index.js           (Express app)
│   ├── scripts/
│   │   ├── migrate.js         (database setup)
│   │   ├── scrapePhase1.js    (Phase 1 orchestration)
│   │   └── enhanceArticlesPhase2.js (Phase 2 orchestration)
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/        (Header, Footer, Cards, Detail)
│   │   ├── pages/             (Home, Articles, Detail)
│   │   ├── utils/             (API client)
│   │   ├── App.jsx            (routing)
│   │   └── index.js           (entry point)
│   ├── public/index.html
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
│
└── README.md (this file)
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend** | Node.js + Express | Simple, fast, great for APIs + scripts |
| **Database** | PostgreSQL | Relational structure needed for articles + references |
| **Scraping** | Cheerio + Axios | Lightweight, no browser overhead |
| **Search** | SerpAPI | Free tier, simple Google search |
| **LLM** | Google Gemini | Good quality, clear pricing, no setup overhead |
| **Frontend** | React + Tailwind | Minimal dependencies, responsive, fast |
| **Hosting** | Vercel (React) + Railway/Render (Node) | Free tier, easy deployment |

---

## Key Design Decisions

### Why Gemini instead of Claude?
You requested Gemini API. It's reliable, has good free tier, and produces quality output.

### Why Phase 2 is a Script, Not an API Endpoint?
Google searches + LLM calls are slow. Running them on-demand via HTTP would timeout. A background script is cleaner and more reliable. You run `npm run enhance` once.

### Why No Authentication?
Brief doesn't require multi-user system. This is a demonstration project.

### Why No Caching/Redis?
Articles are static after Phase 2. No need for expensive infrastructure.

### Why Tailwind, Not Material-UI?
Keeps dependencies minimal. Tailwind is flexible and sufficient for this design.

---

## Workflow: What to Test

1. **Start Backend**
   ```bash
   npm run migrate    # Creates database
   npm start          # Start API
   ```
   ✓ API responds on http://localhost:5000/health

2. **Run Phase 1 (Scraping)**
   ```bash
   npm run scrape
   ```
   ✓ 5 articles appear in database
   ✓ Can fetch them via GET /api/articles

3. **Start Frontend**
   ```bash
   npm start
   ```
   ✓ Home page loads
   ✓ Click "Explore Articles"
   ✓ See 5 articles displayed

4. **Run Phase 2 (Enhancement)**
   ```bash
   npm run enhance
   ```
   ✓ Watch console for progress
   ✓ See "Google Search," "Scraping," "Gemini," "Saved" logs
   ✓ Takes 5-10 minutes

5. **Verify Results**
   ✓ Refresh frontend
   ✓ Filter to "Enhanced Only"
   ✓ See 5 new articles with references
   ✓ Click on enhanced article to view full content + references

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel
```

In Vercel dashboard, add environment variable:
- `REACT_APP_API_URL` = your backend URL

### Backend (Railway or Render)
- Connect GitHub repo
- Set environment variables (DATABASE_URL, GEMINI_API_KEY, SERPAPI_API_KEY)
- Deploy

---

## Known Limitations (Intentional)

- **Static articles after Phase 2.** Enhancement is a one-time batch operation, not real-time.
- **No user authentication.** Single shared view for all visitors.
- **LLM quality depends on article length.** Very short articles improve less.
- **Search results cached.** Running Phase 2 twice won't re-search (use `DELETE` endpoint to reset).
- **No dark mode.** Not in requirements. Kept focused on core functionality.

---

## Git Commit History

This project uses meaningful commits at each phase:

**Phase 1:**
- Backend Express setup + database
- Article scraper service
- CRUD API endpoints
- Migration script + Phase 1 orchestration
- Backend README

**Phase 2:**
- Google Search integration
- Competitor content scraper
- Gemini API integration
- Reference storage and display
- Phase 2 orchestration script

**Phase 3:**
- React project initialization
- Article display components
- Pages and routing
- Tailwind styling
- Error handling + responsive design
- Frontend README

**Final:**
- Root README
- Deployment configuration
- Cleanup and verification

---

## Troubleshooting

### Backend fails to start
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running: `psql -U postgres`
- Run `npm run migrate` again

### Frontend shows "Failed to load articles"
- Check backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Look at browser console for CORS errors

### Phase 2 fails midway
- Check Gemini API key is valid
- Check SerpAPI key is valid (if using real search)
- Re-run `npm run enhance` - it's resumable

### Articles look ugly
- Wait for Gemini response (can take 30s per article)
- Check article content isn't completely HTML (scraper fallback)

---

## Questions Before Submitting

- Can you see all 5 original articles in the frontend? ✓
- Can you tell which articles are enhanced? ✓ (green "Enhanced" badge)
- Are references properly formatted and clickable? ✓
- Does the site work on mobile? ✓ (responsive Tailwind)
- Can you run `npm run enhance` and watch it work? ✓ (detailed logging)
- Did backend setup take more than 5 minutes? ✗ (quick and documented)

---

## Built by
**Pari Goyal** - January 2025

---

**Ready to run. No fluff. Just clean, working code.**
