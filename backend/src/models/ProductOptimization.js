import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const ProductOptimization = sequelize.define('ProductOptimization', {
  asin: { type: DataTypes.STRING, allowNull: false },
  original_title: { type: DataTypes.TEXT, allowNull: true },
  optimized_title: { type: DataTypes.TEXT, allowNull: true },
  original_bullets: { type: DataTypes.TEXT, allowNull: true },
  optimized_bullets: { type: DataTypes.TEXT, allowNull: true },
  original_description: { type: DataTypes.TEXT, allowNull: true },
  optimized_description: { type: DataTypes.TEXT, allowNull: true },
  keywords: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'ProductOptimizations',
  timestamps: true
});



