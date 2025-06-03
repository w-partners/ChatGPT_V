import React from 'react';

const Header = ({ activeTab, onTabChange, integrationStatus }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-blue-600">쿠팡 인기 상품 데이터 매니저</h1>
            <p className="text-gray-600">n8n 웹훅 및 상품 검색 기능</p>
          </div>
          
          <div className="flex space-x-2">
            {integrationStatus.n8n.status !== 'idle' && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                integrationStatus.n8n.status === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : integrationStatus.n8n.status === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                n8n: {integrationStatus.n8n.status === 'success' ? '성공' : integrationStatus.n8n.status === 'error' ? '오류' : '진행중'}
              </div>
            )}
          </div>
        </div>
        
        <nav className="mt-4">
          <ul className="flex space-x-4 border-b">
            <li>
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'products'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => onTabChange('products')}
              >
                상품 목록
              </button>
            </li>
            <li>
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'integration'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => onTabChange('integration')}
              >
                통합 설정
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;