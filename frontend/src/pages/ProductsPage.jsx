import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import Pagination from '../components/common/Pagination';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get current filter values from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = {
          page: currentPage,
          limit: 12
        };
        
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort) params.sort = sort;
        if (order) params.order = order;
        
        const response = await productsApi.getAll(params);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, category, minPrice, maxPrice, sort, order]);
  
  const handleFilterChange = (filters) => {
    // Update URL with new filters
    const newParams = { ...filters, page: 1 };
    setSearchParams(newParams);
  };
  
  const handlePageChange = (page) => {
    // Update only the page parameter
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sustainable Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <ProductFilter 
            initialFilters={{ category, minPrice, maxPrice, sort, order }}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
              No products found matching your criteria. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 