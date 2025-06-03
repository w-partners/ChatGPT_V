/**
 * Service for integrating with n8n workflows
 */

/**
 * Setup an n8n workflow for the most popular product
 * @param {Object} product - The most popular product data
 * @param {string} webhookUrl - n8n webhook URL
 * @param {string} apiKey - n8n API key (optional)
 * @returns {Promise} - Promise that resolves when workflow setup is complete
 */
export const setupN8nWorkflow = async (product, webhookUrl, apiKey = null) => {
  if (!webhookUrl) {
    throw new Error('n8n 웹훅 URL이 필요합니다.');
  }

  if (!product) {
    throw new Error('상품 데이터가 필요합니다.');
  }

  try {
    console.log(`Setting up n8n workflow for ${product.name} via webhook ${webhookUrl}`);
    
    // Prepare data for n8n webhook
    const payload = {
      product_name: product.name,
      product_price: product.price,
      product_rating: product.rating,
      product_review_count: product.review_count,
      product_url: product.product_url,
      detailed_info: product.detailed_info || {},
      reviews: product.reviews || []
    };

    // Add headers for authentication if API key is provided
    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'X-N8N-API-KEY': apiKey })
    };

    // In a real implementation, we would make an actual API call
    // Here we're simulating the API call
    console.log('Sending data to n8n webhook:', JSON.stringify(payload));
    
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful response
    const response = {
      status: 200,
      message: 'Webhook triggered successfully',
      executionId: `exec_${Date.now()}`
    };

    if (response.status !== 200) {
      throw new Error(`n8n 웹훅 오류: ${response.message}`);
    }

    console.log('n8n workflow initiated successfully:', response.executionId);
    return response;
  } catch (error) {
    console.error('n8n workflow setup error:', error);
    throw new Error(`n8n 워크플로우 설정 오류: ${error.message}`);
  }
};

/**
 * Get n8n workflow execution status
 * @param {string} executionId - n8n workflow execution ID
 * @param {string} apiKey - n8n API key
 * @returns {Promise} - Promise that resolves with workflow execution status
 */
export const getWorkflowStatus = async (executionId, apiKey) => {
  if (!executionId || !apiKey) {
    throw new Error('실행 ID와 API 키가 필요합니다.');
  }

  try {
    console.log(`Getting status for workflow execution ${executionId}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    const statuses = ['running', 'success', 'error'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: executionId,
      status: randomStatus,
      startedAt: new Date().toISOString(),
      finishedAt: randomStatus !== 'running' ? new Date().toISOString() : null,
      data: randomStatus === 'success' ? { processed: true } : {}
    };
  } catch (error) {
    console.error('n8n status check error:', error);
    throw new Error(`워크플로우 상태 확인 오류: ${error.message}`);
  }
};