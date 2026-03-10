import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProductForm from '../../components/Admin/AdminProductForm';
import { useProducts } from '../../context/ProductsContext';

export default function ProductNew() {
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await addProduct(data);
    navigate('/admin/products');
  };

  return <AdminProductForm onSubmit={handleSubmit} submitLabel="Create Product" />;
}
