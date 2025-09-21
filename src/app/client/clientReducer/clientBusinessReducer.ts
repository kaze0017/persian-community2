import { Business } from '@/types/business';
import { getDocument } from '@/services/firestoreService';
import {
  fetchServices,
  addService,
  updateService,
  deleteService,
} from '@/services/business/servicesApi';
import { BusinessService, BusinessContactConfig } from '@/types/business';
import {
  deleteDescription,
  setDescription,
} from '@/services/business/aboutApi';
import { setContacts } from '@/services/business/contactsApi';
import {
  fetchGoogleId,
  setGoogleId,
  deleteGoogleId,
} from '@/services/business/googleIdApi';
import {
  setAboutEnabled as uiSetAboutEnabled,
  setGoogleReviewsEnabled as uiSetGoogleReviewsEnabled,
  setServicesEnabled as uiSetServicesEnabled,
  setContactEnabled as uiSetContactEnabled,
} from '@/services/business/uiApi';
import {
  saveProduct,
  deleteProduct,
  Product,
  addProductType,
  deleteProductType,
  fetchProducts,
} from '@/services/business/productsApi';
import { RestaurantProduct } from '@/types/RestaurantProduct';
import { ProductsByType } from '@/types/business';

type State = {
  businesses: Business[];
  selectedBusiness: Business | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  businesses: [],
  selectedBusiness: null,
  loading: false,
  error: null,
};

// --- Thunks --- //




// Add a new type
export const addBusinessProductType =
  (businessId: string, type: string) => async (dispatch: any) => {
    try {
      await addProductType(businessId, type);

      dispatch({
        type: 'ADD_PRODUCT_TYPE',
        payload: type,
      });
    } catch (error) {
      console.error('Failed to add product type:', error);
    }
  };

// Delete a type
export const deleteBusinessProductType =
  (businessId: string, type: string) => async (dispatch: any) => {
    try {
      await deleteProductType(businessId, type);

      dispatch({
        type: 'DELETE_PRODUCT_TYPE',
        payload: type,
      });
    } catch (error) {
      console.error('Failed to delete product type:', error);
    }
  };

// Fetch all products and types for a business
export const fetchBusinessProducts =
  (businessId: string) => async (dispatch: any) => {
    try {
      const productsByTypeArray = await fetchProducts(businessId);

      // Convert array to object keyed by type
      const productsByType: Record<string, RestaurantProduct[]> = {};
      productsByTypeArray.forEach((p) => {
        productsByType[p.type] = p.items;
      });

      dispatch({
        type: 'SET_PRODUCTS_BY_TYPE',
        payload: productsByType,
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };


export const addOrUpdateProduct =
  (businessId: string, product: Product, type: string, imgFile?: File) =>
  async (dispatch: any) => {
    try {
      const savedProduct = await saveProduct(businessId, type, product, imgFile);
      console.log('Saved product:', savedProduct);
      dispatch({
        type: product.id ? 'UPDATE_PRODUCT' : 'ADD_PRODUCT',
        payload: { type, product: savedProduct }, // 👈 use saved version
      });
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };


export const deleteBusinessProduct =
  (businessId: string, type: string, productId: string) =>
  async (dispatch: any) => {
    try {
      await deleteProduct(businessId, type, productId);

      dispatch({
        type: 'DELETE_PRODUCT',
        payload: { type, productId },
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };
// Toggle About section
export const toggleAboutSection =
  (businessId: string, isEnabled: boolean) => async (dispatch: any) => {
    try {
      await uiSetAboutEnabled(businessId, isEnabled);
      dispatch({
        type: 'SET_ABOUT_ENABLED',
        payload: isEnabled,
      });
    } catch (error) {
      console.error('Failed to toggle About section:', error);
    }
  };

// Toggle Google Reviews section
export const toggleGoogleReviewsSection =
  (businessId: string, isEnabled: boolean) => async (dispatch: any) => {
    try {
      await uiSetGoogleReviewsEnabled(businessId, isEnabled);
      dispatch({
        type: 'SET_GOOGLE_REVIEWS_ENABLED',
        payload: isEnabled,
      });
    } catch (error) {
      console.error('Failed to toggle Google Reviews section:', error);
    }
  };

// Toggle Services section
export const toggleServicesSection =
  (businessId: string, isEnabled: boolean) => async (dispatch: any) => {
    try {
      await uiSetServicesEnabled(businessId, isEnabled);
      dispatch({
        type: 'SET_SERVICES_ENABLED',
        payload: isEnabled,
      });
    } catch (error) {
      console.error('Failed to toggle Services section:', error);
    }
  };

  // Toggle Contact section
export const toggleContactSection =
  (businessId: string, isEnabled: boolean) => async (dispatch: any) => {
    try {
      await uiSetContactEnabled(businessId, isEnabled);
      dispatch({
        type: 'SET_CONTACT_ENABLED',
        payload: isEnabled,
      });
    } catch (error) {
      console.error('Failed to toggle Contact section:', error);
    }
  };

export const addOrUpdateContacts =
  (businessId: string, contacts: BusinessContactConfig) =>
  async (dispatch: any) => {
    try {
      await setContacts(businessId, contacts);

      // Optimistically update Redux
      dispatch({
        type: 'SET_CONTACTS',
        payload: contacts,
      });
    } catch (error) {
      console.error('Failed to set contacts:', error);
    }
  };

export const removeContacts = (businessId: string) => async (dispatch: any) => {
  try {
    // remove = write an empty object
    await setContacts(businessId, {});

    dispatch({
      type: 'DELETE_CONTACTS',
    });
  } catch (error) {
    console.error('Failed to delete contacts:', error);
  }
};
// --- Thunks for Google Place ID --- //
export const fetchBusinessGoogleId =
  (businessId: string) => async (dispatch: any) => {
    try {
      const googlePlaceId = await fetchGoogleId(businessId);
      dispatch({
        type: 'SET_GOOGLE_PLACE_ID',
        payload: googlePlaceId,
      });
    } catch (error) {
      console.error('Failed to fetch Google Place ID:', error);
    }
  };

export const addOrUpdateGoogleId =
  (businessId: string, googlePlaceId: string) => async (dispatch: any) => {
    try {
      await setGoogleId(businessId, googlePlaceId);
      dispatch({
        type: 'SET_GOOGLE_PLACE_ID',
        payload: googlePlaceId,
      });
    } catch (error) {
      console.error('Failed to set Google Place ID:', error);
    }
  };

export const removeGoogleId = (businessId: string) => async (dispatch: any) => {
  try {
    await deleteGoogleId(businessId);
    dispatch({
      type: 'DELETE_GOOGLE_PLACE_ID',
    });
  } catch (error) {
    console.error('Failed to delete Google Place ID:', error);
  }
};

// --- Thunks for description --- //
export const addOrUpdateDescription =
  (businessId: string, description: string) => async (dispatch: any) => {
    try {
      await setDescription(businessId, description);

      // Optimistically update Redux
      dispatch({
        type: 'SET_DESCRIPTION',
        payload: description,
      });
    } catch (error) {
      console.error('Failed to set description:', error);
    }
  };

export const removeDescription =
  (businessId: string) => async (dispatch: any) => {
    try {
      await deleteDescription(businessId);

      dispatch({
        type: 'DELETE_DESCRIPTION',
      });
    } catch (error) {
      console.error('Failed to delete description:', error);
    }
  };

// fetch a business by ID (with its services)
export const fetchBusinessById = (id: string) => async (dispatch: any) => {
  console.log('Reducer - Fetching business with ID:', id);
  dispatch({ type: 'FETCH_BUSINESSES_PENDING' });
  try {
    let business = await getDocument('businesses', id);
    if (!business) {
      throw new Error(`Business with ID "${id}" not found.`);
    }

    const services = await fetchServices(id);

    dispatch({
      type: 'SET_SELECTED_BUSINESS',
      payload: { ...business, services },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch business';
    dispatch({ type: 'FETCH_BUSINESSES_REJECTED', payload: message });
  }
};

export const addBusinessService =
  (businessId: string, service: Omit<BusinessService, 'id'>) =>
  async (dispatch: any) => {
    try {
      const newService: BusinessService = await addService(businessId, service);

      dispatch({
        type: 'ADD_SERVICE',
        payload: newService, // already has id included
      });
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

// update an existing service
export const updateBusinessService =
  (businessId: string, serviceId: string, updates: Partial<BusinessService>) =>
  async (dispatch: any) => {
    try {
      console.log(
        'Updating service in reducer:',
        businessId,
        serviceId,
        updates
      );
      const updatedService = await updateService(
        businessId,
        serviceId,
        updates
      );

      // fetch the full updated service
      dispatch({
        type: 'UPDATE_SERVICE',
        payload: updatedService,
      });
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

// delete a service
export const deleteBusinessService =
  (businessId: string, serviceId: string) => async (dispatch: any) => {
    try {
      await deleteService(businessId, serviceId);
      dispatch({
        type: 'DELETE_SERVICE',
        payload: serviceId,
      });
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

// --- Reducer --- //

export const clientBusinessReducer = (
  state = initialState,
  action: { type: string; payload?: any }
): State => {
  switch (action.type) {
    case 'FETCH_BUSINESSES':
      return { ...state, businesses: action.payload, loading: false };
    case 'FETCH_BUSINESSES_PENDING':
      return { ...state, loading: true, error: null };
    case 'FETCH_BUSINESSES_REJECTED':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SELECTED_BUSINESS':
      console.log('Reducer - Setting selected business:', action.payload);
      return {
        ...state,
        selectedBusiness: action.payload,
        loading: false,
        error: null,
      };
    case 'CLEAR_SELECTED_BUSINESS':
      return { ...state, selectedBusiness: null };
    case 'UPDATE_SERVICE':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              services: state.selectedBusiness.services?.map((s) =>
                s.id === action.payload.id ? action.payload : s
              ),
            },
          }
        : state;

    // --- Service-level mutations --- //
    case 'ADD_SERVICE':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              services: [
                ...(state.selectedBusiness.services || []),
                action.payload,
              ],
            },
          }
        : state;

    case 'UPDATE_SERVICE':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              services: state.selectedBusiness.services?.map((s) =>
                s.id === action.payload.serviceId
                  ? { ...s, ...action.payload.updates }
                  : s
              ),
            },
          }
        : state;
    case 'DELETE_SERVICE':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              services: state.selectedBusiness.services?.filter(
                (s) => s.id !== action.payload
              ),
            },
          }
        : state;
    case 'SET_DESCRIPTION':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                aboutConfig: {
                  ...state.selectedBusiness.businessConfig?.aboutConfig,
                  description: action.payload,
                },
              },
            },
          }
        : state;
    case 'DELETE_DESCRIPTION':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                aboutConfig: {
                  ...state.selectedBusiness.businessConfig?.aboutConfig,
                  description: '',
                },
              },
            },
          }
        : state;
    case 'SET_GOOGLE_PLACE_ID':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                googleReviewsConfig: {
                  ...state.selectedBusiness.businessConfig?.googleReviewsConfig,
                  placeId: action.payload,
                },
              },
            },
          }
        : state;

    case 'DELETE_GOOGLE_PLACE_ID':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                googleReviewsConfig: {
                  ...state.selectedBusiness.businessConfig?.googleReviewsConfig,
                  placeId: '',
                },
              },
            },
          }
        : state;

    case 'SET_CONTACTS':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                contactConfig: action.payload,
              },
            },
          }
        : state;

    case 'DELETE_CONTACTS':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                contactConfig: {},
              },
            },
          }
        : state;
    case 'SET_ABOUT_ENABLED':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                aboutConfig: {
                  ...state.selectedBusiness.businessConfig?.aboutConfig,
                  isEnabled: action.payload,
                },
              },
            },
          }
        : state;

    case 'SET_GOOGLE_REVIEWS_ENABLED':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                googleReviewsConfig: {
                  ...state.selectedBusiness.businessConfig?.googleReviewsConfig,
                  isEnabled: action.payload,
                },
              },
            },
          }
        : state;

    case 'SET_SERVICES_ENABLED':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              businessConfig: {
                ...state.selectedBusiness.businessConfig,
                servicesConfig: {
                  ...state.selectedBusiness.businessConfig?.servicesConfig,
                  isEnabled: action.payload,
                },
              },
            },
          }
        : state;
        // --- Products --- //
    case 'ADD_PRODUCT':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              products: {
                ...state.selectedBusiness.products,
                [action.payload.type]: [
                  ...(state.selectedBusiness.products?.[action.payload.type] ||
                    []),
                  action.payload.product,
                ],
              },
            },
          }
        : state;

    case 'UPDATE_PRODUCT':
      return state.selectedBusiness
      
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              products: {
                ...state.selectedBusiness.products,
                [action.payload.type]:
                  state.selectedBusiness.products?.[action.payload.type]?.map(
                    (p) =>
                      p.id === action.payload.product.id
                        ? action.payload.product
                        : p
                  ) || [],
              },
            },
          }
        : state;

    case 'DELETE_PRODUCT':
      return state.selectedBusiness
        ? {
            ...state,
            selectedBusiness: {
              ...state.selectedBusiness,
              products: {
                ...state.selectedBusiness.products,
                [action.payload.type]:
                  state.selectedBusiness.products?.[
                    action.payload.type
                  ]?.filter((p) => p.id !== action.payload.productId) || [],
              },
            },
          }
        : state;
        case 'SET_PRODUCTS_BY_TYPE':
  return state.selectedBusiness
    ? {
        ...state,
        selectedBusiness: {
          ...state.selectedBusiness,
          products: action.payload, // object keyed by type
        },
      }
    : state;

case 'ADD_PRODUCT_TYPE':
  return state.selectedBusiness
    ? {
        ...state,
        selectedBusiness: {
          ...state.selectedBusiness,
          products: {
            ...state.selectedBusiness.products,
            [action.payload]: [], // initialize empty array for new type
          },
        },
      }
    : state;

case 'DELETE_PRODUCT_TYPE':
  if (!state.selectedBusiness) return state;

  const { [action.payload]: _, ...restProducts } = state.selectedBusiness.products || {};
  return {
    ...state,
    selectedBusiness: {
      ...state.selectedBusiness,
      products: restProducts,
    },
  };



    default:
      return state;
  }
};

// --- Action creators (optional helpers) --- //
export const { setSelectedBusiness, clearSelectedBusiness, updateBusiness } = {
  setSelectedBusiness: (business: Business) => ({
    type: 'SET_SELECTED_BUSINESS',
    payload: business,
  }),
  clearSelectedBusiness: () => ({ type: 'CLEAR_SELECTED_BUSINESS' }),
  updateBusiness: (business: Business) => ({
    type: 'UPDATE_BUSINESS',
    payload: { id: business.id, data: business },
  }),
};

export default clientBusinessReducer;

// export
