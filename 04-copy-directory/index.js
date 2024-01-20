const fs = require('fs/promises');
const path = require('path');

function makeDir(path) {
  return fs.mkdir(path, { recursive: true });
}

function getFiles(path) {
  return fs.readdir(path);
}

function copyFile(srcPath, destPath) {
  fs.copyFile(srcPath, destPath);
}

function removeAbsentFiles(destPath, srcFiles) {
  getFiles(destPath)
    .then((destFiles) => {
      destFiles
        .filter((f) => !srcFiles.includes(f))
        .forEach((f) => {
          fs.unlink(path.join(destPath, f));
        });
    })
    .catch(console.log);
}

function copyDir() {
  const srcPath = path.join(__dirname, 'files');
  const destPath = path.join(__dirname, 'files-copy');

  makeDir(destPath)
    .then(() => {
      getFiles(srcPath)
        .then((files) => {
          {
            removeAbsentFiles(destPath, files);
            files.forEach((file) =>
              copyFile(path.join(srcPath, file), path.join(destPath, file)),
            );
          }
        })
        .catch(console.log);
    })
    .catch(console.log);
}

copyDir();
