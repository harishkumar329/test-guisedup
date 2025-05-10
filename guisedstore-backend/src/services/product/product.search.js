import { elasticClient } from '../../config/elastic.js';
import { Product, Category } from '../../../models/product.js';
import { logger } from '../../utils/logger.js';

// Convert Sequelize product to Elasticsearch document
const productToDocument = (product) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    status: product.status,
    categoryId: product.categoryId,
    image: product.image || '/assets/placeholder.jpg',
    category: product.category ? {
      id: product.category.id,
      name: product.category.name
    } : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

// Index a single product
export const indexProduct = async (product) => {
  try {
    const document = productToDocument(product);
    await elasticClient.index({
      index: 'products',
      id: product.id,
      document
    });
    logger.info(`Indexed product ${product.id}`);
  } catch (error) {
    logger.error(`Error indexing product ${product.id}:`, error);
    throw error;
  }
};

// Update a product in Elasticsearch
export const updateProduct = async (product) => {
  try {
    const document = productToDocument(product);
    await elasticClient.update({
      index: 'products',
      id: product.id,
      doc: document
    });
    logger.info(`Updated product ${product.id} in Elasticsearch`);
  } catch (error) {
    logger.error(`Error updating product ${product.id} in Elasticsearch:`, error);
    throw error;
  }
};

// Remove a product from Elasticsearch
export const removeProduct = async (productId) => {
  try {
    await elasticClient.delete({
      index: 'products',
      id: productId
    });
    logger.info(`Removed product ${productId} from Elasticsearch`);
  } catch (error) {
    logger.error(`Error removing product ${productId} from Elasticsearch:`, error);
    throw error;
  }
};

// Sync all products from database to Elasticsearch
export const syncProducts = async () => {
  try {
    logger.info('Starting full product sync with Elasticsearch...');
    
    // Get all products with their categories
    const products = await Product.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    // Delete existing index if it exists
    const indexExists = await elasticClient.indices.exists({ index: 'products' });
    if (indexExists) {
      await elasticClient.indices.delete({ index: 'products' });
    }

    // Create new index with mapping
    await elasticClient.indices.create({
      index: 'products',
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            status: { type: 'keyword' },
            categoryId: { type: 'keyword' },
            image: { type: 'keyword' },
            category: {
              properties: {
                id: { type: 'keyword' },
                name: { type: 'keyword' }
              }
            },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' }
          }
        }
      }
    });

    // Bulk index all products
    const operations = products.flatMap(product => [
      { index: { _index: 'products', _id: product.id } },
      productToDocument(product)
    ]);

    if (operations.length > 0) {
      const bulkResponse = await elasticClient.bulk({ refresh: true, operations });
      if (bulkResponse.errors) {
        const erroredDocuments = [];
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              document: operations[i * 2 + 1]
            });
          }
        });
        logger.error('Bulk index errors:', erroredDocuments);
      }
    }

    logger.info(`Successfully synced ${products.length} products to Elasticsearch`);
  } catch (error) {
    logger.error('Error syncing products to Elasticsearch:', error);
    throw error;
  }
};