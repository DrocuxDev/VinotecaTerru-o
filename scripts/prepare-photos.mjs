import fs from 'node:fs/promises';
const photos = [
  { name: 'vineyard', id: 'IKMOdY6zB8w', page: 'https://unsplash.com/photos/vineyard-rows-bathed-in-warm-golden-hour-sunlight-IKMOdY6zB8w', photographer: 'Spencer DeMera', alt: 'Hileras de viñedo bajo la luz del atardecer. Fotografía de ambiente.' },
  { name: 'cellar', id: 'nCqucqW7DAo', page: 'https://unsplash.com/photos/a-bunch-of-wine-barrels-lined-up-in-a-cellar-nCqucqW7DAo', photographer: 'Jametlene Reskp', alt: 'Barricas alineadas en una cava. Fotografía de ambiente.' },
  { name: 'landscape', id: 'RCPFjWlv-Oo', page: 'https://unsplash.com/photos/vineyard-rows-with-new-growth-at-sunset-RCPFjWlv-Oo', photographer: 'Sophie Gerrie', alt: 'Paisaje de viñedo al atardecer. Fotografía de ambiente.' },
];
await fs.mkdir('public/images', { recursive: true });
for (const photo of photos) {
  const response = await fetch(photo.page);
  if (!response.ok) throw new Error(`Photo source ${photo.id}: ${response.status}`);
  const html = await response.text();
  const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
  if (!match) throw new Error(`No image metadata for ${photo.id}`);
  const url = new URL(match[1].replaceAll('&amp;', '&'));
  url.search = 'auto=format&fit=crop&w=1600&q=80&fm=webp';
  for (const width of [800, 1600]) {
    url.searchParams.set('w', String(width));
    const image = await fetch(url);
    if (!image.ok) throw new Error(`Photo image ${photo.id}: ${image.status}`);
    const bytes = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(`public/images/${photo.name}-${width}.webp`, bytes);
    console.log(`${photo.name}-${width}: ${bytes.length} bytes`);
  }
}
await fs.writeFile('docs/photos.json', JSON.stringify({ license: 'https://unsplash.com/license', note: 'Ambient stock photography; none depicts TERRUÑO premises or the named Peruvian regions.', photos }, null, 2));
