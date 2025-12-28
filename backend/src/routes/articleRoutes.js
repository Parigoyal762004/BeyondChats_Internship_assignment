const express = require('express');
const controller = require('../controllers/articleController');

const router = express.Router();

/**
 * Article Routes
 * GET    /api/articles          - Get all articles (paginated, filterable)
 * GET    /api/articles/:id      - Get a single article
 * POST   /api/articles          - Create a new article
 * PUT    /api/articles/:id      - Update an article
 * DELETE /api/articles/:id      - Delete an article
 */

router.get('/', controller.getArticles);
router.get('/:id', controller.getArticleById);
router.post('/', controller.createArticle);
router.put('/:id', controller.updateArticle);
router.delete('/:id', controller.deleteArticle);

module.exports = router;
