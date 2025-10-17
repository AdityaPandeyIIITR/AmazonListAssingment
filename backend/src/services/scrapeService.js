import puppeteer from 'puppeteer';

const USER_AGENT = process.env.SCRAPE_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

async function extractFromPage(page) {
  await page.waitForSelector('#productTitle, h1#title span, script[type="application/ld+json"]', { timeout: 15000 }).catch(() => {});
  return page.evaluate(() => {
    function getLdProduct() {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const s of scripts) {
        try {
          const json = JSON.parse(s.textContent || 'null');
          if (Array.isArray(json)) {
            for (const item of json) {
              if (item && (item['@type'] === 'Product' || (Array.isArray(item['@type']) && item['@type'].includes('Product')))) return item;
            }
          } else if (json && (json['@type'] === 'Product' || (Array.isArray(json['@type']) && json['@type'].includes('Product')))) {
            return json;
          }
        } catch {}
      }
      return null;
    }

    let title = (document.querySelector('#productTitle')?.textContent || '').trim();
    if (!title) title = (document.querySelector('h1#title span')?.textContent || '').trim();
    if (!title) title = (document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '').trim();
    if (!title) {
      const ld = getLdProduct();
      if (ld && ld.name) title = String(ld.name).trim();
    }

    const bullets = Array.from(document.querySelectorAll('#feature-bullets li, #feature-bullets ul li span.a-list-item, div#poExpander ul.a-unordered-list li span.a-list-item'))
      .map(el => (el.textContent || '').replace(/\\s+/g, ' ').trim())
      .filter(Boolean);

    let description = (document.querySelector('#productDescription, #productDescription p')?.textContent || '')
      .replace(/\\s+/g, ' ').trim();
    if (!description) {
      const aplus = document.querySelector('#aplus_feature_div, div.aplus, div.aplus-v2, div[id^="aplus"]');
      if (aplus) description = (aplus.textContent || '').replace(/\\s+/g, ' ').trim();
    }
    if (!description) {
      const ld = getLdProduct();
      if (ld && ld.description) description = String(ld.description).replace(/\\s+/g, ' ').trim();
    }

    return { title: title || null, bullets, description: description || null };
  });
}

export async function scrapeByAsin(asin) {
  if (process.env.ENABLE_MOCK_SCRAPE === 'true') {
    return { title: 'Sample Product Title', bullets: ['Feature A', 'Feature B', 'Feature C'], description: 'Sample product description for development.' };
  }

  const base = process.env.AMAZON_BASE_URL || 'https://www.amazon.in';
  const candidates = [
    `${base}/dp/${encodeURIComponent(asin)}?language=en_US&psc=1`,
    `${base}/gp/product/${encodeURIComponent(asin)}?language=en_US&psc=1`,
    `${base}/-/dp/${encodeURIComponent(asin)}?language=en_US&psc=1`
  ];
  const m = new URL(base);
  candidates.push(`${m.protocol}//m.${m.hostname.replace(/^www\\./, '')}/dp/${encodeURIComponent(asin)}?language=en_US`);

  let browser;
  try {
    browser = await puppeteer.launch({ headless: process.env.PUPPETEER_HEADLESS !== 'false' });
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.setViewport({ width: 1366, height: 900 });

    for (const url of candidates) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const content = await page.content();
        if (/Robot Check|captcha|sorry/i.test(content)) {
          const e = new Error('Blocked by Amazon (robot check)');
          e.status = 503; e.code = 'AMAZON_BOT_BLOCK';
          throw e;
        }
        const data = await extractFromPage(page);
        if (data.title || (data.bullets && data.bullets.length > 0) || data.description) {
          return data;
        }
      } catch {}
    }
    const e = new Error('Unable to parse product content'); e.status = 503; throw e;
  } finally {
    if (browser) await browser.close();
  }
}