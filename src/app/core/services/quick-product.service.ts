import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class QuickProductService {
  readonly product = signal<Product | null>(null);
  private trigger: HTMLElement | null = null;
  open(product: Product, trigger: HTMLElement): void { this.trigger = trigger; this.product.set(product); }
  close(): void { this.product.set(null); this.trigger?.focus(); this.trigger = null; }
}
