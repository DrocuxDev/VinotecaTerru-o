import sharp from 'sharp';
import fs from 'node:fs/promises';
const source = 'source-assets/terruno-bottle.png';
const image = sharp(source);
const metadata = await image.metadata();
await image.resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 88 }).toFile('public/images/terruno-bottle.webp');
await sharp(source).resize({ width: 500, withoutEnlargement: true }).webp({ quality: 85 }).toFile('public/images/terruno-bottle-500.webp');
console.log(JSON.stringify({ width: metadata.width, height: metadata.height, inputBytes: (await fs.stat(source)).size, webpBytes: (await fs.stat('public/images/terruno-bottle.webp')).size }));
