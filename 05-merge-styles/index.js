const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist', 'bundle.css');

const writableStream = fs.createWriteStream(destPath);

function createBundle(files) {
  files
    .filter((file) => file.isFile() && path.extname(file.name) === '.css')
    .forEach((file) => {
      const readableStream = fs.createReadStream(
        path.join(srcPath, file.name),
        'utf-8',
      );
      readableStream.pipe(writableStream);
    });
}

fsPromises
  .readdir(srcPath, { withFileTypes: true })
  .then((files) => {
    createBundle(files);
  })
  .catch(console.error);
