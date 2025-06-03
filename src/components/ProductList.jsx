import React from 'react';

const ProductList = ({ products, selectedProduct, onSelectProduct, mostPopularProduct }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-lg font-semibold text-gray-800">인기 상품 목록</h2>
        <p className="text-sm text-gray-600">상품을 선택하여 자세한 정보 확인</p>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {products.map((product, index) => (
          <li key={index}>
            <button
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex justify-between items-center ${
                selectedProduct && selectedProduct.name === product.name ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectProduct(product)}
            >
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.price}</p>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-gray-500 ml-2">({product.review_count})</span>
                {mostPopularProduct && mostPopularProduct.name === product.name && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">인기</span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;