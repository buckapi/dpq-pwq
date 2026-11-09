import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { SearchPopup } from './components/search-popup/search-popup';
import { ScrollState } from './core/site';
import { QuickProduct } from './components/quick-product/quick-product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, SearchPopup, QuickProduct],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly scroll = inject(ScrollState);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly viewport = inject(ViewportScroller);
  private currentPath = this.router.url.split('?')[0].split('#')[0];

  constructor() {
    this.onScroll();
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(event => {
      const path = event.urlAfterRedirects.split('?')[0].split('#')[0];
      if (path !== this.currentPath) this.viewport.scrollToPosition([0, 0]);
      this.currentPath = path;
    });
  }

  @HostListener('window:scroll') onScroll(): void {
    this.scroll.scrolled.set((this.document.defaultView?.scrollY ?? 0) > 100);
  }

  protected scrollToTop(): void {
    const view = this.document.defaultView;
    const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    view?.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  }
}
