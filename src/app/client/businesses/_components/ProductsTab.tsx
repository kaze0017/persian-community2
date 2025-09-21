'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import ProductTypeList from '@/app/admin/products/productsTemplate/restaurantComponents/ProductTypeList';
import AddNewProductTypeDialog from '@/app/admin/products/productsTemplate/restaurantComponents/AddNewProductTypeDialog';
import AddNewProductDialog from '@/app/client/businesses/_components/_subComponents/AddProductDialog';
import { ProductsByType } from '@/types/business';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import {
  fetchBusinessProducts,
  deleteBusinessProductType,
  addBusinessProductType,
  deleteBusinessProduct,
} from '../../clientReducer/clientBusinessReducer';

type Props = {
  businessId: string;
};

export default function ProductsTab({ businessId }: { businessId: string }) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [addTypeDialogOpen, setAddTypeDialogOpen] = useState(false);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [selectedTypeForNewProduct, setSelectedTypeForNewProduct] = useState<
    string | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductsByType | {}>(
    {}
  );

  //   const fetchAndSetProducts = async () => {
  //     setLoading(true);
  //     try {
  //       if (businessId) {
  //         const products = await fetchProducts(businessId);
  //         setProductsByType(products);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch products:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAndSetProducts();
  // }, [businessId]);
  const products: ProductsByType = useAppSelector(
    (state) => state.clientBusiness.selectedBusiness?.products || {}
  );

  const handleAddType = async (type: string) => {
    if (!businessId) return;
    setLoading(true);
    try {
      await dispatch(addBusinessProductType(businessId, type));
      setAddTypeDialogOpen(false);
    } catch (err) {
      console.error('Failed to add product type', err);
      alert('Failed to add product type');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteType = async (type: string) => {
    if (!businessId) return;
    if (!window.confirm(`Delete product type "${type}" and all its items?`))
      return;
    setLoading(true);
    try {
      await dispatch(deleteBusinessProductType(businessId, type));
    } catch (err) {
      console.error('Failed to delete type', err);
      alert('Failed to delete product type');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProduct = async (type: string, productId: string) => {
    if (!businessId) return;
    if (!window.confirm(`Delete this product?`)) return;
    setLoading(true);
    try {
      await dispatch(deleteBusinessProduct(businessId, type, productId));
      setSelectedProduct({});
      setAddProductDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete product', err);
      alert('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId) return;

    const fetchData = async () => {
      setLoading(true);

      await dispatch(fetchBusinessProducts(businessId));
      setLoading(false);
    };
    fetchData();
  }, [businessId]);

  useEffect(() => {
    console.log('products', products);
  }, [products]);
  useEffect(() => {
    console.log('selectedProduct changed', selectedProduct);
    setAddProductDialogOpen(!!Object.keys(selectedProduct).length);
  }, [selectedProduct]);

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Product Types & Items</h2>
          <button
            onClick={() => setAddTypeDialogOpen(true)}
            className='btn btn-outline flex items-center gap-2'
          >
            <PlusIcon className='w-4 h-4' /> Add New Type
          </button>
        </div>
        <ProductTypeList
          productsByType={products || {}}
          loading={loading}
          onAddProduct={(type) => {
            setSelectedTypeForNewProduct(type);
            setAddProductDialogOpen(true);
          }}
          onDeleteType={handleDeleteType}
          setSelectedProduct={setSelectedProduct}
          setSelectedTypeForNewProduct={setSelectedTypeForNewProduct}
        />

        <AddNewProductTypeDialog
          businessId={businessId}
          open={addTypeDialogOpen}
          onClose={() => setAddTypeDialogOpen(false)}
          onAdded={handleAddType}
        />

        {/* {selectedTypeForNewProduct && (
          <AddNewProductDialog
            businessId={businessId}
            type={selectedTypeForNewProduct}
            open={addProductDialogOpen}
            onClose={() => setAddProductDialogOpen(false)}
            onAdded={handleProductAdded}
          />
        )} */}
      </div>
      {selectedTypeForNewProduct && (
        <AddNewProductDialog
          businessId={businessId}
          type={selectedTypeForNewProduct}
          open={addProductDialogOpen}
          onClose={() => {
            setAddProductDialogOpen(false);
            setSelectedProduct({});
            setSelectedTypeForNewProduct(null);
          }}
          product={selectedProduct as any} // Fix this any
        />
      )}
    </>
  );
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      {...props}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
    </svg>
  );
}
