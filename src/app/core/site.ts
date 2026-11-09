import { Injectable, signal } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { pocketbase, pocketbaseFileUrl } from './config/pocketbase';
import { ProductCategory } from './models/product';

export const CATEGORIES: ProductCategory[] = [
  { name: 'Productos de limpieza', slug: 'limpieza', icon: 'cleaning', description: 'Detergentes, desengrasantes y limpiadores multiusos.' },
  { name: 'Higiene y papel', slug: 'higiene-papel', icon: 'hygiene', description: 'Jabones, sanitizantes y papel higiénico.' },
  { name: 'Desinfectantes', slug: 'desinfectantes', icon: 'disinfectants', description: 'Productos de desinfección y sanitización.' },
  { name: 'Control de plagas', slug: 'control-plagas', icon: 'pest-control', description: 'Insecticidas y productos especializados.' },
  { name: 'Jarcería y utensilios', slug: 'jarceria-utensilios', icon: 'cleaning-tools', description: 'Escobas, trapeadores, cubetas, fibras y guantes.' },
  { name: 'Aromatizantes', slug: 'aromatizantes', icon: 'fragrances', description: 'Aromatizantes, fragancias y ambientadores.' },
  { name: 'Limpieza industrial', slug: 'limpieza-industrial', icon: 'industrial', description: 'Productos para comercios e industrias.' },
  { name: 'Cuidado de mascotas', slug: 'cuidado-mascotas', icon: 'pet-hygiene', description: 'Shampoo y productos de higiene animal.' },
  { name: 'Envases y accesorios', slug: 'envases-accesorios', icon: 'packaging', description: 'Botellas, recipientes, atomizadores y dispensadores.' },
  { name: 'Papel y desechables', slug: 'papel-desechables', icon: 'paper-products', description: 'Rollos de papel, servilletas y toallas desechables.' }
].map(category => ({ ...category, id: category.slug }));
/** Categorías de la fuente preliminar, pendientes de validación comercial. */
export const REVIEW_CATEGORIES: ProductCategory[] = [
  { id: 'belleza', slug: 'belleza', name: 'Belleza y cuidado personal (por revisar)', icon: 'hygiene', description: '', reviewRequired: true },
  { id: 'veladoras', slug: 'veladoras', name: 'Veladoras (por revisar)', icon: 'fragrances', description: '', reviewRequired: true }
];
export const CATALOG_CATEGORIES: ProductCategory[] = [...CATEGORIES, ...REVIEW_CATEGORIES];

interface CategoryRecord extends RecordModel {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class StoreCatalog {
  readonly categories = signal<ProductCategory[]>(CATEGORIES);

  async load(): Promise<void> {
    try {
      const records = await pocketbase.collection<CategoryRecord>('product_categories').getFullList({
        sort: 'sort_order,name',
        filter: 'is_active = true',
      });
      const fallbacks = new Map(CATEGORIES.map((category) => [category.slug, category]));
      this.categories.set(records.filter((record) => record.name?.trim() && record.slug?.trim()).map((record) => {
        const fallback = fallbacks.get(record.slug);
        return {
          id: record.slug,
          slug: record.slug,
          name: record.name,
          description: record.description || fallback?.description || '',
          icon: record.icon || fallback?.icon || 'cleaning',
          image: record.image ? pocketbaseFileUrl(record.id, 'product_categories', record.image) : undefined,
        };
      }));
    } catch (error) {
      console.error('No se pudieron cargar las categorías públicas de DPQ.', error);
      this.categories.set(CATEGORIES);
    }
  }
}

@Injectable({ providedIn: 'root' })
export class SearchState { readonly open = signal(false); }
@Injectable({ providedIn: 'root' })
export class ScrollState { readonly scrolled = signal(false); }
