// models/product.js
import e from 'express';
import { sequelize, DataTypes } from '../src/config/db.js';
import { indexProduct, updateProduct, removeProduct } from '../src/services/product/product.search.js';

// Define Product Model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // URL or path to the main product image
    allowNull: true,
  },
  galleryImages: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array of URLs for gallery images
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,  // Ensure price is not negative
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'products',
  timestamps: true,  // Enables Sequelize's automatic handling of createdAt and updatedAt
});

// Define Category Model
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'categories',
  timestamps: true,
});

// Define associations explicitly
Product.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false, // Make the categoryId required
  },
  as: 'category',
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
});

// Elasticsearch hooks
Product.addHook('afterCreate', async (product) => {
  try {
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }]
    });
    await indexProduct(productWithCategory);
  } catch (error) {
    console.error('Error indexing new product:', error);
  }
});

Product.addHook('afterUpdate', async (product) => {
  try {
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }]
    });
    await updateProduct(productWithCategory);
  } catch (error) {
    console.error('Error updating product in Elasticsearch:', error);
  }
});

Product.addHook('afterDestroy', async (product) => {
  try {
    await removeProduct(product.id);
  } catch (error) {
    console.error('Error removing product from Elasticsearch:', error);
  }
});

export { Product, Category };
