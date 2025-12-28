const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetches and parses the BeyondChats blog homepage
 * Extracts article metadata from the listing page
 * @returns {Promise<array>} Array of article objects with title, URL, date
 */
const fetchArticlesFromBeyondChats = async () => {
  try {
    console.log('[SCRAPER] Fetching BeyondChats blog...');
    
    const response = await axios.get('https://www.beyondchats.com/blogs/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const articles = [];

    // Parse article cards from the blog listing
    // Selector varies by page structure - we extract what we can find
    const articleElements = $('article, .blog-card, [data-article], .post-item');

    articleElements.each((index, element) => {
      try {
        const $el = $(element);
        
        // Try multiple selectors for title
        let title = $el.find('h2, h3, .title, [data-title]').first().text().trim();
        title = title || $el.find('a').first().text().trim();

        // Try multiple selectors for URL
        let url = $el.find('a').attr('href') || '';
        if (url && !url.startsWith('http')) {
          url = new URL(url, 'https://www.beyondchats.com').href;
        }

        // Try to extract date
        const dateText = $el.find('time, .date, [data-date]').text().trim() 
          || $el.find('.meta, .published').text().trim();

        // Extract snippet as preview
        const snippet = $el.find('p, .excerpt, .description').first().text().trim();

        if (title && url && url.includes('beyondchats.com')) {
          articles.push({
            title,
            url,
            date: dateText || null,
            snippet: snippet || null,
          });
        }
      } catch (err) {
        console.error('[SCRAPER] Error parsing article element:', err.message);
      }
    });

    console.log(`[SCRAPER] Found ${articles.length} articles`);
    
    // Return the last 5 articles (oldest first)
    return articles.slice(-5).reverse();
  } catch (error) {
    console.error('[SCRAPER] Error fetching BeyondChats:', error.message);
    // Fail gracefully - return empty array instead of crashing
    return [];
  }
};

/**
 * Fetches the full content of a single article
 * @param {string} url - Article URL
 * @returns {Promise<object>} Article content object
 */
const fetchArticleContent = async (url) => {
  try {
    console.log(`[SCRAPER] Fetching content from ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Extract title
    let title = $('h1').first().text().trim() 
      || $('meta[property="og:title"]').attr('content')
      || 'Untitled';

    // Extract author
    const author = $('[data-author], .author-name, .by-author').text().trim() 
      || $('meta[name="author"]').attr('content')
      || 'Unknown Author';

    // Extract publication date
    const pubDate = $('meta[property="article:published_time"]').attr('content')
      || $('time').attr('datetime')
      || $('[data-publish-date]').text()
      || null;

    // Extract main content - try multiple selectors
    let content = '';
    const contentSelectors = [
      'article',
      '[data-content]',
      'main',
      '.post-content',
      '.article-body',
      '.entry-content',
    ];

    for (const selector of contentSelectors) {
      const el = $(selector).first();
      if (el.length > 0) {
        content = el.html() || '';
        break;
      }
    }

    // If still no content, try to get all paragraphs
    if (!content) {
      const paragraphs = $('p').slice(0, 20).map((i, el) => $(el).html()).get();
      content = `<div>${paragraphs.join('</p><p>')}</div>`;
    }

    // Extract plain text and limit to first 2000 chars
    const plainText = $(content).text().substring(0, 2000);

    return {
      title: title.substring(0, 500),
      author: author.substring(0, 255),
      publicationDate: pubDate,
      content: content.substring(0, 10000), // Limit HTML size
      plainText,
      sourceUrl: url,
    };
  } catch (error) {
    console.error(`[SCRAPER] Error fetching article content: ${error.message}`);
    return null;
  }
};

module.exports = {
  fetchArticlesFromBeyondChats,
  fetchArticleContent,
};
