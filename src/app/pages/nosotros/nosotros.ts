import { Component, computed, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { StoreCatalog } from '../../core/site';
@Component({ selector:'app-nosotros', imports:[RouterLink], templateUrl:'./nosotros.html' })
export class Nosotros { private readonly storeCatalog = inject(StoreCatalog); protected readonly categories = computed(() => this.storeCatalog.categories().slice(0, 6)); constructor() { inject(Meta).updateTag({name:'description',content:'Conoce DPQ, fabricante y distribuidor de productos químicos e insumos de limpieza en Monterrey.'}); } }
