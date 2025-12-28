const { getAllArticles, updateArticle, createArticle } = require('../src/services/articleService');
const { searchGoogle } = require('../src/services/googleSearchService');
const { scrapeArticleContent } = require('../src/services/contentScraperService');
const { enhanceArticleWithCompetitors } = require('../src/services/llmService');
const { storeReferences } = require('../src/services/referenceService');
const { close } = require('../src/config/database');

/**
 * Phase 2 Script: Enhance articles with AI + competitor research
 * Command: npm run enhance
 * 
 * Flow:
 * 1. Fetch all original articles
 * 2. For each article:
 *    a. Search Google for competitors
 *    b. Scrape competitor content
 *    c. Use Gemini to enhance original
 *    d. Save enhanced version to database
 *    e. Store references
 */
const enhanceArticlesPhase2 = async () => {
  try {
    console.log('\n[PHASE 2] Starting article enhancement pipeline...\n');

    // Fetch original articles
    const result = await getAllArticles(1, 100);
    const originalArticles = result.data.filter((a) => !a.is_updated);

    if (originalArticles.length === 0) {
      console.log('[PHASE 2] No original articles found. Run Phase 1 first.');
      return;
    }

    console.log(`[PHASE 2] Found ${originalArticles.length} articles to enhance\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < originalArticles.length; i++) {
      const article = originalArticles[i];
      console.log(`\n[PHASE 2] ════════════════════════════════════════`);
      console.log(`[PHASE 2] [${i + 1}/${originalArticles.length}] ${article.title}`);
      console.log('[PHASE 2] ════════════════════════════════════════');

      try {
        // Step 1: Search for competitors
        const searchResults = await searchGoogle(article.title);
        if (searchResults.length < 2) {
          console.log('[PHASE 2] ⚠ Found less than 2 competitors. Skipping.\n');
          continue;
        }

        // Step 2: Scrape top 2 competitors
        console.log('[PHASE 2] Scraping competitor articles...');
        const competitor1 = await scrapeArticleContent(searchResults[0].url);
        const competitor2 = await scrapeArticleContent(searchResults[1].url);

        if (!competitor1 || !competitor2) {
          console.log('[PHASE 2] ✗ Failed to scrape competitors\n');
          failCount++;
          continue;
        }

        console.log(`[PHASE 2] ✓ Scraped: ${searchResults[0].title}`);
        console.log(`[PHASE 2] ✓ Scraped: ${searchResults[1].title}`);

        // Step 3: Enhance with Gemini
        console.log('[PHASE 2] Enhancing with Gemini...');
        const enhancedContent = await enhanceArticleWithCompetitors(
          article,
          competitor1,
          competitor2
        );

        // Step 4: Save enhanced article
        const enhancedArticle = await createArticle(
          `${article.title} (Enhanced)`,
          enhancedContent,
          article.author,
          new Date(),
          `${article.source_url}#enhanced`
        );

        console.log(`[PHASE 2] ✓ Saved enhanced article (ID: ${enhancedArticle.id})`);

        // Step 5: Store references
        const references = [
          {
            title: searchResults[0].title,
            url: searchResults[0].url,
            source: searchResults[0].source,
          },
          {
            title: searchResults[1].title,
            url: searchResults[1].url,
            source: searchResults[1].source,
          },
        ];

        await storeReferences(enhancedArticle.id, references);
        console.log('[PHASE 2] ✓ Stored references');

        // Step 6: Mark original as having an updated version
        await updateArticle(article.id, { is_updated: true });
        console.log('[PHASE 2] ✓ Marked original as updated');

        successCount++;
      } catch (error) {
        console.error(`[PHASE 2] ✗ Error: ${error.message}\n`);
        failCount++;
      }
    }

    // Summary
    console.log('\n[PHASE 2] ════════════════════════════════════════');
    console.log('[PHASE 2] Enhancement Complete');
    console.log(`[PHASE 2] ✓ Enhanced: ${successCount}`);
    console.log(`[PHASE 2] ✗ Failed: ${failCount}`);
    console.log('[PHASE 2] ════════════════════════════════════════\n');
  } catch (error) {
    console.error('[PHASE 2] Fatal error:', error.message);
  } finally {
    await close();
    process.exit(0);
  }
};

enhanceArticlesPhase2();
