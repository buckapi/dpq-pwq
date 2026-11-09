import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { pocketbase, pocketbaseFileUrl } from '../config/pocketbase';
import { Product, ProductVariant } from '../models/product';

export interface ProductSource { getProducts(): readonly Product[]; load?(): Promise<void>; }

interface CatalogRecord extends RecordModel {
  name: string;
  slug: string;
  description?: string;
  category: string;
  brand?: string;
  sku?: string;
  images?: string[];
  tags?: string[];
  featured?: boolean;
  status: string;
  expand?: { category?: { slug?: string } };
}

interface VariantRecord extends RecordModel {
  product: string;
  name: string;
  quantity?: number;
  unit?: string;
  price?: number;
  availability: string;
  is_default?: boolean;
}

interface ImageRecord extends RecordModel {
  product: string;
  file: string;
  alt_text?: string;
  is_published: boolean;
  is_illustrative?: boolean;
}

const CATEGORY_ALIASES: Record<string, string> = {
  'productos-de-limpieza': 'limpieza',
  'higiene-y-papel': 'higiene-papel',
  'control-de-plagas': 'control-plagas',
  'jarceria-y-utensilios': 'jarceria-utensilios',
  'cuidado-de-mascotas': 'cuidado-mascotas',
  'envases-y-accesorios': 'envases-accesorios',
  'papel-y-desechables': 'papel-desechables',
};

function createPocketBaseProductSource(): ProductSource {
  const products = signal<readonly Product[]>([]);

  return {
    getProducts: () => products(),
    async load(): Promise<void> {
      try {
        const [records, variants, images] = await Promise.all([
          pocketbase.collection<CatalogRecord>('products').getFullList({
            sort: 'sort_order,name',
            expand: 'category',
          }),
          pocketbase.collection<VariantRecord>('product_variants').getFullList({
            sort: 'sort_order,name',
          }),
          pocketbase.collection<ImageRecord>('product_images').getFullList({
            sort: 'sort_order',
          }),
        ]);

        const variantsByProduct = new Map<string, VariantRecord[]>();
        for (const variant of variants) {
          const group = variantsByProduct.get(variant.product) ?? [];
          group.push(variant);
          variantsByProduct.set(variant.product, group);
        }

        const imagesByProduct = new Map<string, ImageRecord[]>();
        for (const image of images) {
          const group = imagesByProduct.get(image.product) ?? [];
          group.push(image);
          imagesByProduct.set(image.product, group);
        }

        products.set(records.map((record) => {
          const productVariants = (variantsByProduct.get(record.id) ?? []).map((variant) => ({
            id: variant.id,
            name: variant.name || [variant.quantity, variant.unit].filter(Boolean).join(' '),
            presentationType: variant.unit || variant.name,
            sku: undefined,
            priceMxn: variant.price,
            availability: variant.availability === 'available'
              ? 'in_stock' as const
              : variant.availability === 'out_of_stock'
                ? 'out_of_stock' as const
                : 'unknown' as const,
          }));
          const imageRecords = imagesByProduct.get(record.id) ?? [];
          const productImages = imageRecords.map((image) => ({
            url: pocketbaseFileUrl(image.id, 'product_images', image.file),
            alt: image.alt_text || record.name,
            illustrative: image.is_illustrative,
          }));
          const directImages = (record.images ?? []).map((filename) => ({
            url: pocketbaseFileUrl(record.id, 'products', filename),
            alt: record.name,
          }));
          const defaultVariant = (variantsByProduct.get(record.id) ?? []).find((variant) => variant.is_default);
          const categorySlug = record.expand?.category?.slug ?? '';

          return {
            id: record.id,
            slug: record.slug,
            name: record.name,
            description: record.description ?? '',
            categoryId: CATEGORY_ALIASES[categorySlug] ?? (categorySlug || record.category),
            images: productImages.length ? productImages : directImages,
            brand: record.brand,
            sku: record.sku,
            variants: productVariants,
            priceMxn: defaultVariant?.price,
            availability: record.status === 'out_of_stock'
              ? 'out_of_stock' as const
              : productVariants.length && productVariants.every((variant) => variant.availability === 'out_of_stock')
              ? 'out_of_stock' as const
              : productVariants.some((variant) => variant.availability === 'in_stock')
                ? 'in_stock' as const
                : 'unknown' as const,
            status: record.status === 'draft'
              ? 'draft' as const
              : record.status === 'archived'
                ? 'archived' as const
                : 'published' as const,
            tags: Array.isArray(record.tags) ? record.tags : [],
            featured: Boolean(record.featured),
            createdAt: record['created'],
            updatedAt: record['updated'],
          };
        }));
      } catch (error) {
        products.set([]);
        console.error('No se pudo cargar el catálogo público de DPQ.', error);
      }
    },
  };
}

export const PRODUCT_SOURCE = new InjectionToken<ProductSource>('PRODUCT_SOURCE', {
  providedIn: 'root', factory: createPocketBaseProductSource
});
export interface ProductFilters { category?: string; query?: string; tag?: string; presentation?: string; }
const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-MX').trim();

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly source = inject(PRODUCT_SOURCE);

  getProducts(filters: ProductFilters = {}): readonly Product[] {
    const query = normalize(filters.query ?? '');
    return this.source.getProducts()
      .filter(product => !filters.category || product.categoryId === filters.category)
      .filter(product => !query || normalize(`${product.name} ${product.description}`).includes(query))
      .filter(product => !filters.tag || product.tags.some(tag => normalize(tag) === normalize(filters.tag!)))
      .filter(product => !filters.presentation || product.variants.some(variant => variant.presentationType === filters.presentation))
      .sort((a, b) => a.name.localeCompare(b.name, 'es-MX'));
  }
  getBySlug(slug: string): Product | undefined { return this.getProducts().find(product => product.slug === slug); }
  getFeatured(): readonly Product[] { return this.getProducts().filter(product => product.featured); }
  getAvailableVariants(product: Product): readonly ProductVariant[] { return product.variants.filter(variant => variant.availability === 'in_stock'); }
  getPresentationTypes(): readonly string[] { return [...new Set(this.getProducts().flatMap(product => product.variants.map(variant => variant.presentationType)))].sort((a, b) => a.localeCompare(b, 'es-MX')); }
}
