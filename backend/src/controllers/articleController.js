const articleService = require('../services/articleService');

/**
 * GET /api/articles - Get all articles with optional filtering
 */
const getArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type = null } = req.query;

    let result;
    if (type === 'updated') {
      result = await articleService.getUpdatedArticles(parseInt(page), parseInt(limit));
    } else if (type === 'original') {
      result = await articleService.getOriginalArticles(parseInt(page), parseInt(limit));
    } else {
      result = await articleService.getAllArticles(parseInt(page), parseInt(limit));
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/articles/:id - Get a single article
 */
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await articleService.getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/articles - Create a new article
 */
const createArticle = async (req, res, next) => {
  try {
    const { title, content, author, publicationDate, sourceUrl } = req.body;

    // Validation
    if (!title || !content || !sourceUrl) {
      return res.status(400).json({ error: 'Missing required fields: title, content, sourceUrl' });
    }

    // Check for duplicates
    const exists = await articleService.articleExists(sourceUrl);
    if (exists) {
      return res.status(409).json({ error: 'Article with this URL already exists' });
    }

    const article = await articleService.createArticle(
      title,
      content,
      author || 'Unknown',
      publicationDate || new Date(),
      sourceUrl
    );

    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/articles/:id - Update an article
 */
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if article exists
    const article = await articleService.getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const updated = await articleService.updateArticle(id, updates);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/articles/:id - Delete an article
 */
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await articleService.getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await articleService.deleteArticle(id);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
