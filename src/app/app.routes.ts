import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', title: 'Inicio | DPQ', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
  { path: 'nosotros', title: 'Nosotros | DPQ', loadComponent: () => import('./pages/nosotros/nosotros').then(m => m.Nosotros) },
  { path: 'productos', pathMatch: 'full', title: 'Productos | DPQ', data: { view: 'grid' }, loadComponent: () => import('./pages/catalogo/catalogo').then(m => m.Catalogo) },
  { path: 'productos/:slug', title: 'Detalle de producto | DPQ', loadComponent: () => import('./pages/detalle-producto/detalle-producto').then(m => m.DetalleProducto) },
  { path: 'categorias', title: 'Categorías | DPQ', loadComponent: () => import('./pages/productos/productos').then(m => m.Productos) },
  { path: 'shop-grid', title: 'Productos | DPQ', data: { view: 'grid' }, loadComponent: () => import('./pages/catalogo/catalogo').then(m => m.Catalogo) },
  { path: 'shop-list', title: 'Productos | DPQ', data: { view: 'list' }, loadComponent: () => import('./pages/catalogo/catalogo').then(m => m.Catalogo) },
  { path: 'shop-single', pathMatch: 'full', redirectTo: 'productos' },
  { path: 'favoritos', title: 'Favoritos | DPQ', data: { label: 'Favoritos' }, loadComponent: () => import('./pages/estado/estado').then(m => m.Estado) },
  { path: 'carrito', title: 'Carrito | DPQ', data: { label: 'Carrito' }, loadComponent: () => import('./pages/estado/estado').then(m => m.Estado) },
  { path: 'cuenta', title: 'Cuenta | DPQ', data: { label: 'Cuenta' }, loadComponent: () => import('./pages/estado/estado').then(m => m.Estado) },
  { path: 'contacto', title: 'Contacto | DPQ', loadComponent: () => import('./pages/contacto/contacto').then(m => m.Contacto) },
  { path: '**', redirectTo: '' }
];
