const axios = require('axios');

/**
 * Searches Google using SerpAPI
 * Free tier includes 100 searches/month
 * @param {string} query - Search query
 * @returns {Promise<array>} Top 10 search results
 */
const searchGoogle = async (query) => {
  try {
    if (!process.env.SERPAPI_API_KEY) {
      console.warn('[SEARCH] SerpAPI key not configured. Returning mock results.');
      return getMockResults(query);
    }

    console.log(`[SEARCH] Searching for: "${query}"`);

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: process.env.SERPAPI_API_KEY,
        num: 10,
        type: 'search',
      },
      timeout: 15000,
    });

    // Filter out non-article sources (Wikipedia, Reddit, PDFs, etc.)
    const organicResults = response.data.organic_results || [];
    const filteredResults = organicResults
      .filter((result) => {
        const url = result.link || '';
        const excludedDomains = ['wikipedia.org', 'reddit.com', 'youtube.com'];
        const isPdf = url.endsWith('.pdf');
        
        return !isPdf && !excludedDomains.some((domain) => url.includes(domain));
      })
      .slice(0, 10)
      .map((result) => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet,
        source: new URL(result.link).hostname,
      }));

    console.log(`[SEARCH] Found ${filteredResults.length} relevant results`);
    return filteredResults;
  } catch (error) {
    console.error('[SEARCH] Error:', error.message);
    return [];
  }
};

/**
 * Mock search results for testing without SerpAPI
 */
const getMockResults = (query) => {
  return [
    {
      title: `Complete Guide to ${query}`,
      url: 'https://example.com/guide-1',
      snippet: `A comprehensive guide about ${query}...`,
      source: 'example.com',
    },
    {
      title: `${query}: Best Practices`,
      url: 'https://blog.example.com/best-practices',
      snippet: `Learn the best practices for ${query}...`,
      source: 'blog.example.com',
    },
  ];
};

module.exports = {
  searchGoogle,
};
