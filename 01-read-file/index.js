const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');

let resultStr = '';
readableStream.on('data', (chunk) => (resultStr += chunk));
readableStream.on('end', () => process.stdout.write(resultStr));
