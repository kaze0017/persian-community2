import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { deleteFolder } from './servicesApi';
import { uploadImage } from '../storageService';

// Product type
export type Product = {
  id?: string; // optional for new items
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  createdAt?: number;
  updatedAt?: number;
};

/**
 * Add or update a product in Firestore
 *
 * @param businessId - The business ID
 * @param type - Product type (e.g., "appetizers", "desserts", "meals", "drinks")
 * @param product - The product object
 */

import { RestaurantProduct } from '@/types/RestaurantProduct';

// fetchProducts, saveProduct, deleteProduct

export async function saveProduct(
  businessId: string,
  type: string,
  product: RestaurantProduct,
  file?: File
): Promise<RestaurantProduct> {
  try {
    let productRef;

    if (!product.id) {
      // NEW product → generate ID automatically
      productRef = doc(collection(db, 'businesses', businessId, 'products', type, 'items'));
      product.id = productRef.id; // store generated ID
    } else {
      // EXISTING product → use its ID
      productRef = doc(db, 'businesses', businessId, 'products', type, 'items', product.id);
    }

    let imageUrl: string | undefined = product.imageUrl;

    // Handle image upload if provided
    if (file) {
      await deleteFolder(`businesses/${businessId}/products/${type}/${product.id}`);
      const uploadedUrl = await uploadImage(file, `businesses/${businessId}/products/${type}/${product.id}`, 'icon.jpg');
      imageUrl = uploadedUrl; // keep string | undefined
    }

    const savedProduct: RestaurantProduct = {
      ...product,
      id: productRef.id,
      imageUrl: imageUrl || undefined, // ensure undefined instead of null
    };

    // Save/Update in Firestore
    await setDoc(productRef, savedProduct, { merge: true });

    console.log(`✅ Product saved: ${productRef.id}`);
    return savedProduct;
  } catch (error) {
    console.error('❌ Error saving product:', error);
    throw error;
  }
}

/**
 * Delete a product from Firestore
 *
 * @param businessId - The business ID
 * @param type - Product type (e.g., "appetizers", "desserts", "meals", "drinks")
 * @param productId - The product ID to delete
 */
export async function deleteProduct(
  businessId: string,
  type: string,
  productId: string
): Promise<void> {
  console.log('Deleting product:', businessId, type, productId);
  try {
    const productRef = doc(
      db,
      'businesses',
      businessId,
      'products',
      type,
      'items',
      productId
    );

    await deleteDoc(productRef);
    await deleteFolder(
      `businesses/${businessId}/products/${type}/${productId}`
    );

    console.log(`🗑️ Product deleted: ${productId}`);
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    throw error;
  }
}

export async function addProductType(
  businessId: string,
  type: string
): Promise<void> {
  try {
    const typeRef = doc(db, 'businesses', businessId, 'products', type);
    await setDoc(typeRef, { createdAt: Date.now() }, { merge: true });
    console.log(`✅ Product type created: ${type}`);
  } catch (error) {
    console.error('❌ Error creating product type:', error);
    throw error;
  }
}

/**
 * Delete a product type (and all its items)
 */
export async function deleteProductType(
  businessId: string,
  type: string
): Promise<void> {
  try {
    const itemsRef = collection(
      db,
      'businesses',
      businessId,
      'products',
      type,
      'items'
    );
    const snapshot = await getDocs(itemsRef);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Delete type document
    const typeRef = doc(db, 'businesses', businessId, 'products', type);
    await deleteDoc(typeRef);

    // Optionally delete folder from storage
    await deleteFolder(`businesses/${businessId}/products/${type}`);

    console.log(`🗑️ Product type deleted: ${type}`);
  } catch (error) {
    console.error('❌ Error deleting product type:', error);
    throw error;
  }
}

export type ProductsByType = {
  type: string;
  items: RestaurantProduct[];
};
export async function fetchProducts(
  businessId: string
): Promise<ProductsByType[]> {
  try {
    const productsSnapshot: ProductsByType[] = [];

    // First get all product types
    const typesCollection = collection(
      db,
      'businesses',
      businessId,
      'products'
    );
    const typesSnapshot = await getDocs(typesCollection);

    for (const typeDoc of typesSnapshot.docs) {
      const type = typeDoc.id;

      // Skip any document that isn't a type folder (could contain metadata)
      if (type === 'metadata') continue;

      const itemsCollection = collection(
        db,
        'businesses',
        businessId,
        'products',
        type,
        'items'
      );
      const itemsSnapshot = await getDocs(itemsCollection);

      const items: RestaurantProduct[] = itemsSnapshot.docs.map(
        (doc) => doc.data() as RestaurantProduct
      );

      productsSnapshot.push({
        type,
        items,
      });
    }

    return productsSnapshot;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
}
