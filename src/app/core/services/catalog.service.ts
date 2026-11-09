import { Injectable } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { from, Observable, switchMap } from 'rxjs';
import { pocketbase, pocketbaseFileUrl } from '../config/pocketbase';
import { CatalogProduct, ProductCategory, ProductImage, ProductVariant, StoreBanner, StoreSettings } from '../models/catalog';

type ProductRecord = RecordModel & Omit<CatalogProduct, 'id' | 'images' | 'variants'> & { images: string[]; category: string };
type VariantRecord = RecordModel & ProductVariant;

@Injectable({ providedIn: 'root' })
export class CatalogService {
  categories(): Observable<ProductCategory[]> {
    return from(pocketbase.collection<ProductCategory>('product_categories').getFullList({ sort: 'sort_order,name' }));
  }

  products(): Observable<CatalogProduct[]> {
    return from(pocketbase.collection<ProductRecord>('products').getFullList({
      sort: 'sort_order,name',
      expand: 'category',
    })).pipe(switchMap((records) => from(Promise.all(records.map((record) => this.mapProduct(record))))));
  }

  product(slug: string): Observable<CatalogProduct | null> {
    return from(pocketbase.collection<ProductRecord>('products').getFirstListItem(`slug = "${this.escape(slug)}"`, { expand: 'category' }))
      .pipe(switchMap((record) => from(this.mapProduct(record))));
  }

  banners(): Observable<StoreBanner[]> {
    return from(pocketbase.collection<StoreBanner>('banners').getFullList({ sort: 'sort_order' }));
  }

  settings(): Observable<StoreSettings | null> {
    return from(pocketbase.collection<StoreSettings>('store_settings').getFirstListItem('id != ""').catch(() => null));
  }

  private async mapProduct(record: ProductRecord): Promise<CatalogProduct> {
    const variants = await pocketbase.collection<VariantRecord>('product_variants').getFullList({ filter: `product = "${record.id}"`, sort: 'sort_order,name' });
    const productImages = await pocketbase.collection<ProductImage>('product_images').getFullList({ filter: `product = "${record.id}"`, sort: 'sort_order' });
    return {
      ...record,
      id: record.id,
      images: (record.images ?? []).map((image) => pocketbaseFileUrl(record.id, 'products', image)),
      variants,
      productImages: productImages.map((image) => ({ ...image, file: pocketbaseFileUrl(image.id, 'product_images', image.file) })),
    };
  }

  private escape(value: string): string { return value.replaceAll('"', '\\"'); }
}
