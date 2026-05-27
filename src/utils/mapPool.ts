/** Chạy fn theo lô — tránh bắn quá nhiều HTTP song song làm 502 */
export async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  if (items.length === 0) return [];
  const limit = Math.max(1, Math.min(concurrency, items.length));
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    for (;;) {
      const i = nextIndex;
      nextIndex += 1;
      if (i >= items.length) break;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

/** Giữ 1 bàn / tableName (phòng duplicate từ API) */
export function uniqueByTableName<T extends { tableName?: string }>(
  rows: T[]
): T[] {
  const map = new Map<string, T>();
  for (const row of rows) {
    const name = row?.tableName;
    if (name) map.set(name, row);
  }
  return Array.from(map.values());
}
