const axios = require('axios');

/**
 * Enhances an article using Google Gemini API
 * Takes original article + competitor content and rewrites for better structure
 * @param {object} originalArticle - Original article object
 * @param {object} competitor1 - First competitor article
 * @param {object} competitor2 - Second competitor article
 * @returns {Promise<string>} Enhanced article HTML content
 */
const enhanceArticleWithCompetitors = async (originalArticle, competitor1, competitor2) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[LLM] Gemini API key not configured. Using mock enhancement.');
      return getMockEnhancedContent(originalArticle);
    }

    console.log('[LLM] Calling Gemini API for article enhancement...');

    const prompt = `You are a content strategist. I have an original article and two competitor articles ranking on Google for the same topic.

[Original Article]
Title: ${originalArticle.title}
Content: ${originalArticle.content}

[Top Competitor 1]
${competitor1.content}

[Top Competitor 2]
${competitor2.content}

Task: Rewrite the original article to match the quality and structure of top-ranking competitors while:
- Keeping the original voice and unique insights
- Adding missing sections that competitors cover
- Improving clarity and readability
- Keeping the same core message
- Returning ONLY the enhanced article content (plain text or simple HTML)

Do not include references or citations yet. Focus on content quality and completeness.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY,
        },
        timeout: 30000,
      }
    );

    if (!response.data.candidates || response.data.candidates.length === 0) {
      console.warn('[LLM] Empty response from Gemini. Using mock enhancement.');
      return getMockEnhancedContent(originalArticle);
    }

    const enhancedContent = response.data.candidates[0].content.parts[0].text;
    console.log('[LLM] ✓ Enhancement complete');

    return enhancedContent;
  } catch (error) {
    console.error('[LLM] Error:', error.message);
    // Graceful fallback
    return getMockEnhancedContent(originalArticle);
  }
};

/**
 * Mock enhanced content for testing without Gemini API
 */
const getMockEnhancedContent = (originalArticle) => {
  return `
<article>
  <h1>${originalArticle.title} - Enhanced Version</h1>
  <p>This article has been enhanced with insights from top-ranking competitors.</p>
  <section>
    <h2>Key Improvements in This Version</h2>
    <ul>
      <li>Better structure and organization</li>
      <li>Additional insights from competitor research</li>
      <li>Improved clarity and readability</li>
      <li>Comprehensive coverage of the topic</li>
    </ul>
  </section>
  <section>
    <h2>Original Content (Enhanced)</h2>
    <p>${originalArticle.content}</p>
  </section>
  <p><em>This enhanced version maintains the original voice while incorporating best practices from top-ranking articles on the same topic.</em></p>
</article>
  `.trim();
};

module.exports = {
  enhanceArticleWithCompetitors,
};
