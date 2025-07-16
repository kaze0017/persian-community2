'use client';

import { useEffect } from 'react';
import AddCategoryCard from './components/AddCategoryCard';
import CategoryCard from './components/CategoryCard';

import type { Category } from '@/types/category';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchCategories, addCategory } from '@/app/lib/categoriesSlice';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.categories
  );

  // Fetch categories once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = (newCategory: Omit<Category, 'id'>) => {
    // dispatch addCategory thunk
    dispatch(addCategory(newCategory));
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Manage Categories</h1>

      {loading && <p>Loading categories...</p>}
      {error && <p className='text-red-600'>Error: {error}</p>}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        <AddCategoryCard onAdd={handleAddCategory} />
        {[...categories]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
      </div>
    </div>
  );
}
