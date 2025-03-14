import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../context/cartStore';
import { productsApi } from '../utils/apiClient';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, getItemQuantity } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getById(id);
        setProduct(response.data);
        
        // Check if the product is already in the cart
        const cartQuantity = getItemQuantity(response.data._id);
        if (cartQuantity > 0) {
          setQuantity(cartQuantity);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getItemQuantity]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Instead of adding product multiple times, add once with the quantity
      const productWithQuantity = {
        ...product,
        quantity // This will be overridden by the cart store logic
      };
      addItem(productWithQuantity);
      toast.success(`${product.name} added to cart`);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
        <p className="mt-2 text-sm text-gray-500">{error || 'The product you are looking for does not exist'}</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Products
        </button>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  const images = [product.imageUrl, ...(product.additionalImages || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                      activeImage === index ? 'ring-2 ring-primary-500' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-center object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-5 w-5 ${
                      product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500">{product.reviewCount} reviews</p>
            </div>

            <div className="mt-4">
              {product.discount > 0 ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-primary-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-2 text-base text-gray-500 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            {product.specifications && product.specifications.size > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                <div className="mt-2 border-t border-gray-200">
                  <dl className="divide-y divide-gray-200">
                    {Array.from(product.specifications.entries()).map(([key, value]) => (
                      <div key={key} className="py-3 flex justify-between text-sm">
                        <dt className="text-gray-500">{key}</dt>
                        <dd className="text-gray-900 ml-6">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="mt-6">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-gray-900 mr-4">Quantity</h3>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-700"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-gray-900">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-700"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {product.category}
                </span>
                {product.tags && product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`h-4 w-4 ${
                          review.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-2 text-base text-gray-900">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 