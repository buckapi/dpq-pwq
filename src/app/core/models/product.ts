export type ProductAvailability = 'unknown' | 'in_stock' | 'out_of_stock';
export type ProductStatus = 'draft' | 'published' | 'out_of_stock' | 'archived';

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  reviewRequired?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  presentationType: string;
  sku?: string;
  priceMxn?: number;
  availability: ProductAvailability;
}

export interface ProductImage { url: string; alt: string; illustrative?: boolean; reviewRequired?: boolean; }

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  images: readonly ProductImage[];
  brand?: string;
  sku?: string;
  variants: readonly ProductVariant[];
  priceMxn?: number;
  availability: ProductAvailability;
  status: ProductStatus;
  /** Vista preliminar autorizada expresamente; no equivale a publicación validada. */
  publicPreview?: boolean;
  provenance?: { sourceCategoryId: string; evidenceLevel: string; reviewNote: string; sourceScreenshots: readonly string[]; imageStatus?: string };
  tags: readonly string[];
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}
