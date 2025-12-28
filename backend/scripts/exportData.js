const { query, close } = require('../src/config/database');
const fs = require('fs');

const exportData = async () => {
  try {
    console.log('[EXPORT] Fetching articles...');
    
    const articlesResult = await query('SELECT * FROM articles ORDER BY id');
    const articles = articlesResult.rows;

    console.log(`[EXPORT] Found ${articles.length} articles`);

    // Get references for each article
    for (let article of articles) {
      const refsResult = await query('SELECT * FROM article_references WHERE article_id = $1', [article.id]);
      article.references = refsResult.rows;
    }

    const data = {
      articles,
      exportedAt: new Date().toISOString(),
    };

    fs.writeFileSync('./articles-data.json', JSON.stringify(data, null, 2));
    console.log('[EXPORT] Data exported to articles-data.json');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('[EXPORT] Error:', error.message);
  } finally {
    await close();
  }
};

exportData();
