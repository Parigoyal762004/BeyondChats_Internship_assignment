# BeyondChats Content Optimizer

A full-stack project that scrapes articles from BeyondChats, enhances them using Google Gemini AI by researching competitors, and displays results in a clean React interface.

**Live Demo:** https://frontend-k0hv3yajj-parigoyal762004s-projects.vercel.app  
**Repo:** https://github.com/Parigoyal762004/BeyondChats_Internship_assignment

---

## 🚀 What This Project Does

### Phase 1: Article Scraping & Storage
- Scrapes 5 articles from [BeyondChats blog](https://beyondchats.com/blogs/)
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

## 📋 Quick Start (2 Minutes Production, 10 Minutes Local)

### Production (Live Right Now)
**No setup needed.** Visit: https://frontend-k0hv3yajj-parigoyal762004s-projects.vercel.app
- All data hardcoded for instant load
- Works everywhere, no backend needed
- Perfect for demo/presentation

### Local Development (Full Functionality)

#### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Google Gemini API key ([Get free here](https://ai.google.dev/))
- SerpAPI key ([Get free here](https://serpapi.com/))

#### Setup

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

#### Run Enhancement (Phase 2)

In backend terminal:
```bash
npm run enhance          # Takes 5-10 minutes
```

Watch console for progress. After completion, refresh frontend to see enhanced articles with references.

---

## 🏗️ Architecture

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
[Phase 3] React Frontend (Dual Mode)
    ├─ PRODUCTION: Hardcoded data (instant, free, no backend)
    ├─ LOCAL DEV: API calls (full functionality, real scraping)
    ├─ Article List (filterable)
    ├─ Article Detail (with references)
    └─ Original vs. Enhanced Comparison
    ↓
User Sees: Clean, Responsive Interface
```

---

## 🎯 Deployment Strategy

### Why Two Modes?

**Production (Vercel):**
- Data hardcoded in `frontend/src/data/mockArticles.js`
- No backend needed
- Instant load everywhere
- Free forever
- Perfect for demos

**Local Development:**
- Full backend with database
- Real scraping and enhancement
- API endpoints
- Perfect for development and testing

### How It Works

The frontend automatically loads hardcoded data in production. To switch to API:

1. Remove mock data import
2. Uncomment API calls in `ArticlesPage.jsx`
3. Set `REACT_APP_API_URL` to your backend
4. Redeploy

Both work perfectly. No changes needed to backend.

---

## 📡 API Reference

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

## 📁 Project Structure

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
│   │   ├── enhanceArticlesPhase2.js (Phase 2 orchestration)
│   │   └── exportData.js      (export to JSON for frontend)
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/        (Header, Footer, Cards, Detail)
│   │   ├── pages/             (Home, Articles, Detail)
│   │   ├── data/              (mockArticles.js - hardcoded data)
│   │   ├── utils/             (API client)
│   │   ├── App.jsx            (routing)
│   │   └── index.js           (entry point)
│   ├── public/index.html
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
│
├── QUICK_START.md             (2-minute setup guide)
├── IMPLEMENTATION_SUMMARY.md  (detailed technical spec)
├── DELIVERY_CHECKLIST.md      (verification checklist)
└── README.md (this file)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend** | Node.js + Express | Simple, fast, great for APIs + scripts |
| **Database** | PostgreSQL | Relational structure for articles + references |
| **Scraping** | Cheerio + Axios | Lightweight, no browser overhead |
| **Search** | SerpAPI | Free tier, simple Google search API |
| **LLM** | Google Gemini | Good quality, clear pricing, no overhead |
| **Frontend** | React + Tailwind | Minimal dependencies, responsive, fast |
| **Hosting (Frontend)** | Vercel | Free, auto-deploy from GitHub |
| **Hosting (Backend)** | Render/Railway | Free tier available (with cold start) |

---

## 💡 Key Design Decisions

### Why Two Deployment Modes?
**Production:** Hardcoded data = instant, free, reliable
**Local:** Full backend = development, testing, enhancement

### Why Phase 2 is a Script?
Google searches + LLM calls are slow (30s+ per article). Running via HTTP would timeout. A background script is cleaner and resumable. You run `npm run enhance` once, data is cached.

### Why No Authentication?
Assignment doesn't require multi-user system. This is a demonstration project.

### Why Cheerio Instead of Puppeteer?
Lighter, faster, no browser overhead. Works for most modern websites.

### Why Tailwind, Not Material-UI?
Keeps dependencies minimal. Tailwind is flexible and sufficient.

---

## ✅ What's Included

- ✅ **8 articles** (5 original, 3 enhanced) with real data
- ✅ **Full scraper** working (SSL certificate fix included)
- ✅ **AI enhancement** with Gemini API integration
- ✅ **Reference management** - competitor sources stored and displayed
- ✅ **REST API** - complete CRUD endpoints
- ✅ **React frontend** - responsive, production-ready
- ✅ **Database** - PostgreSQL with proper schema
- ✅ **Error handling** - graceful fallbacks throughout
- ✅ **Production deployment** - hardcoded data for instant load
- ✅ **Documentation** - comprehensive READMEs at every level

---

## 🧪 Testing Workflow

### 1. Test Production (No Setup)
```
Visit: https://frontend-k0hv3yajj-parigoyal762004s-projects.vercel.app
```
✓ See 8 articles instantly
✓ Filter works
✓ Article detail works
✓ References display

### 2. Test Local Backend
```bash
npm run migrate    # Creates database
npm start          # Start API
# Curl http://localhost:5000/health
```
✓ API responds

### 3. Test Phase 1 (Scraping)
```bash
npm run scrape
```
✓ 5 articles appear in database
✓ Can fetch via GET /api/articles

### 4. Test React Frontend
```bash
npm start
```
✓ Home page loads
✓ Click "Explore Articles"
✓ See articles displayed

### 5. Test Phase 2 (Enhancement)
```bash
npm run enhance
```
✓ Watch console for "SEARCH", "SCRAPING", "GEMINI", "SAVED"
✓ Takes 5-10 minutes
✓ Enhanced articles appear in database

---

## 🐛 Troubleshooting

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
- Check SerpAPI key is valid
- Re-run `npm run enhance` - it's resumable

### SSL Certificate Error (Scraper)
- Already fixed in `scraperService.js` (uses `beyondchats.com` not `www.beyondchats.com`)
- Run `npm run scrape` again

### Articles look broken
- Wait for Gemini response (30s per article)
- Check article content isn't all HTML

---

## 🚢 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ✅ Live | https://frontend-k0hv3yajj-parigoyal762004s-projects.vercel.app |
| **Backend** | ✅ Running | https://beyondchats-backend-5my9.onrender.com |
| **Database** | ✅ Connected | Prisma Cloud PostgreSQL |

---

## 📚 Documentation

- **QUICK_START.md** - 2-minute setup for impatient people
- **IMPLEMENTATION_SUMMARY.md** - 600+ lines of technical details
- **DELIVERY_CHECKLIST.md** - Verification of all requirements
- **backend/README.md** - Backend API & architecture
- **frontend/README.md** - Frontend setup & features

---

## 🎓 What You Can Do With This

**Immediately:**
- Visit live demo
- See hardcoded articles
- Test filtering and detail pages
- Show to anyone (no setup needed)

**With 10 minutes setup:**
- Run full scraper locally
- Enhance articles with Gemini
- Test backend API
- Modify and experiment
- Redeploy with your own data

**For production:**
- Swap hardcoded data with your own
- Keep backend for continuous scraping
- Use Render/Railway for backend hosting
- Deploy frontend to Vercel

---

## 💭 Philosophy

This project follows:
- **No unnecessary complexity** - Only what's required
- **No feature bloat** - No dark mode, no admin panel, no TBD features
- **Production-ready code** - Error handling, logging, graceful degradation
- **Clear documentation** - Every design decision explained
- **Clean git history** - Atomic commits showing progression
- **Faster iteration** - Hardcoded production data means instant demos

---

## 👤 Built by
**Pari Goyal** - January 2025

---

**Ready to use. Deploy now. Impress people.**
