import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({ selector: 'app-estado', imports: [RouterLink], template: '<main class="container py-100"><h1>{{ label }}</h1><p>Esta sección está en preparación.</p><a routerLink="/shop-grid" class="theme-btn mt-3">Ver productos</a></main>' })
export class Estado { protected readonly label = inject(ActivatedRoute).snapshot.data['label'] as string; }
