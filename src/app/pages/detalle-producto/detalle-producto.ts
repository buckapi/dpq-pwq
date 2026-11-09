import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../core/services/product.service';
import { QuotationService } from '../../core/services/quotation.service';
import { StoreCatalog } from '../../core/site';

@Component({ selector: 'app-detalle-producto', imports: [CurrencyPipe, RouterLink, ProductCard], templateUrl: './detalle-producto.html' })
export class DetalleProducto {
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  private readonly service = inject(ProductService);
  private readonly storeCatalog = inject(StoreCatalog);
  protected readonly quote = inject(QuotationService);
  protected readonly product = computed(() => this.service.getBySlug(this.params()?.get('slug') ?? ''));
  protected readonly category = computed(() => this.storeCatalog.categories().find(category => category.id === this.product()?.categoryId));
  protected readonly related = computed(() => {
    const product = this.product();
    return product ? this.service.getProducts({ category: product.categoryId }).filter(item => item.id !== product.id).slice(0, 4) : [];
  });
  protected readonly selectedVariantId = signal('');
  protected readonly imageIndex = signal(0);
  protected readonly selectedVariant = computed(() => this.product()?.variants.find(variant => variant.id === this.selectedVariantId()));
  protected readonly price = computed(() => this.product()?.status === 'published' ? (this.selectedVariant() ? this.selectedVariant()?.priceMxn : this.product()?.priceMxn) : undefined);
  protected readonly tab = signal<'descripcion' | 'informacion'>('descripcion');
  constructor() {
    inject(Meta).updateTag({ name: 'description', content: 'Consulta información y cotiza productos de limpieza de DPQ.' });
    effect(() => { this.params()?.get('slug'); this.selectedVariantId.set(''); this.imageIndex.set(0); this.tab.set('descripcion'); });
  }
}
