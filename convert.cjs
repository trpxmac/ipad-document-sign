const sharp = require('sharp');
const fs = require('fs');
const svg = fs.readFileSync('public/siriroj-icon.svg', 'utf8');
sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png')
  .then(() => console.log('success'))
  .catch(console.error);
