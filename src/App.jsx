import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import IntegrationPanel from './components/IntegrationPanel';
import { fetchCoupangData } from './services/dataService';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mostPopularProduct, setMostPopularProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'reviews', 'price'
  const [integrationStatus, setIntegrationStatus] = useState({
    n8n: { status: 'idle', message: '' }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCoupangData();
        setProducts(data.popular_products);
        setFilteredProducts(data.popular_products);
        setMostPopularProduct(data.most_popular_product);
        setSelectedProduct(data.most_popular_product);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle search and sorting
  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];
    
    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortBy === 'reviews') {
      result.sort((a, b) => b.review_count - a.review_count);
    } else if (sortBy === 'price') {
      result.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
        return priceA - priceB;
      });
    }
    // 'popularity' is default and uses the original order
    
    setFilteredProducts(result);
  }, [products, searchTerm, sortBy]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const updateIntegrationStatus = (service, status, message) => {
    setIntegrationStatus(prev => ({
      ...prev,
      [service]: { status, message }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        integrationStatus={integrationStatus}
      />
      
      <main className="container mx-auto py-6 px-4">
        {activeTab === 'products' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">상품 검색</label>
                  <input 
                    type="text" 
                    id="search" 
                    placeholder="상품명 검색..." 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">정렬 기준</label>
                  <select
                    id="sortBy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">인기순</option>
                    <option value="reviews">리뷰 많은순</option>
                    <option value="price">가격 낮은순</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProductList 
                  products={filteredProducts} 
                  selectedProduct={selectedProduct} 
                  onSelectProduct={handleProductSelect}
                  mostPopularProduct={mostPopularProduct}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedProduct && (
                  <ProductDetail 
                    product={selectedProduct}
                    isMostPopular={selectedProduct.name === mostPopularProduct.name}
                  />
                )}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'integration' && (
          <IntegrationPanel 
            products={products}
            mostPopularProduct={mostPopularProduct}
            updateStatus={updateIntegrationStatus}
          />
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>쿠팡 인기 상품 데이터 통합 애플리케이션</p>
      </footer>
    </div>
  );
}

export default App;