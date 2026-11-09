import { Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { StoreCatalog } from '../../core/site';
@Component({ selector:'app-productos', imports:[RouterLink], templateUrl:'./productos.html' })
export class Productos {
  protected readonly categories = inject(StoreCatalog).categories;
  constructor() { inject(Meta).updateTag({name:'description',content:'Explora las categorías de productos de limpieza, higiene y químicos de DPQ.'}); }
}
