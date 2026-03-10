import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async ({ name, slug, icon }) => {
    const maxOrder = categories.length > 0
      ? Math.max(...categories.map(c => c.display_order || 0))
      : 0;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([{
        name,
        slug,
        icon: icon || 'grid',
        display_order: maxOrder + 1,
      }])
      .select()
      .single();

    if (error) throw error;
    setCategories(prev => [...prev, data]);
    return data;
  }, [categories]);

  const updateCategory = useCallback(async (id, updates) => {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setCategories(prev => prev.map(c => c.id === id ? data : c));
    return data;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <CategoriesContext.Provider value={{
      categories,
      loading,
      addCategory,
      updateCategory,
      deleteCategory,
      refetch: fetchCategories,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
}
