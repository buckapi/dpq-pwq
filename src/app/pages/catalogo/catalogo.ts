import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../core/services/product.service';
import { StoreCatalog } from '../../core/site';

@Component({ selector: 'app-catalogo', imports: [RouterLink, ProductCard], templateUrl: './catalogo.html' })
export class Catalogo {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProductService);
  protected readonly data = toSignal(this.route.data);
  protected readonly params = toSignal(this.route.queryParamMap);
  protected readonly isList = computed(() => this.data()?.['view'] === 'list');
  protected readonly categories = inject(StoreCatalog).categories;
  protected readonly presentations = this.service.getPresentationTypes();
  protected readonly products = computed(() => this.service.getProducts({
    category: this.params()?.get('categoria') ?? undefined,
    query: this.params()?.get('buscar') ?? undefined,
    tag: this.params()?.get('etiqueta') ?? undefined,
    presentation: this.params()?.get('presentacion') ?? undefined
  }));
  constructor() { inject(Meta).updateTag({ name: 'description', content: 'Consulta el catálogo de productos de limpieza y químicos de DPQ.' }); }
  protected buscar(value: string): void { this.updateFilter('buscar', value.trim()); }
  protected updateFilter(key: string, value: string): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { [key]: value || null }, queryParamsHandling: 'merge' });
  }
}
