import { Product, Category } from '../../../models/product.js';
import { Op } from 'sequelize';
import { elasticClient } from '../../config/elastic.js';
import { queueElasticSync } from './product.utils.js';
import { CacheService } from '../cache/cache.service.js';

// Cache invalidation helper
const invalidateProductCache = async (productId) => {
    await Promise.all([
        CacheService.invalidatePattern('products:*'),
        CacheService.invalidatePattern(`product:*/products/${productId}`),
        CacheService.invalidatePattern('categories:*'),
        CacheService.invalidatePattern('search:*')
    ]);
};

// List all products with optional filtering
export const getProducts = async (req, res) => {
  try {
    const { 
      category,
      minPrice,
      maxPrice,
      status = 'available',
      page = 1,
      limit = 10,
      sortBy = 'name',
      order = 'ASC'
    } = req.query;

    const where = { status };
    if (category) {
      const categoryObj = await Category.findOne({ where: { name: category } });
      if (categoryObj) {
        where.categoryId = categoryObj.id;
      }
    }

    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ 
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      offset,
      limit: parseInt(limit),
      order: [[sortBy, order]]
    });

    // Transform the data to match frontend expectations
    const products = rows.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.image || '/assets/placeholder.jpg',
      categoryId: product.categoryId,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name
      } : null
    }));

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Transform the data to match frontend expectations
    const transformedProduct = {
      ...product.toJSON(),
      imageUrl: product.image || '/assets/placeholder.jpg'
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Search products using Elasticsearch
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const result = await elasticClient.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name', 'description'],
            fuzziness: 'AUTO'
          }
        }
      }
    });

    const hits = result.hits.hits.map(hit => ({
      ...hit._source,
      imageUrl: hit._source.image || '/assets/placeholder.jpg',
      score: hit._score
    }));

    res.json({
      products: hits,
      total: result.hits.total.value
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
};

// List all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'description']
    });
    
    // Transform the data to match frontend expectations
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description
    }));
    
    res.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    // Queue Elasticsearch sync
    await queueElasticSync('index', product.id);

    // Invalidate cache
    await invalidateProductCache(product.id);

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update(req.body);
    
    // Queue Elasticsearch sync
    await queueElasticSync('update', product.id);

    // Invalidate cache
    await invalidateProductCache(product.id);

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    
    // Queue Elasticsearch sync
    await queueElasticSync('delete', product.id);

    // Invalidate cache
    await invalidateProductCache(product.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};