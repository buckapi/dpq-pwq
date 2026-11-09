import source from '../../pages/catalogo/dpq_catalogo_con_imagenes.json';
import { Product, ProductStatus, ProductAvailability, ProductVariant } from '../models/product';

// El usuario autorizó mostrar esta fuente como preliminar; se conserva `draft`.
// Solo estos registros reciben publicPreview, no otros borradores futuros.
const categoryIds: Readonly<Record<string, string>> = {
  jarceria: 'jarceria-utensilios', industrial: 'limpieza-industrial',
  mascotas: 'cuidado-mascotas', envases: 'envases-accesorios', desechables: 'papel-desechables'
};
const previewIds = new Set(Array.from({ length: 39 }, (_, index) => `dpq-${String(index + 1).padStart(3, '0')}`));
interface PreliminaryRecord {
  id: string; slug: string; name: string; description: string | null; categoryId: string;
  images: string[]; brand: string | null; variants: ProductVariant[]; price: number | null;
  availability: ProductAvailability; status: ProductStatus; featured: boolean;
  evidenceLevel: string; reviewNote: string; sourceScreenshots: string[];
  imageStatus: string; imageReviewRequired: boolean;
}

export const PROVISIONAL_PRODUCTS: readonly Product[] = (source.products as PreliminaryRecord[]).map(record => ({
  id: record.id,
  slug: record.slug,
  name: record.name,
  description: record.description ?? '',
  categoryId: categoryIds[record.categoryId] ?? record.categoryId,
  images: record.images.map(url => ({ url, alt: `Ilustración de ${record.name}`, illustrative: record.imageStatus === 'illustrative_ai_unverified', reviewRequired: record.imageReviewRequired })),
  brand: record.brand ?? undefined,
  variants: record.variants,
  priceMxn: typeof record.price === 'number' ? record.price : undefined,
  availability: record.availability,
  status: record.status,
  publicPreview: record.status === 'draft' && previewIds.has(record.id),
  tags: [],
  featured: record.featured,
  provenance: { sourceCategoryId: record.categoryId, evidenceLevel: record.evidenceLevel, reviewNote: record.reviewNote, sourceScreenshots: record.sourceScreenshots, imageStatus: record.imageStatus }
}));
