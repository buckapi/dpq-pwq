import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreCatalog } from '../../core/site';
@Component({ selector: 'app-footer', imports: [RouterLink], templateUrl: './footer.html' })
export class Footer { protected readonly year = new Date().getFullYear(); private readonly storeCatalog = inject(StoreCatalog); protected get categories() { return this.storeCatalog.categories().slice(0, 6); } }
