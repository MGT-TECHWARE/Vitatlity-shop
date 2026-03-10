import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ProductsContext = createContext(null);

// Map Supabase product row to frontend shape
function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    image: row.images?.[0] || null,
    images: row.images || [],
    category: row.category,
    supplementFacts: row.supplement_facts,
    servingInstructions: row.serving_instructions,
    warnings: row.warnings,
    stock: row.stock,
    inStock: row.stock > 0,
    sku: row.sku,
    tags: row.tags || [],
    dietaryFlags: row.dietary_flags || [],
    status: row.status,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data.map(mapProduct));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: product.description,
        short_description: product.shortDescription || product.short_description || '',
        price: Number(product.price),
        compare_at_price: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        images: product.images || (product.image ? [product.image] : []),
        category: product.category,
        stock: product.stock ?? 100,
        sku: product.sku || null,
        tags: product.tags || [],
        dietary_flags: product.dietaryFlags || product.dietary_flags || [],
        status: product.status || 'active',
        featured: product.featured || false,
        serving_instructions: product.servingInstructions || product.serving_instructions || '',
        warnings: product.warnings || '',
        supplement_facts: product.supplementFacts || product.supplement_facts || null,
      }])
      .select()
      .single();

    if (error) throw error;
    const mapped = mapProduct(data);
    setProducts(prev => [mapped, ...prev]);
    return mapped;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const payload = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.shortDescription !== undefined) payload.short_description = updates.shortDescription;
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.compareAtPrice !== undefined) payload.compare_at_price = updates.compareAtPrice ? Number(updates.compareAtPrice) : null;
    if (updates.images !== undefined) payload.images = updates.images;
    if (updates.image !== undefined) payload.images = [updates.image];
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.stock !== undefined) payload.stock = Number(updates.stock);
    if (updates.sku !== undefined) payload.sku = updates.sku;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.dietaryFlags !== undefined) payload.dietary_flags = updates.dietaryFlags;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.featured !== undefined) payload.featured = updates.featured;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const mapped = mapProduct(data);
    setProducts(prev => prev.map(p => p.id === id ? mapped : p));
    return mapped;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProduct = useCallback((id) => {
    return products.find(p => p.id === id);
  }, [products]);

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getProduct, refetch: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
