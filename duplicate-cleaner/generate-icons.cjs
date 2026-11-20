// Genera iconos PNG para la PWA usando sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync(path.join(__dirname, 'public', 'icon.svg'));

const sizes = [
  { size: 64,  name: 'favicon-64x64.png' },
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function run() {
  for (const { size, name } of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, 'public', name));
    console.log(`✓ public/${name}`);
  }
  await sharp(svg).resize(32, 32).png().toFile(path.join(__dirname, 'public', 'favicon.ico'));
  console.log('✓ public/favicon.ico');
  console.log('\n✅ Todos los iconos generados');
}

run().catch(console.error);
