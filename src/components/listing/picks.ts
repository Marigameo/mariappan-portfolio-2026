/* The picks tab every listing opens on: the few items worth seeing first, marked
   `featured` in the page's data. Rows that are picks add "picks" to their data-cat. */
export const pickTab = (count: number) => ({ id: 'picks', label: 'Top picks', count });
export const withPick = (cat: string, featured?: boolean) => (featured ? `${cat} picks` : cat);
