import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { Product } from './core/models/product';
import { PRODUCT_SOURCE } from './core/services/product.service';
import { PROVISIONAL_PRODUCTS } from './core/data/productos-provisionales';

// Datos aislados de prueba: no se publican en el catálogo.
const product: Product = {
  id: 'fixture-1', slug: 'producto-prueba', name: 'Producto de prueba', description: 'Limpiador de prueba',
  categoryId: 'limpieza', images: [], variants: [{ id: 'v1', name: 'Envase de prueba', presentationType: 'envase', availability: 'unknown' }],
  availability: 'unknown', status: 'published', tags: ['prueba'], featured: true
};

describe('Catálogo preliminar DPQ', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideRouter(routes), { provide: PRODUCT_SOURCE, useValue: { getProducts: () => PROVISIONAL_PRODUCTS } }]
  }));
  it('muestra los 39 registros preliminares identificando las imágenes ilustrativas', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/productos');
    expect(harness.routeNativeElement?.textContent).toContain('Catálogo de productos de Distribuidora DPQ.');
    expect(harness.routeNativeElement?.querySelectorAll('.product-item').length).toBe(39);
    expect(harness.routeNativeElement?.textContent).toContain('Imagen ilustrativa generada con IA');
    expect(harness.routeNativeElement?.textContent).not.toContain('Surgical Face Mask');
    await harness.navigateByUrl('/productos?buscar=sin-coincidencias');
    expect(harness.routeNativeElement?.textContent).toContain('No encontramos productos');
  });

  it('conecta filtros y detalle del JSON preliminar sin presentar datos comerciales como confirmados', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/productos?categoria=limpieza&buscar=ropa');
    const page = harness.routeNativeElement!;
    expect(page.querySelectorAll('.product-item').length).toBeGreaterThan(0);
    const link = Array.from(page.querySelectorAll<HTMLAnchorElement>('.product-title a')).find(element => element.textContent?.includes('Detergente líquido para ropa'))!;
    expect(link).toBeTruthy();
    link.click();
    await harness.fixture.whenStable();
    const detail = harness.routeNativeElement!;
    expect(detail.textContent).toContain('Producto preliminar');
    expect(detail.textContent).toContain('Imagen ilustrativa generada con IA');
    expect(detail.textContent).not.toContain('Agotado');
    expect(detail.querySelector('.shop-single-price')?.textContent).toContain('Solicitar cotización');
    const message = new URL(detail.querySelector<HTMLAnchorElement>('.shop-single-action a')!.href).searchParams.get('text');
    expect(message).toContain('Detergente líquido para ropa');
    expect(message).toContain('/productos/detergente-liquido-para-ropa');
  });
});

describe('Navegación y filtros con datos de prueba', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes), { provide: PRODUCT_SOURCE, useValue: { getProducts: () => [product] } }] }));
  it('filtra por búsqueda y categoría y conserva los filtros al cambiar de vista', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/shop-grid?categoria=limpieza&buscar=limpiador');
    expect(harness.routeNativeElement?.querySelectorAll('.product-item').length).toBe(1);
    const link = harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.shop-sort-list')!;
    expect(link.getAttribute('href')).toContain('categoria=limpieza');
    expect(link.getAttribute('href')).toContain('buscar=limpiador');
    link.click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('.shop-item-wrap.item-list')).toBeTruthy();
    await harness.navigateByUrl('/productos?categoria=higiene-papel');
    expect(harness.routeNativeElement?.textContent).toContain('No encontramos productos');
  });

  it('abre el detalle por slug y prepara la cotización de la presentación seleccionada', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/productos');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.product-title a')!.click();
    await harness.fixture.whenStable();
    const page = harness.routeNativeElement!;
    expect(page.querySelector('h1')?.textContent).toContain('Producto de prueba');
    const select = page.querySelector<HTMLSelectElement>('#product-variant')!;
    select.value = 'v1';
    select.dispatchEvent(new Event('change'));
    await harness.fixture.whenStable();
    const link = page.querySelector<HTMLAnchorElement>('.shop-single-action a')!;
    const message = new URL(link.href).searchParams.get('text');
    expect(message).toContain('Producto de prueba');
    expect(message).toContain('Presentación: Envase de prueba');
    expect(message).toContain('/productos/producto-prueba');
    await harness.navigateByUrl('/productos/no-existe');
    expect(harness.routeNativeElement?.textContent).toContain('Producto no encontrado');
  });
});
