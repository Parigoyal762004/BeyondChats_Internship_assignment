const { fetchArticlesFromBeyondChats, fetchArticleContent } = require('../src/services/scraperService');
const { createArticle, articleExists } = require('../src/services/articleService');
const { close } = require('../src/config/database');

/**
 * Phase 1 Script: Scrape initial 5 articles from BeyondChats
 * Command: npm run scrape
 */
const scrapePhase1 = async () => {
  try {
    console.log('\n[PHASE 1] Starting initial article scrape...\n');

    // Step 1: Fetch article listings
    const articleListings = await fetchArticlesFromBeyondChats();
    
    if (articleListings.length === 0) {
      console.log('[PHASE 1] No articles found on BeyondChats. Page structure may have changed.');
      return;
    }

    console.log(`[PHASE 1] Found ${articleListings.length} articles to process\n`);

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    // Step 2: Fetch full content for each article
    for (let i = 0; i < articleListings.length; i++) {
      const listing = articleListings[i];
      console.log(`[PHASE 1] Processing [${i + 1}/${articleListings.length}] ${listing.title}`);

      try {
        // Check if article already exists
        const exists = await articleExists(listing.url);
        if (exists) {
          console.log(`  → Skipped (already in database)\n`);
          skipCount++;
          continue;
        }

        // Fetch full content
        const articleContent = await fetchArticleContent(listing.url);
        
        if (!articleContent) {
          console.log(`  → Failed to fetch content\n`);
          failCount++;
          continue;
        }

        // Save to database
        const article = await createArticle(
          articleContent.title,
          articleContent.content,
          articleContent.author,
          articleContent.publicationDate,
          articleContent.sourceUrl
        );

        console.log(`  → Saved (ID: ${article.id})\n`);
        successCount++;
      } catch (err) {
        console.error(`  → Error: ${err.message}\n`);
        failCount++;
      }
    }

    // Summary
    console.log('\n[PHASE 1] ═════════════════════════════════════════');
    console.log(`[PHASE 1] Scrape Complete`);
    console.log(`[PHASE 1] ✓ Inserted: ${successCount}`);
    console.log(`[PHASE 1] ⊘ Skipped: ${skipCount}`);
    console.log(`[PHASE 1] ✗ Failed: ${failCount}`);
    console.log('[PHASE 1] ═════════════════════════════════════════\n');
  } catch (error) {
    console.error('[PHASE 1] Fatal error:', error.message);
  } finally {
    await close();
    process.exit(0);
  }
};

scrapePhase1();
