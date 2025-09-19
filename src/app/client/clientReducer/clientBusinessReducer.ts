import { Business } from '@/types/business';
import { getDocument } from '@/services/firestoreService';
import {
  fetchServices,
  addService,
  updateService,
  deleteService,
} from '@/services/business/servicesApi';
import { BusinessService } from '@/types/business';
import { deleteDescription, setDescription } from '@/services/business/aboutApi';

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
import { fetchGoogleId, setGoogleId, deleteGoogleId } from '@/services/business/googleIdApi';
// --- Thunks for Google Place ID --- //
export const fetchBusinessGoogleId = (businessId: string) => async (dispatch: any) => {
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
      console.log('Updating service in reducer:', businessId, serviceId, updates);
      const updatedService = await updateService(businessId, serviceId, updates);

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
