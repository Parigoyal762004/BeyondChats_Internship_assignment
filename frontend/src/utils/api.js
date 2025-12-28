import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
});

/**
 * Fetch all articles with pagination
 */
export const fetchArticles = async (page = 1, limit = 10, type = null) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (type) params.append('type', type);
    
    const response = await api.get(`/articles?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * Fetch a single article by ID
 */
export const fetchArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch only updated articles
 */
export const fetchUpdatedArticles = async (page = 1, limit = 10) => {
  return fetchArticles(page, limit, 'updated');
};

/**
 * Fetch only original articles
 */
export const fetchOriginalArticles = async (page = 1, limit = 10) => {
  return fetchArticles(page, limit, 'original');
};

/**
 * Delete an article
 */
export const deleteArticle = async (id) => {
  try {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error);
    throw error;
  }
};
