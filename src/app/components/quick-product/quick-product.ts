import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, afterEveryRender, computed, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuickProductService } from '../../core/services/quick-product.service';
import { QuotationService } from '../../core/services/quotation.service';
import { StoreCatalog } from '../../core/site';

@Component({ selector: 'app-quick-product', imports: [CurrencyPipe, RouterLink], templateUrl: './quick-product.html' })
export class QuickProduct {
  protected readonly state = inject(QuickProductService);
  protected readonly quote = inject(QuotationService);
  private readonly storeCatalog = inject(StoreCatalog);
  protected readonly category = computed(() => this.storeCatalog.categories().find(category => category.id === this.state.product()?.categoryId));
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private focusedProduct = '';
  constructor() { afterEveryRender(() => { const product = this.state.product(); if (product && this.closeButton() && this.focusedProduct !== product.id) { this.closeButton()!.nativeElement.focus(); this.focusedProduct = product.id; } if (!product) this.focusedProduct = ''; }); }
  @HostListener('document:keydown.escape') protected onEscape(): void { if (this.state.product()) this.state.close(); }
  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const controls = Array.from((event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button:not([disabled]),a[href]'));
    if (!controls.length) return;
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1].focus(); }
    else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0].focus(); }
  }
}
