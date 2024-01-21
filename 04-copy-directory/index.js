const fsPromises = require('fs/promises');
const path = require('path');

function makeDir(path) {
  return fsPromises.mkdir(path, { recursive: true });
}

function getFiles(path) {
  return fsPromises.readdir(path);
}

function copyFile(srcPath, destPath) {
  fsPromises.copyFile(srcPath, destPath);
}

function removeAbsentFiles(destPath, srcFiles) {
  getFiles(destPath)
    .then((destFiles) => {
      destFiles
        .filter((f) => !srcFiles.includes(f))
        .forEach((f) => {
          fsPromises.unlink(path.join(destPath, f));
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
