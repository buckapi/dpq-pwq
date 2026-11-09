import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product';
import { PRODUCT_SOURCE, ProductService } from './product.service';
import { CATALOG_CATEGORIES } from '../site';
import { PROVISIONAL_PRODUCTS } from '../data/productos-provisionales';

describe('ProductService', () => {
  const base: Product = { id: '1', slug: 'uno', name: 'Ácido', description: 'Producto de limpieza', categoryId: 'limpieza', images: [], variants: [{ id: 'v1', name: 'Envase', presentationType: 'envase', availability: 'in_stock' }, { id: 'v2', name: 'Otro', presentationType: 'otro', availability: 'unknown' }], availability: 'unknown', status: 'published', tags: ['Higiene'], featured: true };
  beforeEach(() => TestBed.configureTestingModule({ providers: [{ provide: PRODUCT_SOURCE, useValue: { getProducts: () => [base, { ...base, id: '2', slug: 'borrador', status: 'draft', featured: false }] } }] }));

  it('incluye borradores y filtra por texto, categoría, etiqueta y presentación', () => {
    const service = TestBed.inject(ProductService);
    expect(service.getProducts()).toHaveLength(2);
    expect(service.getProducts({ query: 'acido', category: 'limpieza', tag: 'higiene', presentation: 'envase' })).toHaveLength(2);
    expect(service.getProducts({ query: 'inexistente' })).toHaveLength(0);
    expect(service.getBySlug('borrador')?.status).toBe('draft');
    expect(service.getFeatured()).toHaveLength(1);
    expect(service.getAvailableVariants(base).map(variant => variant.id)).toEqual(['v1']);
  });
});

describe('Fuente preliminar autorizada', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [{ provide: PRODUCT_SOURCE, useValue: { getProducts: () => PROVISIONAL_PRODUCTS } }] }));

  it('conserva 39 borradores con imágenes ilustrativas y categorías reconocidas', () => {
    const products = TestBed.inject(ProductService).getProducts();
    expect(products).toHaveLength(39);
    expect(products.every(product => product.status === 'draft' && product.publicPreview)).toBe(true);
    expect(products.every(product => product.images.length === 1 && product.images[0].illustrative)).toBe(true);
    expect(products.every(product => CATALOG_CATEGORIES.some(category => category.id === product.categoryId))).toBe(true);
    expect(products.every(product => product.priceMxn == null && product.availability === 'unknown')).toBe(true);
    expect(TestBed.inject(ProductService).getProducts({ category: 'jarceria-utensilios' })).toHaveLength(6);
    expect(TestBed.inject(ProductService).getProducts({ category: 'belleza' })).toHaveLength(3);
    expect(TestBed.inject(ProductService).getProducts({ category: 'veladoras' })).toHaveLength(1);
  });
});
