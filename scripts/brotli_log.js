const https = require('https');
const fs = require('fs');
const zlib = require('zlib');

const token = process.env.EXPO_TOKEN || 'CbK2NHXlfR1OCHcs312vbBdK33TMUi7J5de2Tyau';
const buildId = 'd34276b7-7a86-4b36-965a-ac78faf322a6';

const query = JSON.stringify({
  query: `query { builds { byId(buildId: "${buildId}") { logFileUrls } } }`
});

const req = https.request(
  {
    hostname: 'api.expo.dev',
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(query),
    },
  },
  (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const json = JSON.parse(data);
      const url = json.data.builds.byId.logFileUrls[0];
      https.get(url, (logRes) => {
        const chunks = [];
        logRes.on('data', c => chunks.push(c));
        logRes.on('end', () => {
          const buf = Buffer.concat(chunks);
          const decompressed = zlib.brotliDecompressSync(buf).toString('utf8');
          const lines = decompressed.split('\n');
          fs.writeFileSync('gradle_log.txt', decompressed, 'utf8');
          console.log('Total log lines:', lines.length);
          const failLines = [];
          lines.forEach((l, idx) => {
            if (l.includes('FAILED') || l.includes('FAILURE') || l.includes('Execution failed') || l.includes('Compose Compiler')) {
              failLines.push(`[${idx}] ${l}`);
            }
          });
          console.log('Gradle failure lines:\n', failLines.slice(-15).join('\n'));
        });
      });
    });
  }
);
req.write(query);
req.end();
