export function getPageCount(itemCount: number, pageSize: number) {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

export function getPageItems<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
