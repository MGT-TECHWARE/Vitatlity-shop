import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminProductForm from '../../components/Admin/AdminProductForm';
import { useProducts } from '../../context/ProductsContext';

export default function ProductEdit() {
  const { id } = useParams();
  const { getProduct, updateProduct } = useProducts();
  const navigate = useNavigate();
  const product = getProduct(id);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9ca3b4' }}>
        <p>Product not found.</p>
        <Link to="/admin/products" style={{ color: '#6366f1', fontWeight: 600 }}>Back to Products</Link>
      </div>
    );
  }

  const handleSubmit = async (data) => {
    await updateProduct(product.id, data);
    navigate('/admin/products');
  };

  return <AdminProductForm initialData={product} onSubmit={handleSubmit} submitLabel="Update Product" />;
}
