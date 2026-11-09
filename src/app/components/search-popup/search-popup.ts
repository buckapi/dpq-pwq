import { Component, ElementRef, HostListener, afterEveryRender, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchState } from '../../core/site';
@Component({ selector: 'app-search-popup', templateUrl: './search-popup.html' })
export class SearchPopup {
  protected readonly state = inject(SearchState);
  private readonly router = inject(Router);
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private previous: HTMLElement | null = null;
  private focused = false;
  constructor() { afterEveryRender(() => { if (this.state.open() && !this.focused) { this.previous = document.activeElement as HTMLElement; this.input()?.nativeElement.focus(); this.focused = true; } }); }
  protected close(): void { this.state.open.set(false); this.focused = false; this.previous?.focus(); }
  protected submit(term: string): void { this.close(); void this.router.navigate(['/shop-grid'], { queryParams: term.trim() ? { buscar: term.trim() } : {} }); }
  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const dialog = event.currentTarget as HTMLElement;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button, input'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  @HostListener('document:keydown.escape') onEscape(): void { if (this.state.open()) this.close(); }
}
