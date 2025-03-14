import React, { useState, useEffect } from 'react';

const ProductFilter = ({ initialFilters, onFilterChange }) => {
  const [filters, setFilters] = useState(initialFilters);
  
  // Categories for the filter
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home', label: 'Home Goods' },
    { value: 'crafts', label: 'Crafts' },
    { value: 'materials', label: 'Raw Materials' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'rating:desc', label: 'Highest Rated' }
  ];
  
  // Update local state when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  
  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };
  
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const handleSortChange = (e) => {
    const [sort, order] = e.target.value.split(':');
    setFilters({ ...filters, sort, order });
  };
  
  const handleApplyFilters = () => {
    onFilterChange(filters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'createdAt',
      order: 'desc'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Category
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.minPrice}
            onChange={handlePriceChange}
            min="0"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            min="0"
          />
        </div>
      </div>
      
      {/* Sort Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Sort By
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={`${filters.sort}:${filters.order}`}
          onChange={handleSortChange}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleApplyFilters}
          className="btn-primary w-full"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="btn-secondary w-full"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter; 