# DpqPwa

## Migración DPQ

Aplicación Angular standalone con rutas diferidas `/`, `/nosotros`, `/categorias`, `/productos`, `/productos/:slug`, `/shop-grid`, `/shop-list` y `/contacto`. Las dos rutas `shop-*` conservan las vistas de catálogo. Los recursos necesarios se encuentran en `public/assets/`; los HTML originales se conservan fuera de esta aplicación.

El catálogo muestra los 39 registros de `src/app/pages/catalogo/dpq_catalogo_con_imagenes.json` como **preliminares**, por autorización expresa. Conservan su estado `draft`, procedencia, evidencia y notas de revisión: mostrarlos no los convierte en inventario confirmado. Sus imágenes están marcadas en la fuente como ilustraciones generadas con IA sin verificar y se identifican como tales en la interfaz. Los precios, existencias, presentaciones, marcas y nombres comerciales están pendientes de confirmación. Belleza y veladoras aparecen como categorías por revisar en el catálogo, sin alterar las diez categorías principales.

`ProductService` consulta la fuente local a través de `PRODUCT_SOURCE`; búsqueda por nombre/descripción y filtros por categoría, etiqueta y presentación operan sobre los datos visibles, manteniendo sus parámetros en la URL. La vista rápida, el detalle por slug y la cotización por WhatsApp utilizan el registro seleccionado. Los borradores nuevos no se muestran automáticamente: solo los 39 identificadores autorizados tienen vista preliminar. Cuenta, favoritos y carrito siguen en preparación; no existe un backend de catálogo ni un inventario conectado. El formulario de contacto abre WhatsApp con el mensaje preparado y no envía datos a un servidor propio.

El proyecto no tiene SSR, hydration ni service worker configurados; el nombre del directorio no implica disponibilidad offline. Para publicar las rutas del cliente, el servidor de despliegue deberá servir `index.html` para rutas de Angular y se deberá configurar el `base href` según la ubicación de publicación.

Se reutilizan las hojas Bootstrap, Font Awesome y `style.css` de Medion desde `public/assets/css/`, junto con sus fuentes e imágenes necesarias. Las vistas Angular conservan las clases y las estructuras principales de los HTML personalizados. Los controles de navegación, búsqueda y categorías usan Angular en lugar de los plugins originales.

### Auditoría de JavaScript de Medion

La aplicación Angular no carga los scripts de la plantilla. Los menús, búsqueda, navegación y contacto se implementan con Angular. `jquery`, `bootstrap.bundle` y `main.js` eran dependencias generales del tema; `contact-form.js` se utilizaba en contacto. Owl Carousel, WOW, counter-up, jQuery UI, nice-select, countdown, magnific-popup, isotope, imagesloaded, appear y easing son plugins visuales o de vistas heredadas que no se requieren en estas cuatro páginas migradas. Modernizr tampoco se requiere para la experiencia implementada. No hay plugins heredados inicializados ni listeners de plugins que gestionar. La migración visual de carruseles y de imágenes de banners queda pendiente de una revisión de diseño y recursos aprobados.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
