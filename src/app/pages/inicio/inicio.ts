import { Component, computed, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { StoreCatalog } from '../../core/site';
@Component({ selector: 'app-inicio', imports: [RouterLink], templateUrl: './inicio.html' })
export class Inicio {
  private readonly storeCatalog = inject(StoreCatalog);
  protected readonly categories = computed(() => this.storeCatalog.categories().slice(0, 6));
  private readonly router = inject(Router);
  constructor() { inject(Meta).updateTag({name:'description', content:'Productos químicos, insumos de higiene y limpieza profesional para hogares y negocios en Monterrey.'}); }
  protected buscar(value: string, category: string): void { void this.router.navigate(['/productos'], {queryParams: { buscar: value.trim() || null, categoria: category || null }}); }
}
