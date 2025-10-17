import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { scrapeByAsin } from '../services/scrapeService.js';
import { optimizeListing } from '../services/aiService.js';
import { db } from '../db/client.js';
import { products, optimizations } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

const asinSchema = z.object({ asin: z.string().min(5).max(20) });

export async function scrapeProduct(req, res, next) {
  try {
    const { asin } = asinSchema.parse(req.params);
    const data = await scrapeByAsin(asin);
    res.json({ asin, ...data });
  } catch (err) {
    next(err);
  }
}

export async function optimizeProduct(req, res, next) {
  try {
    const { asin } = asinSchema.parse(req.params);
    const { forceRescrape } = z.object({ forceRescrape: z.boolean().optional() }).parse(req.body || {});

    const scraped = await scrapeByAsin(asin);
    const optimized = await optimizeListing(scraped);

    let product = await db.select().from(products).where(eq(products.asin, asin)).limit(1);
    product = product[0];
    if (!product) {
      const inserted = await db.insert(products).values({ asin, title: scraped.title }).$returningId();
      product = { id: inserted[0].id, asin, title: scraped.title };
    } else if (scraped.title && scraped.title !== product.title) {
      await db.update(products).set({ title: scraped.title }).where(eq(products.id, product.id));
    }

    const insertedRun = await db.insert(optimizations).values({
      productId: product.id,
      originalTitle: scraped.title || '',
      originalBullets: scraped.bullets || [],
      originalDescription: scraped.description || null,
      optimizedTitle: optimized.optimizedTitle,
      optimizedBullets: optimized.optimizedBullets,
      optimizedDescription: optimized.optimizedDescription,
      keywords: optimized.keywords,
      model: optimized.model,
      promptVersion: optimized.promptVersion
    }).$returningId();

    res.json({
      asin,
      runId: insertedRun[0].id,
      original: scraped,
      optimized: {
        title: optimized.optimizedTitle,
        bullets: optimized.optimizedBullets,
        description: optimized.optimizedDescription
      },
      keywords: optimized.keywords
    });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const { asin } = asinSchema.parse(req.params);
    const { limit = '10', offset = '0' } = req.query;
    const take = Math.min(parseInt(limit, 10) || 10, 50);
    const skip = parseInt(offset, 10) || 0;

    const prodRows = await db.select().from(products).where(eq(products.asin, asin)).limit(1);
    const product = prodRows[0];
    if (!product) return res.json({ asin, history: [] });

    const runs = await db
      .select()
      .from(optimizations)
      .where(eq(optimizations.productId, product.id))
      .orderBy(desc(optimizations.createdAt))
      .limit(take)
      .offset(skip);

    const history = runs.map(r => ({
      id: r.id,
      createdAt: r.createdAt,
      original: {
        title: r.originalTitle,
        bullets: r.originalBullets,
        description: r.originalDescription
      },
      optimized: {
        title: r.optimizedTitle,
        bullets: r.optimizedBullets,
        description: r.optimizedDescription
      },
      keywords: r.keywords
    }));

    res.json({ asin, history });
  } catch (err) {
    next(err);
  }
}


