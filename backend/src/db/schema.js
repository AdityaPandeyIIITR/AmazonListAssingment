import { mysqlTable, serial, varchar, text, json, int, timestamp } from 'drizzle-orm/mysql-core';

export const products = mysqlTable('products', {
  id: serial('id').primaryKey(),
  asin: varchar('asin', { length: 20 }).notNull().unique(),
  title: text('title'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow()
});

export const optimizations = mysqlTable('optimizations', {
  id: serial('id').primaryKey(),
  productId: int('product_id').notNull(),
  originalTitle: text('original_title').notNull(),
  originalBullets: json('original_bullets').notNull(),
  originalDescription: text('original_description'),
  optimizedTitle: text('optimized_title').notNull(),
  optimizedBullets: json('optimized_bullets').notNull(),
  optimizedDescription: text('optimized_description').notNull(),
  keywords: json('keywords').notNull(),
  model: varchar('model', { length: 64 }).notNull(),
  promptVersion: varchar('prompt_version', { length: 32 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});



