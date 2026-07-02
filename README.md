# Meesho Product Trend Scraper

**Extract highly accurate structured data (prices, supplier details, trend badges) from Meesho products by parsing internal JSON blobs at high speeds.**

Meesho is a rapidly growing Indian eCommerce platform popular among dropshippers and resellers. Scraping Meesho HTML directly is notoriously flaky because of its dynamic React/Next.js infrastructure.

This actor uses a high-performance static scraper that completely bypasses HTML DOM parsing. Instead, it extracts the hidden `__NEXT_DATA__` JSON blob embedded in Meesho product pages, giving you perfectly structured, perfectly accurate data without needing a slow headless browser.

## What can this Actor do?

- ✅ **Pricing Data** - Extracts the current selling price, original MRP, and the discount percentage.
- ✅ **Supplier Intelligence** - Grabs the name and overall rating of the supplier selling the product.
- ✅ **Trend Identification** - Extracts trend flags (like "Trending", "Best Seller") if applied to the product data.
- ✅ **Ratings & Reviews** - Grabs the total number of ratings, total reviews, and the overall star rating.
- ✅ **Lightning Fast** - Uses `CheerioCrawler` to parse the underlying Next.js data state instantly.

## Why use this Actor?

- 🎯 **Dropshipping Research** - Find trending products on Meesho to sell on your own platforms.
- 🤝 **Supplier Tracking** - Monitor top suppliers and their product catalogs.
- 📊 **Price Monitoring** - Track the prices of specific products over time.

## How to use it

1. Enter a list of Meesho product URLs into the **Meesho Product URLs** field.
2. Click Start!

## How much does it cost?

This actor uses a **Pay-Per-Event (PPE)** pricing model. You only pay for the products successfully scraped!
- **$1.00 per 1,000 products scraped.**

## Output Example

When a product is extracted, the actor pushes this data to your dataset:

```json
{
  "url": "https://www.meesho.com/s/p/5tndl",
  "productName": "Elegant Women's Kurta",
  "currentPrice": "₹299",
  "originalPrice": "₹599",
  "discount": "50% off",
  "rating": "4.1",
  "reviewsCount": "1,240",
  "supplierName": "Fashion Hub India",
  "supplierRating": "4.0",
  "trendingFlags": ["Best Seller"],
  "scrapedAt": "2023-10-25T15:00:00.000Z"
}
```
