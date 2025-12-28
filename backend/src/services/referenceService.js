const { query } = require('../config/database');

/**
 * Stores references for an article
 * @param {number} articleId - Article ID
 * @param {array} references - Array of reference objects
 */
const storeReferences = async (articleId, references) => {
  try {
    for (const ref of references) {
      await query(
        `INSERT INTO article_references (article_id, reference_title, reference_url, reference_source)
         VALUES ($1, $2, $3, $4);`,
        [articleId, ref.title, ref.url, ref.source]
      );
    }
    console.log(`[REFERENCES] Stored ${references.length} references for article ${articleId}`);
  } catch (error) {
    console.error('[REFERENCES] Error storing references:', error.message);
    throw error;
  }
};

/**
 * Retrieves references for an article
 * @param {number} articleId - Article ID
 * @returns {Promise<array>} Array of reference objects
 */
const getReferences = async (articleId) => {
  try {
    const result = await query(
      `SELECT reference_title as title, reference_url as url, reference_source as source
       FROM article_references
       WHERE article_id = $1
       ORDER BY created_at ASC;`,
      [articleId]
    );
    return result.rows;
  } catch (error) {
    console.error('[REFERENCES] Error fetching references:', error.message);
    return [];
  }
};

/**
 * Formats references as HTML
 * @param {array} references - Array of reference objects
 * @returns {string} HTML string
 */
const formatReferencesHtml = (references) => {
  if (!references || references.length === 0) {
    return '';
  }

  const referencesList = references
    .map((ref, index) => `<li><a href="${ref.url}" target="_blank">[${index + 1}] ${ref.title} - ${ref.source}</a></li>`)
    .join('\n');

  return `
<section class="references">
  <h3>References</h3>
  <ol>
    ${referencesList}
  </ol>
</section>
  `.trim();
};

module.exports = {
  storeReferences,
  getReferences,
  formatReferencesHtml,
};
