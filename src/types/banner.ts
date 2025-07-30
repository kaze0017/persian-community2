export type Banner = {
  id?: string;
  alt?: string;
  sizes: {
    small?: string;   // ~480px
    medium?: string;  // ~768px
    large?: string;   // ~1080px
    xlarge?: string;  // ~1440px+
  };
  original?: string;  
  createdAt?: number;
};
