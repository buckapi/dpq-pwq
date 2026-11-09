import { CurrencyPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product';
import { QuotationService } from '../../core/services/quotation.service';
import { QuickProductService } from '../../core/services/quick-product.service';
import { StoreCatalog } from '../../core/site';

@Component({ selector: 'app-product-card', imports: [CurrencyPipe, RouterLink], templateUrl: './product-card.html' })
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Input() list = false;
  protected readonly quote = inject(QuotationService);
  protected readonly quick = inject(QuickProductService);
  private readonly storeCatalog = inject(StoreCatalog);
  protected get category() { return this.storeCatalog.categories().find(category => category.id === this.product.categoryId); }
}
