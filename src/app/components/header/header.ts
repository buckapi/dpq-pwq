import { Component, ElementRef, HostListener, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { ScrollState, SearchState, StoreCatalog } from '../../core/site';
@Component({ selector: 'app-header', imports: [RouterLink, RouterLinkActive], templateUrl: './header.html' })
export class Header {
  protected readonly search = inject(SearchState);
  protected readonly scroll = inject(ScrollState);
  protected readonly menu = signal(false);
  protected readonly categoriesOpen = signal(false);
  private readonly storeCatalog = inject(StoreCatalog);
  protected get categories() { return this.storeCatalog.categories(); }
  protected readonly selectedCategory = signal('');
  protected readonly categoryDropdownOpen = signal(false);
  protected readonly selectedCategoryLabel = computed(() => this.categories.find(category => category.slug === this.selectedCategory())?.name ?? 'Todas las categorías');
  private readonly categoryDropdown = viewChild<ElementRef<HTMLDetailsElement>>('headerCategory');
  protected readonly router = inject(Router);
  private readonly currentUrl = toSignal(this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), map(event => event.urlAfterRedirects)), { initialValue: this.router.url });
  protected get isCatalog(): boolean {
    const path = this.currentUrl().split('?')[0].split('#')[0];
    return path.startsWith('/productos/') || ['/productos', '/shop-grid', '/shop-list', '/categorias', '/nosotros', '/contacto'].includes(path);
  }
  protected buscar(value: string, category: string): void {
    void this.router.navigate(['/shop-grid'], { queryParams: { buscar: value.trim() || null, categoria: category || null } });
  }
  protected elegirCategoria(category: string, summary: HTMLElement): void {
    this.selectedCategory.set(category);
    const dropdown = this.categoryDropdown()?.nativeElement;
    if (dropdown) dropdown.open = false;
    summary.focus();
  }
  @HostListener('document:click', ['$event']) protected closeCategoryDropdown(event: MouseEvent): void {
    const dropdown = this.categoryDropdown()?.nativeElement;
    if (dropdown?.open && event.target instanceof Node && !dropdown.contains(event.target)) dropdown.open = false;
  }
  protected escapeCategory(event: KeyboardEvent, summary: HTMLElement): void {
    if (event.key !== 'Escape') return;
    const dropdown = this.categoryDropdown()?.nativeElement;
    if (dropdown?.open) { dropdown.open = false; summary.focus(); event.stopPropagation(); }
  }
}
