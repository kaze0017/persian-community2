// 'use client';

// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// import ProductTypeList from './ProductTypeList';
// import AddNewProductTypeDialog from './AddNewProductTypeDialog';
// import AddNewProductDialog from './AddNewProductDialog';
// import { fetchProducts } from './helpers';

// type ProductItem = {
//   id: string;
//   name: string;
//   description?: string;
//   price?: number;
//   imageUrl?: string;
// };

// type ProductsByType = Record<string, { items: ProductItem[] }>;

// type Props = {
//   businessId: string;
// };

// export default function ProductsPage({ businessId }: Props) {
//   const [productsByType, setProductsByType] = useState<ProductsByType>({});
//   const [loading, setLoading] = useState(false);
//   const [addTypeDialogOpen, setAddTypeDialogOpen] = useState(false);
//   const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
//   const [selectedTypeForNewProduct, setSelectedTypeForNewProduct] = useState<
//     string | null
//   >(null);

//   useEffect(() => {
//     const fetchAndSetProducts = async () => {
//       setLoading(true);
//       try {
//         if (businessId) {
//           const products = await fetchProducts(businessId);
//           setProductsByType(products);
//         }
//       } catch (error) {
//         console.error('Failed to fetch products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAndSetProducts();
//   }, [businessId]);

//   const handleTypeAdded = async () => {
//     setAddTypeDialogOpen(false);
//     setLoading(true);
//     const products = await fetchProducts(businessId);
//     setProductsByType(products);
//     setLoading(false);
//   };

//   const handleProductAdded = async () => {
//     setAddProductDialogOpen(false);
//     setLoading(true);
//     const products = await fetchProducts(businessId);
//     setProductsByType(products);
//     setLoading(false);
//   };

//   const handleDeleteType = async (type: string) => {
//     if (!window.confirm(`Delete product type "${type}" and all its items?`))
//       return;
//     try {
//       const itemsRef = collection(
//         db,
//         'businesses',
//         businessId,
//         'products',
//         type,
//         'items'
//       );
//       const itemsSnapshot = await getDocs(itemsRef);
//       const deletePromises = itemsSnapshot.docs.map((doc) =>
//         deleteDoc(doc.ref)
//       );
//       await Promise.all(deletePromises);

//       const typeDocRef = doc(db, 'businesses', businessId, 'products', type);
//       await deleteDoc(typeDocRef);
//       setLoading(true);
//       const products = await fetchProducts(businessId);
//       setProductsByType(products);
//       setLoading(false);
//     } catch (err) {
//       console.error('Failed to delete type', err);
//       alert('Failed to delete product type');
//     }
//   };

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <h2 className='text-xl font-bold'>Product Types & Items</h2>
//         <button
//           onClick={() => setAddTypeDialogOpen(true)}
//           className='btn btn-outline flex items-center gap-2'
//         >
//           <PlusIcon className='w-4 h-4' /> Add New Type
//         </button>
//       </div>

//       <ProductTypeList
//         productsByType={productsByType}
//         loading={loading}
//         onAddProduct={(type) => {
//           setSelectedTypeForNewProduct(type);
//           setAddProductDialogOpen(true);
//         }}
//         onDeleteType={handleDeleteType}
//       />

//       <AddNewProductTypeDialog
//         businessId={businessId}
//         open={addTypeDialogOpen}
//         onClose={() => setAddTypeDialogOpen(false)}
//         onAdded={handleTypeAdded}
//       />

//       {selectedTypeForNewProduct && (
//         <AddNewProductDialog
//           businessId={businessId}
//           type={selectedTypeForNewProduct}
//           open={addProductDialogOpen}
//           onClose={() => setAddProductDialogOpen(false)}
//           onAdded={handleProductAdded}
//         />
//       )}
//     </div>
//   );
// }

// // Helper icon component (replace with your icon)
// function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       fill='none'
//       stroke='currentColor'
//       strokeWidth={2}
//       viewBox='0 0 24 24'
//       {...props}
//     >
//       <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
//     </svg>
//   );
// }
import React from 'react';

export default function ProductsPage() {
  return <div>ProductsPage</div>;
}
