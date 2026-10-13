const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1x1 Teal pixel PNG hex
const validPngBuffer = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d420000000049454e44ae426082',
  'hex'
);

const files = ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'];

files.forEach((file) => {
  const filePath = path.join(assetsDir, file);
  fs.writeFileSync(filePath, validPngBuffer);
  console.log(`Generated asset: ${file}`);
});
