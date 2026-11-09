import PocketBase from 'pocketbase';

const isLocalDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const POCKETBASE_URL = isLocalDevelopment
  ? 'http://127.0.0.1:8090'
  : typeof window !== 'undefined'
    ? window.location.origin
    : 'http://127.0.0.1:8090';
export const pocketbase = new PocketBase(POCKETBASE_URL);

export function pocketbaseFileUrl(recordId: string, collection: string, filename: string, thumb?: string): string {
  return pocketbase.files.getURL({ id: recordId, collectionName: collection }, filename, thumb ? { thumb } : {});
}
