// 'app/businesses/[businessId]/page.tsx'
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchRestaurantProductsWithItems,
  RestaurantProduct,
} from '@/app/lib/restaurantProductSlice';
import RestaurantHeader from './resComponent/RestaurantHeader';
import TabButton from './resComponent/TabButton';
import FeaturedSection from './resComponent/FeaturedSection';
import ProductCategorySection from './resComponent/ProductCategorySection';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';
import ContactSection from '../../components/ContactSection';
import { Business } from '@/types/business';
import AboutSection from './resComponent/AboutSection';

interface props {
  businessId: string;
  isAdmin?: boolean;
  business?: Business;
}

export default function RestaurantTemplate({
  businessId,
  isAdmin = false,
  business = {
    id: '',
    name: '',
    category: '',
    businessConfig: {
      contactConfig: {
        phone: '',
        email: '',
        address: '',
        website: '',
        socialLinks: {},
      },
      googleReviewsConfig: {
        isEnabled: true,
        placeId: '',
      },
    },
  },
}: props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>(
    'products'
  );

  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.restaurantProducts.items);
  const loading = useAppSelector((state) => state.restaurantProducts.loading);

  useEffect(() => {
    if (activeTab === 'products') {
      dispatch(fetchRestaurantProductsWithItems(businessId));
    }
  }, [dispatch, businessId, activeTab]);

  const featuredItems = products
    .flatMap((cat) =>
      cat.items.map((item) => ({ ...item, categoryId: cat.id }))
    )
    .filter((item) => item.featured);

  return (
    <main className='max-w-6xl mx-auto p-6 space-y-10'>
      <RestaurantHeader businessId={businessId} business={business} />

      {/* Tabs */}
      <nav className='flex border-b border-gray-200 dark:border-gray-700 mb-4'>
        <TabButton
          active={activeTab === 'products'}
          onClick={() => setActiveTab('products')}
        >
          Menu
        </TabButton>
        <TabButton
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          About Us
        </TabButton>
      </nav>

      {/* Content */}
      {activeTab === 'overview' && (
        <AboutSection
          businessId={businessId}
          business={business}
          isAdmin={isAdmin}
        />
      )}

      {activeTab === 'products' && (
        <div className='space-y-12'>
          <h2 className='text-2xl font-bold'>Our Menu</h2>

          {loading && <p>Loading products...</p>}

          {featuredItems.length > 0 && (
            <FeaturedSection featuredItems={featuredItems} />
          )}

          {products.map((category: RestaurantProduct) => (
            <ProductCategorySection
              key={category.id}
              category={category}
              businessId={businessId}
              isAdmin={isAdmin}
            />
          ))}

          {!loading && products.length === 0 && (
            <p className='text-muted-foreground'>No products available.</p>
          )}
          <GoogleReviewsSection
            businessId={businessId}
            isAdmin={isAdmin}
            business={business}
          />
          <ContactSection
            businessId={businessId}
            isAdmin={isAdmin}
            business={business}
          />
        </div>
      )}
    </main>
  );
}
