import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  UserGroupIcon, 
  GlobeAltIcon, 
  ChartBarIcon,
  ArrowPathIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    { name: 'Tons of Textile Waste Recycled', value: '500+' },
    { name: 'Products Created', value: '1000+' },
    { name: 'Happy Customers', value: '5000+' },
    { name: 'Environmental Impact', value: '75%' },
  ];

  const values = [
    {
      name: 'Sustainability',
      description: 'We are committed to creating products that minimize environmental impact and promote sustainable fashion practices.',
      icon: SparklesIcon,
    },
    {
      name: 'Innovation',
      description: 'We continuously explore new ways to transform textile waste into high-quality, fashionable products.',
      icon: ArrowPathIcon,
    },
    {
      name: 'Community',
      description: 'We believe in building a community of conscious consumers who care about the environment.',
      icon: UserGroupIcon,
    },
    {
      name: 'Transparency',
      description: 'We maintain complete transparency about our processes and environmental impact.',
      icon: GlobeAltIcon,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            alt="Sustainable fashion"
          />
          <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Transforming textile waste into sustainable fashion, one product at a time.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
              >
                <dt>
                  <div className="absolute rounded-md bg-primary-500 p-3">
                    <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Making Fashion Sustainable
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We're on a mission to revolutionize the fashion industry by transforming textile waste into beautiful, sustainable products. Our commitment to environmental responsibility drives everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What We Stand For
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {values.map((value) => (
                <div key={value.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <value.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{value.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{value.description}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Our Impact</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Making a Difference
            </p>
          </div>

          <div className="mt-10">
            <div className="prose prose-lg prose-primary mx-auto">
              <p>
                Every product we create helps reduce textile waste and promotes sustainable fashion practices. By choosing our products, you're not just making a fashion statement – you're making a statement about the future of our planet.
              </p>
              <p>
                We work closely with local communities and recycling facilities to ensure that textile waste is properly collected and transformed into new, high-quality products. Our commitment to sustainability extends beyond our products to our entire supply chain.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to make a difference?</span>
            <span className="block text-primary-200">Start shopping sustainably today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 