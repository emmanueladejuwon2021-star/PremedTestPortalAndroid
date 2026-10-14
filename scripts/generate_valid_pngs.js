const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crcBuf]);
}

function createPng(width, height, r, g, b, a = 255) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR: width(4), height(4), depth(1)=8, colortype(1)=6(RGBA), comp(1)=0, filter(1)=0, interlace(1)=0
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image scanlines
  const rowSize = 1 + width * 4; // 1 filter byte + RGBA
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1024x1024 Clinical Teal (#0F766E -> R:15, G:118, B:110)
const iconPng = createPng(1024, 1024, 15, 118, 110, 255);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconPng);
console.log('Generated valid 1024x1024 icon.png');

// 1024x1024 Adaptive Icon Foreground
const adaptivePng = createPng(1024, 1024, 15, 118, 110, 255);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptivePng);
console.log('Generated valid 1024x1024 adaptive-icon.png');

// 1024x1024 Splash Icon
const splashPng = createPng(1024, 1024, 15, 118, 110, 255);
fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), splashPng);
console.log('Generated valid 1024x1024 splash-icon.png');

// 48x48 Favicon
const faviconPng = createPng(48, 48, 15, 118, 110, 255);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconPng);
console.log('Generated valid 48x48 favicon.png');
