import { TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { vi } from 'vitest';
import { PRODUCT_SOURCE } from './core/services/product.service';
import { PROVISIONAL_PRODUCTS } from './core/data/productos-provisionales';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the shared navigation and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')?.textContent).toContain('Nosotros');
    expect(compiled.querySelector('footer')?.textContent).toContain('Distribuidora de Productos Químicos');
  });

  it('opens the search dialog and closes it with Escape', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.search-button')!.click();
    await fixture.whenStable();
    expect(compiled.querySelector('[role="dialog"]')).toBeTruthy();
    expect(compiled.querySelector('.search-active .search-popup .form-control')).toBeTruthy();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(compiled.querySelector('[role="dialog"]')).toBeNull();
  });

  it('activa el encabezado fijo y el botón para volver arriba al desplazarse', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 150 });
    window.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(compiled.querySelector('.navbar')?.classList.contains('fixed-top')).toBe(true);
    const button = compiled.querySelector<HTMLButtonElement>('#scroll-top')!;
    expect(button.classList.contains('active')).toBe(true);
    button.click();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    window.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(button.classList.contains('active')).toBe(false);
    scrollTo.mockRestore();
  });
});

describe('Encabezado de páginas interiores', () => {
  beforeEach(() => vi.spyOn(window, 'scrollTo').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('usa el encabezado del catálogo en Nosotros y Contacto', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    for (const path of ['/nosotros', '/contacto', '/categorias', '/shop-grid', '/productos/no-existe']) {
      await router.navigateByUrl(path);
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('.dpq-catalog-header')).toBeTruthy();
    }
    await router.navigateByUrl('/');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.dpq-catalog-header')).toBeNull();
  });

  it('envía la categoría y el texto del buscador al catálogo', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/nosotros');
    await fixture.whenStable();
    const header = fixture.nativeElement as HTMLElement;
    const category = header.querySelector<HTMLDetailsElement>('.dpq-header-category')!;
    const search = header.querySelector<HTMLInputElement>('.header-middle-search input')!;
    expect(category.querySelectorAll('.option').length).toBe(11);
    category.open = true;
    category.dispatchEvent(new Event('toggle'));
    await fixture.whenStable();
    expect(category.classList.contains('open')).toBe(true);
    expect(header.querySelector('.header-middle')?.classList.contains('dpq-dropdown-open')).toBe(true);
    category.querySelectorAll<HTMLButtonElement>('.option')[1].click();
    await fixture.whenStable();
    expect(category.open).toBe(false);
    expect(category.querySelector('.current')?.textContent).toContain('Productos de limpieza');
    search.value = 'cloro';
    header.querySelector<HTMLFormElement>('.header-middle-search form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(router.url).toContain('/shop-grid?');
    expect(router.url).toContain('categoria=limpieza');
    expect(router.url).toContain('buscar=cloro');
  });

  it('vuelve arriba al cambiar de ruta y no al cambiar solo filtros', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] }).compileComponents();
    const viewport = vi.spyOn(TestBed.inject(ViewportScroller), 'scrollToPosition').mockImplementation(() => {});
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/shop-grid');
    await fixture.whenStable();
    expect(viewport).toHaveBeenCalledWith([0, 0]);
    viewport.mockClear();
    await router.navigateByUrl('/shop-grid?categoria=limpieza');
    await fixture.whenStable();
    expect(viewport).not.toHaveBeenCalled();
    viewport.mockRestore();
  });

  it('abre y cierra las categorías con el encabezado fijo', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/shop-grid');
    await fixture.whenStable();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 150 });
    window.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const button = page.querySelector<HTMLButtonElement>('.category-btn')!;
    expect(page.querySelector('.navbar.fixed-top')).toBeTruthy();
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(page.querySelectorAll('#catalog-categories a').length).toBe(11);
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(page.querySelector('#catalog-categories')).toBeNull();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    window.dispatchEvent(new Event('scroll'));
  });

  it('abre la vista rápida de un producto preliminar con aviso de imagen ilustrativa', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), { provide: PRODUCT_SOURCE, useValue: { getProducts: () => PROVISIONAL_PRODUCTS } }]
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/productos?buscar=detergente%20liquido%20para%20ropa');
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    page.querySelector<HTMLButtonElement>('.product-action button')!.click();
    await fixture.whenStable();
    const dialog = page.querySelector<HTMLElement>('.quickview[role="dialog"]')!;
    expect(dialog.textContent).toContain('Detergente líquido para ropa');
    expect(dialog.textContent).toContain('Producto preliminar');
    expect(dialog.textContent).toContain('Imagen ilustrativa generada con IA');
    expect(dialog.querySelector('img')?.getAttribute('src')).toBe('assets/img/products/detergente-liquido-para-ropa.webp');
    dialog.querySelector<HTMLButtonElement>('.btn-close')!.click();
    await fixture.whenStable();
    expect(page.querySelector('.quickview[role="dialog"]')).toBeNull();
  });
});
