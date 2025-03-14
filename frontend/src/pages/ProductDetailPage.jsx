import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../utils/api';
import { useCartStore } from '../context/cartStore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const addToCart = useCartStore(state => state.addItem);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await productsApi.getById(id);
        setProduct(response.data);
        
        // Reset active image when product changes
        setActiveImage(0);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error || 'Product not found'}
        </div>
        <div className="mt-4">
          <Link to="/products" className="text-primary-600 hover:underline">
            &larr; Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate discounted price
  const discountedPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;
  
  // Prepare images array
  const images = [product.imageUrl, ...(product.additionalImages || [])];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/products" className="text-primary-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Product Images */}
          <div className="md:w-1/2 p-4">
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      activeImage === index ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 ml-2">({product.reviewCount} reviews)</span>
            </div>
            
            {/* Price */}
            <div className="mb-4">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-800">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Stock Status */}
            <div className="mb-4">
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Quantity
                </label>
                <div className="flex">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 rounded-l-md hover:bg-gray-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center border-t border-b border-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 rounded-r-md hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 px-4 rounded-md font-medium ${
                product.stock > 0
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            {/* Product Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Specifications</h2>
                <div className="border rounded-md overflow-hidden">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div 
                      key={key} 
                      className={`flex ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <div className="w-1/3 px-4 py-2 font-medium text-gray-700 border-r">
                        {key}
                      </div>
                      <div className="w-2/3 px-4 py-2 text-gray-600">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 