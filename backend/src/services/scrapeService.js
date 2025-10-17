import axios from 'axios';
import { load } from 'cheerio';
import { logger } from '../utils/logger.js';

// Scrapes minimal data from Amazon product page. Falls back to mock data on failure.
export async function scrapeAmazonByAsin(asin) {
  try {
    const url = `https://www.amazon.com/dp/${asin}`;
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000
    });

    const $ = load(html);
    const title = $('#productTitle').text().trim() || $('span#title').text().trim();

    const bullets = [];
    $('#feature-bullets ul li').each((_, el) => {
      const txt = $(el).text().replace(/\s+/g, ' ').trim();
      if (txt) bullets.push(txt);
    });

    const description = $('#productDescription').text().replace(/\s+/g, ' ').trim() ||
      $('#aplus').text().replace(/\s+/g, ' ').trim();

    if (!title) throw new Error('Title not found');

    return { title, bullets, description };
  } catch (err) {
    logger.warn({ err }, 'Scrape failed, returning mock data');
    return {
      title: 'Sample Product Title',
      bullets: [
        'High-quality materials for durability',
        'Ergonomic design for comfort',
        'Easy to use and maintain',
        'Suitable for daily use',
        'Backed by reliable support'
      ],
      description: 'This is a sample product description used when scraping fails. It provides a basic overview of the product features and benefits.'
    };
  }
}


