'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}`).then(setProduct).catch(() => setError('لم يتم العثور على المنتج'));
  }, [id]);

  if (error) return <div className="container-main py-20 text-center"><h1 className="section-title">{error}</h1><Link href="/products" className="btn-primary mt-6 inline-flex">العودة للمنتجات</Link></div>;
  if (!product) return <div className="container-main py-20 text-center text-secondary-600">جارٍ تحميل المنتج...</div>;

  const image = product.images?.[0]?.image_url || '/placeholder.jpg';
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container-main grid gap-10 rounded-2xl bg-white p-8 md:grid-cols-2">
        <img src={image} alt={product.name} className="h-96 w-full rounded-xl object-cover" />
        <div>
          <h1 className="mb-4 text-3xl font-bold text-secondary-900">{product.name}</h1>
          <p className="mb-6 text-secondary-600">{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</p>
          <div className="mb-8 text-3xl font-bold text-primary-600">{product.price} {product.currency === 'USD' ? '$' : 'ل.س'}</div>
          <button className="btn-primary">أضف للسلة</button>
        </div>
      </div>
    </div>
  );
}
