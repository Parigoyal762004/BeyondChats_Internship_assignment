const { query } = require('../config/database');

/**
 * Create a new article
 */
const createArticle = async (title, content, author, publicationDate, sourceUrl) => {
  const sql = `
    INSERT INTO articles (title, content, author, publication_date, source_url, is_updated, scraped_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *;
  `;
  
  const result = await query(sql, [title, content, author, publicationDate, sourceUrl]);
  return result.rows[0];
};

/**
 * Get all articles with pagination
 */
const getAllArticles = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const countResult = await query('SELECT COUNT(*) FROM articles;');
  const total = parseInt(countResult.rows[0].count, 10);

  const sql = `
    SELECT a.*, 
      json_agg(json_build_object(
        'id', ar.id,
        'title', ar.reference_title,
        'url', ar.reference_url,
        'source', ar.reference_source
      )) FILTER (WHERE ar.id IS NOT NULL) as references
    FROM articles a
    LEFT JOIN article_references ar ON a.id = ar.article_id
    GROUP BY a.id
    ORDER BY a.scraped_at DESC
    LIMIT $1 OFFSET $2;
  `;
  
  const result = await query(sql, [limit, offset]);
  
  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single article by ID
 */
const getArticleById = async (id) => {
  const sql = `
    SELECT a.*, 
      json_agg(json_build_object(
        'id', ar.id,
        'title', ar.reference_title,
        'url', ar.reference_url,
        'source', ar.reference_source
      )) FILTER (WHERE ar.id IS NOT NULL) as references
    FROM articles a
    LEFT JOIN article_references ar ON a.id = ar.article_id
    WHERE a.id = $1
    GROUP BY a.id;
  `;
  
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

/**
 * Update an article
 */
const updateArticle = async (id, fields) => {
  const allowedFields = ['title', 'content', 'author', 'publication_date', 'source_url', 'is_updated'];
  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(fields)) {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(dbKey)) {
      updates.push(`${dbKey} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (updates.length === 0) return null;

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const sql = `
    UPDATE articles
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *;
  `;
  
  const result = await query(sql, values);
  return result.rows[0] || null;
};

/**
 * Delete an article
 */
const deleteArticle = async (id) => {
  const sql = 'DELETE FROM articles WHERE id = $1 RETURNING *;';
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

/**
 * Get only updated articles
 */
const getUpdatedArticles = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const countResult = await query('SELECT COUNT(*) FROM articles WHERE is_updated = true;');
  const total = parseInt(countResult.rows[0].count, 10);

  const sql = `
    SELECT a.*, 
      json_agg(json_build_object(
        'id', ar.id,
        'title', ar.reference_title,
        'url', ar.reference_url,
        'source', ar.reference_source
      )) FILTER (WHERE ar.id IS NOT NULL) as references
    FROM articles a
    LEFT JOIN article_references ar ON a.id = ar.article_id
    WHERE a.is_updated = true
    GROUP BY a.id
    ORDER BY a.updated_at DESC
    LIMIT $1 OFFSET $2;
  `;
  
  const result = await query(sql, [limit, offset]);
  
  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get only original articles
 */
const getOriginalArticles = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const countResult = await query('SELECT COUNT(*) FROM articles WHERE is_updated = false;');
  const total = parseInt(countResult.rows[0].count, 10);

  const sql = `
    SELECT a.*, 
      json_agg(json_build_object(
        'id', ar.id,
        'title', ar.reference_title,
        'url', ar.reference_url,
        'source', ar.reference_source
      )) FILTER (WHERE ar.id IS NOT NULL) as references
    FROM articles a
    LEFT JOIN article_references ar ON a.id = ar.article_id
    WHERE a.is_updated = false
    GROUP BY a.id
    ORDER BY a.scraped_at DESC
    LIMIT $1 OFFSET $2;
  `;
  
  const result = await query(sql, [limit, offset]);
  
  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Check if article URL already exists
 */
const articleExists = async (sourceUrl) => {
  const result = await query('SELECT id FROM articles WHERE source_url = $1;', [sourceUrl]);
  return result.rows.length > 0;
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getUpdatedArticles,
  getOriginalArticles,
  articleExists,
};
