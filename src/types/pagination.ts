export type PageParams = { page: number; pageSize: number };
export type Paginated<T> = { list: T[]; totalCount: number } & PageParams;

export function calcSkip({ page, pageSize }: PageParams) {
  const p = Math.max(1, Number(page) || 1);
  const s = Math.max(1, Number(pageSize) || 10);
  return { page: p, pageSize: s, skip: (p - 1) * s, take: s } as const;
}
