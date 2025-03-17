import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4 border-2';
      case 'large':
        return 'h-12 w-12 border-4';
      default:
        return 'h-8 w-8 border-3';
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className={`${getSizeClass()} rounded-full border-gray-300 border-t-primary-600 animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner; 