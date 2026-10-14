const https = require('https');
const zlib = require('zlib');

const url = 'https://storage.googleapis.com/eas-workflows-production/logs/966ef70b-7c9d-484d-b639-e27dbeca40c6/ac2041a1-24f4-42a3-b45a-e131d4f4acdb/2026-10-13T23%3A54%3A47Z-c1e50ac3-f216-4be7-820b-ec25d11bce49.txt?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=www-production%40exponentjs.iam.gserviceaccount.com%2F20261014%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20261014T003011Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=811c08625f2eeec6a65bb189b289fd2709126bcd52bea1818a36679d21dce6033b8b63c1a0912f331322deac11d083429ef0bf4de3485bf1adfb8f9b1340ae2404e804f1446ab9e5877506501db10bef5ea2c022cca5602a63f35f4af7196fa5d4e6f288e7dbc186e44968b7c4ac5c64a7c9521af9577a175f5d4a6a7206853e7df2a9c44fb0399cbcfca7f03ebf251a827476926b1018ec996b8a48ff027133f276690b7060eca19e16934f7d024ca34ea4b957eb545e4150e82a5ce0aa66b566c7e8c21b2bcf6dfd0fe9dc17fd998a38c0ae5fba4ee993f1d4fedb37b69b20c441be0b94b1dccd90977f2e9cb9cc7355b12180a51073d43aad0dbc35412115';

https.get(url, (res) => {
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    let text = '';
    try {
      text = zlib.gunzipSync(buffer).toString('utf8');
    } catch {
      text = buffer.toString('utf8');
    }
    const lines = text.split('\n');
    console.log(lines.slice(-50).join('\n'));
  });
});
