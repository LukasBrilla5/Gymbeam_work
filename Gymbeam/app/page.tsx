'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MySidebar from './sidebar';
import './styles.css';
import Image from 'next/image';
import Mylogo from '../public/gymbeam-1.png';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating_summary: number;
  thumbnail: string;
}

interface Filter {
  name: string;
  options?: Array<{ id: string; name: string }>;
  type?: string;
  min?: number;
  max?: number;
}

const CategoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: any }>({});
  const baseURL = 'https://gymbeam.sk/rest/V1/gb/catalog/products';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIfMobile());
    };

    setIsMobile(checkIfMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkIfMobile = () => {
    const isMobileDevice = /Mobi/i.test(navigator.userAgent); 
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return isMobileDevice && screenWidth <= 768;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(baseURL, {
          params: {
            category_ids: [2416],
            ...selectedFilters
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setProducts(response.data.items);
        setFilters(response.data.filters);

        if (response.data.filters.length === 1 && response.data.filters[0]?.options?.length > 0) {
          const firstOptionId = response.data.filters[0].options[0].id;
          handleFilterChange(response.data.filters[0].name, firstOptionId);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [selectedFilters]);

  const handleFilterChange = (filterName: string, value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className="page-container">
      <div className="header">
        <Image src={Mylogo} alt="My Image" style={{ width: isMobile ? '50%' : '15%', height: '100%', backgroundColor: 'black' }} />
      </div>
      <div>
        <h1 style={{ marginLeft: '20px' }}>Sports Nutrition</h1>
      </div>
      <div className="main-content">
        {isMobile ? (
          <>
          <div className="content-wrapper">
            <MySidebar filters={filters} selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} />
            <div className="content-wrapper">
            <div className="content-container">
              <div >
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.thumbnail} alt={product.name} />
                    <h2>{product.name}</h2>
                    <p>€{product.price} {product.currency}</p>
                    <p>Rating: {product.rating_summary} / 100</p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
          </>
        ) : (
          <>
            <MySidebar filters={filters} selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} />
            <div className="content-wrapper">
              <div className="content-container">
                <div className="product-list">
                  {products.map((product) => (
                    <div key={product.id} className="product-card">
                      <img src={product.thumbnail} alt={product.name} />
                      <h2>{product.name}</h2>
                      <p>€{product.price} {product.currency}</p>
                      <p>Rating: {product.rating_summary} / 100</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
