export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
}

export interface ProductVariant {
  id: string;
  product: string;
  name: string;
  quantity?: number;
  unit?: string;
  price?: number;
  compare_at_price?: number;
  currency: 'MXN';
  availability: 'available' | 'out_of_stock' | 'unknown';
  is_default: boolean;
  sort_order: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  brand?: string;
  sku?: string;
  images: string[];
  tags?: string[];
  featured: boolean;
  status: 'draft' | 'active' | 'out_of_stock' | 'archived';
  price_mode: 'quote' | 'fixed' | 'from';
  sort_order: number;
  variants?: ProductVariant[];
  productImages?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product: string;
  file: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  is_published: boolean;
  is_illustrative: boolean;
  source?: string;
}

export interface StoreSettings {
  id: string;
  business_name: string;
  business_description?: string;
  logo?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  facebook_url?: string;
  instagram_url?: string;
  opening_hours?: string;
  quote_enabled: boolean;
}

export interface StoreBanner {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  mobile_image?: string;
  button_text?: string;
  button_url?: string;
  is_active: boolean;
  sort_order: number;
  starts_at?: string;
  ends_at?: string;
}
