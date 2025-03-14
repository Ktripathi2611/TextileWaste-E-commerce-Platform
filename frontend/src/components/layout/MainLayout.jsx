import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from '../common/Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                About Us
              </h3>
              <p className="mt-4 text-base text-gray-500">
                We are committed to reducing textile waste by creating sustainable fashion products from recycled materials.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/products" className="text-base text-gray-500 hover:text-gray-900">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="text-base text-gray-500 hover:text-gray-900">
                    Account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-4">
                <li className="text-base text-gray-500">
                  Email: info@textilewaste.com
                </li>
                <li className="text-base text-gray-500">
                  Phone: (555) 123-4567
                </li>
                <li className="text-base text-gray-500">
                  Address: 123 Eco Street, Green City, GC 12345
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              © {new Date().getFullYear()} TextileWaste. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 