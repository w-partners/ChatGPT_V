import React, { useState } from 'react';
import ReviewsList from './ReviewsList';

const ProductDetail = ({ product, isMostPopular }) => {
  const [activeTab, setActiveTab] = useState('info');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-600">리뷰 {product.review_count}개</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">{product.price}</div>
            {isMostPopular && (
              <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                가장 인기 있는 상품
              </span>
            )}
          </div>
        </div>

        {product.detailed_info && (
          <>
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`py-2 px-4 border-b-2 ${
                  activeTab === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => handleTabChange('info')}
              >
                상품 정보
              </button>
              {product.reviews && (
                <button
                  className={`py-2 px-4 border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-blue-500'
                  }`}
                  onClick={() => handleTabChange('reviews')}
                >
                  상품평 ({product.reviews.length})
                </button>
              )}
            </div>

            {activeTab === 'info' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">상세 정보</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(product.detailed_info).map(([key, value]) => (
                    <div key={key} className="py-2">
                      <dt className="text-sm text-gray-500 mb-1">{formatKey(key)}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={product.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    쿠팡에서 보기
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && product.reviews && <ReviewsList reviews={product.reviews} />}
          </>
        )}
        
        {!product.detailed_info && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">
              자세한 정보를 보려면 인기 상품을 선택하세요.
            </p>
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 text-blue-600 hover:underline"
            >
              쿠팡에서 보기
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format keys for display
const formatKey = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default ProductDetail;