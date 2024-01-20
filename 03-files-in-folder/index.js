const fs = require('fs/promises');
const path = require('path');
const directoryPath = path.join(__dirname, 'secret-folder');

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function getFileInfo(file) {
  const fileExt = path.extname(file.name);
  const fileName = file.name.slice(0, file.name.lastIndexOf(fileExt));

  return {
    name: fileName,
    ext: fileExt.slice(1),
    size: await getFileSize(path.join(file.path, file.name)),
  };
}

function showFileData(info) {
  console.log(`${info.name} - ${info.ext} - ${info.size}b`);
}

fs.readdir(directoryPath, { withFileTypes: true })
  .then((files) =>
    files
      .filter((file) => file.isFile())
      .map(getFileInfo)
      .forEach((p) => p.then((fileInfo) => showFileData(fileInfo))),
  )
  .catch((error) => {
    console.log(error);
  });
