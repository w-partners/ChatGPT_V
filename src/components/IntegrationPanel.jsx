import React, { useState } from 'react';
import { setupN8nWorkflow } from '../services/n8nService';

const IntegrationPanel = ({ products, mostPopularProduct, updateStatus }) => {
  const [n8nConfig, setN8nConfig] = useState({
    webhookUrl: '',
    apiKey: ''
  });
  
  const [loading, setLoading] = useState({
    setup: false,
    sendData: false,
    sendNotification: false
  });

  const handleN8nChange = (e) => {
    const { name, value } = e.target;
    setN8nConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSetupWorkflow = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, setup: true }));
    updateStatus('n8n', 'loading', 'n8n 워크플로우 설정 중...');
    
    try {
      await setupN8nWorkflow(mostPopularProduct, n8nConfig.webhookUrl, n8nConfig.apiKey);
      updateStatus('n8n', 'success', 'n8n 워크플로우가 성공적으로 설정되었습니다.');
    } catch (error) {
      console.error('n8n setup error:', error);
      updateStatus('n8n', 'error', `오류: ${error.message || 'n8n 설정 실패'}`);
    } finally {
      setLoading(prev => ({ ...prev, setup: false }));
    }
  };
  
  const handleSendData = async () => {
    if (!n8nConfig.webhookUrl) {
      alert('웹훅 URL이 필요합니다.');
      return;
    }
    
    setLoading(prev => ({ ...prev, sendData: true }));
    updateStatus('n8n', 'loading', '데이터 전송 중...');
    
    try {
      const response = await fetch(n8nConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(n8nConfig.apiKey && { 'X-N8N-API-KEY': n8nConfig.apiKey })
        },
        body: JSON.stringify({
          action: 'data_update',
          products: products.slice(0, 10) // Send top 10 products
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      updateStatus('n8n', 'success', '데이터가 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('Data sending error:', error);
      updateStatus('n8n', 'error', `오류: ${error.message || '데이터 전송 실패'}`);
    } finally {
      setLoading(prev => ({ ...prev, sendData: false }));
    }
  };
  
  const handleSendNotification = async () => {
    if (!n8nConfig.webhookUrl) {
      alert('웹훅 URL이 필요합니다.');
      return;
    }
    
    setLoading(prev => ({ ...prev, sendNotification: true }));
    updateStatus('n8n', 'loading', '알림 전송 중...');
    
    try {
      const response = await fetch(n8nConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(n8nConfig.apiKey && { 'X-N8N-API-KEY': n8nConfig.apiKey })
        },
        body: JSON.stringify({
          action: 'send_notification',
          message: `인기 상품 알림: ${mostPopularProduct.name} - ${mostPopularProduct.price}`,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      updateStatus('n8n', 'success', '알림이 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('Notification sending error:', error);
      updateStatus('n8n', 'error', `오류: ${error.message || '알림 전송 실패'}`);
    } finally {
      setLoading(prev => ({ ...prev, sendNotification: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-lg font-semibold text-gray-800">n8n 워크플로우 설정</h2>
        <p className="text-sm text-gray-600">n8n 웹훅을 설정하고 데이터를 전송합니다</p>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSetupWorkflow}>
          <div className="mb-4">
            <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
              n8n 웹훅 URL
            </label>
            <input
              type="url"
              id="webhookUrl"
              name="webhookUrl"
              value={n8nConfig.webhookUrl}
              onChange={handleN8nChange}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="n8nApiKey" className="block text-sm font-medium text-gray-700 mb-1">
              n8n API 키 (선택 사항)
            </label>
            <input
              type="text"
              id="apiKey"
              name="apiKey"
              value={n8nConfig.apiKey}
              onChange={handleN8nChange}
              placeholder="n8n_api_..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">가능한 작업:</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5">
              <li>워크플로우 설정 - 기본 n8n 웹훅 설정</li>
              <li>데이터 전송 - 인기 상품 데이터 전송</li>
              <li>알림 전송 - 인기 상품 알림 전송</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="submit"
              disabled={loading.setup}
              className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading.setup ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {loading.setup ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  설정 중...
                </>
              ) : (
                '워크플로우 설정'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleSendData}
              disabled={loading.sendData || !n8nConfig.webhookUrl}
              className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading.sendData || !n8nConfig.webhookUrl ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading.sendData ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  전송 중...
                </>
              ) : (
                '데이터 전송'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleSendNotification}
              disabled={loading.sendNotification || !n8nConfig.webhookUrl}
              className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading.sendNotification || !n8nConfig.webhookUrl ? 'bg-yellow-400' : 'bg-yellow-600 hover:bg-yellow-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            >
              {loading.sendNotification ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  전송 중...
                </>
              ) : (
                '알림 전송'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationPanel;