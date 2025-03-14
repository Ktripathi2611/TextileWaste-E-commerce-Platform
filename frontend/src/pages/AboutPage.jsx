import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About TextileWaste</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src="/images/about-textile-waste.jpg" 
              alt="Textile Waste Recycling" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At TextileWaste, we're committed to reducing the environmental impact of textile waste through innovative recycling and upcycling solutions. Our mission is to transform discarded textiles into valuable products, diverting them from landfills and giving them a new life.
            </p>
            <p className="text-gray-600">
              We believe in a circular economy where waste becomes a resource, and we're dedicated to making sustainable choices accessible to everyone.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Sustainable Solutions</h3>
          <p className="text-gray-600">
            We develop innovative methods to recycle and upcycle textile waste, reducing environmental impact and conserving resources.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
          <p className="text-gray-600">
            We work with partners worldwide to address the growing problem of textile waste and promote sustainable consumption.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Ethical Production</h3>
          <p className="text-gray-600">
            We ensure fair wages and safe working conditions throughout our supply chain, prioritizing people and planet.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">The Textile Waste Problem</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">92M</div>
            <p className="text-gray-600">Tons of textile waste generated annually worldwide</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">85%</div>
            <p className="text-gray-600">Of textiles end up in landfills or are incinerated</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">20%</div>
            <p className="text-gray-600">Of global water pollution comes from textile dyeing</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">10%</div>
            <p className="text-gray-600">Of global carbon emissions from the fashion industry</p>
          </div>
        </div>
        
        <p className="text-gray-600">
          The fashion industry is one of the most polluting industries in the world. Fast fashion has accelerated the problem, with clothing production doubling since 2000 while garment utilization has decreased by 36%. At TextileWaste, we're working to change this by creating a circular economy for textiles.
        </p>
      </div>
      
      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Mission</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Together, we can make a difference. Shop our sustainable products, learn about textile recycling, or partner with us to create a more sustainable future.
        </p>
        <Link to="/products" className="btn-primary inline-block">
          Shop Sustainable Products
        </Link>
      </div>
    </div>
  );
};

export default AboutPage; 