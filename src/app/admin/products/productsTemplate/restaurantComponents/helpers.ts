import { collection, getDocs,addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { uploadImage } from '@/services/storageService'; // Your image upload service
import { createDocument } from '../../services';
import type { RestaurantProduct } from '@/types/RestaurantProduct';
import { v4 as uuidv4 } from 'uuid';


export async function fetchAllProductsByType(businessId: string) {

  const productsRef = collection(db, 'businesses', businessId, 'products');
  const productsSnapshot = await getDocs(productsRef);

  const products: Record<string, { items: any[] }> = {};

  for (const productDoc of productsSnapshot.docs) {
    const type = productDoc.id;
    const itemsRef = collection(
      db,
      'businesses',
      businessId,
      'products',
      type,
      'items'
    );
    const itemsSnapshot = await getDocs(itemsRef);

    products[type] = {
      items: itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  }


  return products;
}

export async function addProductItem(
  businessId: string,
  type: string,
  itemData: any
) {
  const itemsRef = collection(
    db,
    'businesses',
    businessId,
    'products',
    type,
    'items'
  );
  const docRef = await addDoc(itemsRef, itemData);
  return docRef.id;
}




export async function updateProductItem(
  businessId: string,
  type: string,
  itemId: string,
  updatedData: any
) {


  const itemDocRef = doc(
    db,
    'businesses',
    businessId,
    'products',
    type,
    'items',
    itemId
  );


  if (updatedData.createdAt && typeof updatedData.createdAt === 'string') {
    updatedData.createdAt = Timestamp.fromDate(new Date(updatedData.createdAt));
  }

  await updateDoc(itemDocRef, updatedData);
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  options: string;
  featured: boolean;
  available: boolean;
}

export async function addProductWithImage(
  businessId: string,
  type: string,
  form: ProductForm,
  selectedImage?: File | null
): Promise<RestaurantProduct> {
  let imageUrl = '';

  if (selectedImage) {
    const imagePath = `businesses/${businessId}/products/${type}/${Date.now()}_${selectedImage.name}`;
    imageUrl = await uploadImage(selectedImage, imagePath);
  }
  const data: Omit<RestaurantProduct, 'fsId'> = {
    id: uuidv4(),
    name: form.name.trim(),
    description: form.description.trim(),
    price: parseFloat(form.price) || 0,
    options: form.options.trim(),
    featured: form.featured,
    isAvailable: form.available,
    imageUrl,
    createdAt: Timestamp.now(),
    type,
  };

  const productPath = `businesses/${businessId}/products/${type}/items`;

  const docId = await createDocument(productPath, data);

  return {
    ...data,
    fsId: docId,
  };
}
