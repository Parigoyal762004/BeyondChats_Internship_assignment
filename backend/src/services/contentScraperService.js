const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes article content from a URL
 * Extracts main text content using various heuristics
 * @param {string} url - Article URL
 * @returns {Promise<object>} Content object with title, author, content
 */
const scrapeArticleContent = async (url) => {
  try {
    console.log(`[CONTENT-SCRAPER] Fetching ${url}`);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style, noscript').remove();

    // Extract title
    let title = $('h1').first().text().trim()
      || $('meta[property="og:title"]').attr('content')
      || $('title').text().trim()
      || 'Untitled';

    // Extract author
    let author = $('[rel="author"]').text().trim()
      || $('.author-name, .by-author, [data-author]').first().text().trim()
      || $('meta[name="author"]').attr('content')
      || 'Unknown';

    // Try to extract main content
    let content = '';
    const contentSelectors = ['article', '[role="main"]', 'main', '.post-content', '.article-body', '.entry-content'];

    for (const selector of contentSelectors) {
      const el = $(selector).first();
      if (el.length > 0) {
        content = el.text();
        if (content.length > 200) break;
      }
    }

    // Fallback: collect all paragraphs
    if (!content || content.length < 200) {
      const paragraphs = $('p').map((i, el) => $(el).text()).get();
      content = paragraphs.join('\n\n');
    }

    // Limit content to first 2000 characters
    const plainText = content.substring(0, 2000).trim();

    return {
      title: title.substring(0, 500),
      author: author.substring(0, 255),
      content: plainText,
      source: new URL(url).hostname,
    };
  } catch (error) {
    console.error(`[CONTENT-SCRAPER] Error: ${error.message}`);
    return null;
  }
};

module.exports = {
  scrapeArticleContent,
};
