const { query, close } = require('../src/config/database');

/**
 * Database migration script
 * Creates tables for articles and article_references
 */
const migrate = async () => {
  try {
    console.log('[MIGRATE] Starting database setup...');

    // Create articles table
    await query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255),
        publication_date TIMESTAMP,
        source_url VARCHAR(500) UNIQUE NOT NULL,
        is_updated BOOLEAN DEFAULT FALSE,
        scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[MIGRATE] ✓ articles table created');

    // Create article_references table
    await query(`
      CREATE TABLE IF NOT EXISTS article_references (
        id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(id) ON DELETE CASCADE,
        reference_title VARCHAR(500),
        reference_url VARCHAR(500),
        reference_source VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[MIGRATE] ✓ article_references table created');

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(source_url);
    `);
    console.log('[MIGRATE] ✓ index on source_url created');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_articles_updated ON articles(is_updated);
    `);
    console.log('[MIGRATE] ✓ index on is_updated created');

    console.log('[MIGRATE] Database setup complete!');
  } catch (error) {
    console.error('[MIGRATE] Error:', error.message);
  } finally {
    await close();
  }
};

migrate();
