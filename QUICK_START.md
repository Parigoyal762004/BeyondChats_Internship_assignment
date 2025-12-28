# BeyondChats - Quick Start Guide (2 Minutes)

## TL;DR Setup

```bash
# 1. Clone
git clone https://github.com/Parigoyal762004/BeyondChats_Internship_assignment.git
cd BeyondChats_Internship_assignment

# 2. Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, GEMINI_API_KEY, SERPAPI_API_KEY
npm run migrate      # Create database
npm run scrape       # Phase 1: Get articles (2-3 min)
npm start            # Starts on localhost:5000

# 3. Frontend Setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm start            # Starts on localhost:3000

# 4. Enhancement (back to backend terminal)
npm run enhance      # Phase 2: AI enhancement (5-10 min)

# Done! Refresh frontend to see enhanced articles
```

---

## What You Get

1. **5 Original Articles** from BeyondChats blog
2. **5 Enhanced Articles** improved by Google Gemini
3. **10 References** to competitor sources
4. **Clean React UI** to browse everything

---

## File Overview

```
backend/          → Node.js API + scraper
frontend/         → React application  
README.md         → Full documentation
IMPLEMENTATION_SUMMARY.md → Technical details
DELIVERY_CHECKLIST.md → Verification checklist
```

---

## Commands Cheat Sheet

### Backend
```bash
npm install        # Install dependencies
npm run migrate    # Create database schema
npm run scrape     # Phase 1: Scrape articles
npm run enhance    # Phase 2: AI enhancement
npm start          # Start server
```

### Frontend
```bash
npm install        # Install dependencies
npm start          # Start dev server
npm run build      # Production build
```

---

## Ports

- **Backend API:** http://localhost:5000
- **Frontend:** http://localhost:3000
- **Health Check:** http://localhost:5000/health

---

## API Quick Test

```bash
# Get all articles
curl http://localhost:5000/api/articles

# Get only enhanced
curl http://localhost:5000/api/articles?type=updated

# Get single article
curl http://localhost:5000/api/articles/1
```

---

## Environment Variables Needed

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/beyondchats_dev
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_key_from_ai.google.dev
SERPAPI_API_KEY=your_key_from_serpapi.com
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
```

---

## Troubleshooting

**Q: Database connection fails**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npm run migrate` again

**Q: Frontend shows "Failed to load articles"**
- Backend must be running on :5000
- Check REACT_APP_API_URL in frontend/.env
- Check browser console for errors

**Q: Phase 2 (enhance) fails**
- Check GEMINI_API_KEY is valid
- Works without API keys (uses mock)
- Re-run with `npm run enhance`

**Q: Articles look broken**
- Wait for LLM to finish (slow)
- Check scraper didn't fail

---

## Next Steps

1. ✅ Run setup above
2. ✅ Open http://localhost:3000
3. ✅ Browse articles
4. ✅ Check references
5. ✅ Read full docs in README.md

---

## Key Features

✅ Scrapes real articles  
✅ Searches Google for competitors  
✅ Uses AI (Gemini) to improve content  
✅ Stores everything in PostgreSQL  
✅ Beautiful React UI  
✅ Works offline (has mock fallbacks)  
✅ Complete documentation  
✅ Clean code structure  

---

## Technology Stack

| Part | Tech |
|------|------|
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Scraper | Cheerio + Axios |
| Search | SerpAPI |
| AI | Google Gemini |
| Frontend | React + Tailwind |

---

## Deployment

**Frontend:** `vercel deploy` (Vercel)  
**Backend:** Connect GitHub repo to Railway/Render  

See README.md for detailed deployment.

---

**That's it! You now have a working AI-powered content optimizer.**

For full details: See README.md  
For technical info: See IMPLEMENTATION_SUMMARY.md  
For verification: See DELIVERY_CHECKLIST.md  
