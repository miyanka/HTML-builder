const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const assetsSrcPath = path.join(__dirname, 'assets');
const stylesSrcPath = path.join(__dirname, 'styles');
const htmlTemplateSrcPath = path.join(__dirname, 'template.html');
const componentsSrcPath = path.join(__dirname, 'components');
const distPath = path.join(__dirname, 'project-dist');
const assetsDistPath = path.join(distPath, 'assets');
const styleDistPath = path.join(distPath, 'style.css');
const htmlDistPath = path.join(distPath, 'index.html');

buildProjectDist();

function buildProjectDist() {
  makeDir(distPath)
    .then(() => {
      copyDir(assetsSrcPath, assetsDistPath);
      createBundle(stylesSrcPath, styleDistPath);
      createFilledTemplate(
        htmlTemplateSrcPath,
        componentsSrcPath,
        htmlDistPath,
      );
    })
    .catch(console.error);
}

function makeDir(path) {
  return fsPromises.mkdir(path, { recursive: true });
}

function getFiles(path) {
  return fsPromises.readdir(path, { withFileTypes: true });
}

function removeAbsentFiles(destPath, srcFiles) {
  getFiles(destPath)
    .then((destFiles) => {
      destFiles
        .filter((f) => !srcFiles.map((d) => d.name).includes(f.name))
        .forEach((f) => {
          fsPromises.rm(path.join(destPath, f.name), { recursive: true });
        });
    })
    .catch(console.error);
}

function copyDir(srcPath, destPath) {
  makeDir(destPath)
    .then(() => {
      getFiles(srcPath)
        .then((files) => {
          {
            removeAbsentFiles(destPath, files);
            files.forEach((file) => {
              {
                const srcEntryPath = path.join(file.path, file.name);
                const destEntryPath = path.join(destPath, file.name);

                if (file.isFile()) {
                  fsPromises.copyFile(srcEntryPath, destEntryPath);
                } else {
                  copyDir(srcEntryPath, destEntryPath);
                }
              }
            });
          }
        })
        .catch(console.error);
    })
    .catch(console.error);
}

function createBundle(srcPath, destPath) {
  const writableStream = fs.createWriteStream(path.join(destPath));
  getFiles(srcPath)
    .then((files) => {
      files
        .filter(
          (file) =>
            file.isFile() && path.extname(file.name) === path.extname(destPath),
        )
        .forEach((file) => {
          const readableStream = fs.createReadStream(
            path.join(file.path, file.name),
            'utf-8',
          );
          readableStream.pipe(writableStream);
        });
    })
    .catch(console.error);
}

function createFilledTemplate(templateSrcPath, componentsSrcPath, destPath) {
  const writableStream = fs.createWriteStream(destPath);
  const readableStream = fs.createReadStream(templateSrcPath, 'utf-8');

  let content = '';
  readableStream.on('data', (chunk) => (content += chunk));
  readableStream.on('end', () => {
    getFiles(componentsSrcPath)
      .then((files) => {
        Promise.all(
          files
            .filter(
              (file) =>
                file.isFile() &&
                path.extname(file.name) === path.extname(destPath),
            )
            .map((file) => fillTemplate(file)),
        )
          .then(() => writableStream.write(content))
          .catch(console.error);
      })
      .catch(console.error);
  });

  async function fillTemplate(file) {
    const fileExt = path.extname(file.name);
    const fileName = file.name.slice(0, file.name.lastIndexOf(fileExt));

    const fileContent = await fsPromises.readFile(
      path.join(file.path, file.name),
    );
    content = content.replaceAll(`{{${fileName}}}`, fileContent);
  }
}
