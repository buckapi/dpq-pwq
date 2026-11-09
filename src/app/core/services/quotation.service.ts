import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { WHATSAPP_NUMBER } from '../config/contact';
import { Product, ProductVariant } from '../models/product';

@Injectable({ providedIn: 'root' })
export class QuotationService {
  private readonly document = inject(DOCUMENT);
  url(product: Product, variant?: ProductVariant): string {
    const productUrl = new URL(`productos/${encodeURIComponent(product.slug)}`, this.document.baseURI).href;
    const message = [`Hola, quiero información sobre ${product.name}.`, ...(variant ? [`Presentación: ${variant.name}`] : []), `Producto: ${productUrl}`].join('\n');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
}
