export type GalleryImage = {
    id?: string;
    url: string;
    title?: string;
    date?: string;
    description?: string;
    caption?: string;
    photographer?: string;
    width?: number;
    height?: number;
    orientation?: 'landscape' | 'portrait' | 'square';
    order?: number;
    credits?: {
      role: string;
      name: string;
    }[];
  };
  
  export type Gallery = {
    id?: string;
    title: string;
    images: GalleryImage[];
    date?: string;
    description?: string;
    caption?: string;
    photographer?: string;
    tags?: string[];
    isPublic?: boolean;
    isFeatured?: boolean;
    // createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };
  