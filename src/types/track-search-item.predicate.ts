import {Collection} from "./track-search-item.type";

export function isCollection(value: unknown): value is Collection {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    Array.isArray((value as Collection).data) &&
    'meta' in value
  );
}
