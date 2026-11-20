// Genera iconos PNG para la PWA usando sharp
import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('./public/icon.svg');

const sizes = [
  { size: 64,  name: 'favicon-64x64.png' },
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

for (const { size, name } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`./public/${name}`);
  console.log(`✓ public/${name}`);
}

// También genera un favicon.ico simple (64px PNG que browsers aceptan como ico)
await sharp(svg).resize(32, 32).png().toFile('./public/favicon.ico');
console.log('✓ public/favicon.ico');

console.log('\n✅ Todos los iconos generados');
