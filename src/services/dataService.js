/**
 * Service for handling data operations
 */

/**
 * Fetch Coupang product data from local JSON file
 * @returns {Promise} - Promise that resolves with the product data
 */
export const fetchCoupangData = async () => {
  try {
    const response = await fetch('/data/coupang_data.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Coupang data:', error);
    throw error;
  }
};

/**
 * Format product data for external APIs
 * @param {Array} products - Array of product objects
 * @param {string} format - Output format ('notion' or 'n8n')
 * @returns {Array} - Formatted product data
 */
export const formatProductData = (products, format = 'notion') => {
  if (!products || !Array.isArray(products)) {
    throw new Error('유효한 상품 데이터가 아닙니다.');
  }
  
  if (format === 'notion') {
    // Format data for Notion database
    return products.map(product => ({
      Name: { title: [{ text: { content: product.name } }] },
      Price: { rich_text: [{ text: { content: product.price } }] },
      Rating: { number: product.rating },
      Reviews: { number: product.review_count },
      URL: { url: product.product_url }
    }));
  } else if (format === 'n8n') {
    // Format data for n8n workflow
    return products.map(product => ({
      product_name: product.name,
      product_price: product.price,
      product_rating: product.rating,
      product_review_count: product.review_count,
      product_url: product.product_url,
      detailed_info: product.detailed_info || {},
      reviews: product.reviews || []
    }));
  }
  
  throw new Error('지원되지 않는 포맷입니다.');
};