import { Banner } from "./banner";
import { RestaurantProduct } from "./RestaurantProduct";

// src/types/business.ts
export type Business = {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  category?: string;
  ownerImageUrl?: string;
  logoUrl?: string;
  bannerImageUrls?:Banner 
  businessCardUrl?: string;
  // createdAt?: Timestamp | null;
  businessConfig?: BusinessConfig;
  isSponsored?: boolean;
  hasPromotions?: boolean;
  isTrusted?: boolean;
  isNew?: boolean;
};

export type BusinessConfig = {
  headerConfig?: BusinessHeaderConfig;
  aboutConfig?: BusinessAboutConfig
  galleryConfig?: BusinessGalleryConfig
  servicesConfig?: BusinessServicesConfig;
  rewardsConfig?: BusinessRewardsConfig;
  clientConfig?: BusinessClientConfig;
  googleReviewsConfig?: BusinessGoogleReviewsConfig;
  contactConfig?: BusinessContactConfig;
  productsConfig?: BusinessProductsConfig;
}

export type BusinessHeaderConfig = {
  isEnabled?: boolean;
  logoEnabled?: boolean;
  bannerEnabled?: boolean;
  slogan?: string;
  sloganEnabled?: boolean;
}
export type BusinessAboutConfig = {
  isEnabled?: boolean;
  ownerImageEnabled?: boolean;
  descriptionEnabled?: boolean;
  descriptionTitle?: string;
  description?: string;
};

export type BusinessGalleryConfig = {
  isEnabled?: boolean;
  isUploaderEnabled?: boolean;
  isDisplayEnabled?: boolean;
};

export type BusinessServicesConfig = {
  isEnabled?: boolean;
  services?: BusinessService[];
}

export type BusinessService = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  isAvailable?: boolean;
  // createdAt?: Timestamp | null;
  iconUrl?: string;
  imageUrl?: string;
}

export type BusinessRewardsConfig = {
  isEnabled?: boolean;
  rewards?: BusinessReward[];
}

export type BusinessReward = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  iconUrl?: string;
};

export type BusinessClientConfig = {
  isEnabled?: boolean;
  clients?: BusinessClient[];
}
export type BusinessClient = {
  id: string;
  name: string;
  logoUrl?: string;
  phone: string;
  email?: string;
  address?: string;
  // createdAt?: Timestamp | null;
};
export type BusinessGoogleReviewsConfig = {
  isEnabled?: boolean;
  placeId?: string; 
};



export interface BusinessContactConfig {
  isEnabled?: boolean;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export type BusinessProductsConfig = {
  isEnabled?: boolean;
  products?: RestaurantProduct[]
};

