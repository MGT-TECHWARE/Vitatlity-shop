import React, { useState, useMemo, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import TrustBar from '../components/TrustBar/TrustBar';
import CategoryBar from '../components/CategoryBar/CategoryBar';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import FeaturedServices from '../components/FeaturedServices/FeaturedServices';
import { useProducts } from '../context/ProductsContext';

export default function Home() {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
      <ProductGrid products={filteredProducts} activeCategory={activeCategory} />
      <FeaturedServices />
    </>
  );
}
