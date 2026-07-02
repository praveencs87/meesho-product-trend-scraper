import { Actor } from 'apify';
import { CheerioCrawler, log } from 'crawlee';

await Actor.init();

try {
    const input = await Actor.getInput();
    if (!input || !input.productUrls || input.productUrls.length === 0) {
        throw new Error('productUrls input is required!');
    }

    const { productUrls } = input;

    let totalProductsExtracted = 0;

    const crawler = new CheerioCrawler({
        maxConcurrency: 10,
        
        async requestHandler({ request, $, log }) {
            const url = request.url;
            log.info(`Scraping Meesho Product: ${url}`);
            
            // Extract the Next.js state JSON
            const nextDataScript = $('#__NEXT_DATA__').html();
            
            if (!nextDataScript) {
                log.warning(`Could not find __NEXT_DATA__ JSON on ${url}. The page might be blocked or structured differently.`);
                return;
            }

            let nextData;
            try {
                nextData = JSON.parse(nextDataScript);
            } catch (e) {
                log.error(`Failed to parse __NEXT_DATA__ JSON on ${url}`);
                return;
            }

            // The exact path to the product data in Meesho's Next.js state can vary slightly, 
            // but it is usually inside props.pageProps.initialState.product.detail
            
            let productDetail = null;
            try {
                // Try common paths
                const state = nextData.props?.pageProps?.initialState;
                if (state && state.product && state.product.detail) {
                    productDetail = state.product.detail;
                } else if (nextData.props?.pageProps?.product) {
                    productDetail = nextData.props.pageProps.product;
                }
            } catch (e) {
                log.warning(`Error traversing JSON path for product details: ${e.message}`);
            }

            if (!productDetail) {
                log.warning(`Could not locate product details in JSON structure for ${url}`);
                return;
            }

            // Extract core data
            const productName = productDetail.name || 'Unknown';
            const currentPrice = productDetail.price || null;
            const originalPrice = productDetail.mrp || null;
            const discount = productDetail.discount || null;
            
            const rating = productDetail.rating?.average_rating || null;
            const reviewsCount = productDetail.rating?.review_count || null;
            
            const supplierName = productDetail.supplier?.name || null;
            const supplierRating = productDetail.supplier?.rating || null;
            
            const trendingFlags = productDetail.trend_tags || [];

            const output = {
                url,
                productName,
                currentPrice: currentPrice ? `₹${currentPrice}` : null,
                originalPrice: originalPrice ? `₹${originalPrice}` : null,
                discount: discount ? `${discount}% off` : null,
                rating,
                reviewsCount,
                supplierName,
                supplierRating,
                trendingFlags,
                scrapedAt: new Date().toISOString()
            };

            await Actor.pushData(output);
            
            totalProductsExtracted++;
            
            // PPE Monetization
            await Actor.charge({ eventName: 'product-scraped', count: 1 });
            
            log.info(`✅ Extracted data for: ${productName.substring(0, 30)}...`);
        },
        
        async failedRequestHandler({ request, log }) {
            log.error(`Failed to scrape ${request.url} after multiple retries.`);
        },
    });

    log.info(`Starting Meesho crawler for ${productUrls.length} products...`);
    
    await crawler.addRequests(productUrls);
    await crawler.run();

    log.info(`🎉 Finished! Extracted data for ${totalProductsExtracted} products.`);
} catch (error) {
    log.error('Actor failed:', error);
    throw error;
}

await Actor.exit();
