'use client';

import { useState } from 'react';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import AddNewProductDialog from '@/app/admin/products/productsTemplate/restaurantComponents/AddNewProductDialog';
import ProductCard from './ProductCard';
import ProductDetailsDialog from './ProductDetailsDialog';

import type { RestaurantProduct, Category } from '@/types/RestaurantProduct';

type Props = {
  category: Category;
  businessId: string;
  isAdmin?: boolean;
};

export default function ProductCategorySection({
  category,
  businessId,
  isAdmin = false,
}: Props) {
  const [addNewItemDialogOpen, setAddNewItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RestaurantProduct | null>(
    null
  );
  const [items, setItems] = useState<RestaurantProduct[]>(category.items ?? []);

  const handleProductAdded = (newItem: RestaurantProduct) => {
    setItems((prev) => [newItem, ...prev]);
  };

  // Update item locally in items state after edit
  const handleProductUpdated = (updatedItem: RestaurantProduct) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setSelectedItem(updatedItem);
  };

  const title = category.name || category.id;

  return (
    <section className='mb-12'>
      {isAdmin ? (
        <SectionPanel>
          <AdminControlsPanel
            title={`${title} Settings`}
            isAdmin={isAdmin}
            buttons={[
              {
                label: 'Add Item',
                onClick: () => setAddNewItemDialogOpen(true),
                // icon: 'plus',
              },
            ]}
          />
          {category.id && (
            <AddNewProductDialog
              businessId={businessId}
              type={category.id}
              open={addNewItemDialogOpen}
              onClose={() => setAddNewItemDialogOpen(false)}
              onAdded={(newItem: RestaurantProduct) => {
                setAddNewItemDialogOpen(false);
                handleProductAdded(newItem);
              }}
            />
          )}
        </SectionPanel>
      ) : (
        <h3 className='text-lg font-bold capitalize mb-6'>{title}</h3>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {selectedItem && (
        <ProductDetailsDialog
          item={selectedItem}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          isAdmin={isAdmin}
          businessId={businessId}
          type={category.id}
          onUpdate={handleProductUpdated} // new prop
        />
      )}
    </section>
  );
}
