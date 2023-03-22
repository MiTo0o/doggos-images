const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ALL this script does is go into each of the dog directories and convert their profile
// pictures to webp format

sharp.cache(false);

const filePaths = {
    Brownie: '../Brownie',
    Leo : '../Leo',
    Lucky: '../Lucky',
    Elvis: '../Elvis'
}

async function convertFile(imgPath, imageFolderPath) {
    let buffer = await sharp(imgPath, { failOn: 'error' })
      .rotate()
      .webp({quality: 100})
      .toBuffer();
    const imageName = path.parse(imgPath).name
    const outputPath = `${imageFolderPath}/${imageName}.webp`
    return sharp(buffer, { failOn: 'error' }).toFile(outputPath);
  }
  

let convertPromises = []
for (const dog in filePaths) {
    const filePath = filePaths[dog]
    fs.readdirSync(filePath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .forEach(file => {
            const imagePath = `${filePath}/${file.name}`;
            const imageFolderPath = filePath
            convertPromises.push(convertFile(imagePath, imageFolderPath))
        })
}

Promise.all(convertPromises)
    .then(resizePromisesData => {
        for (const dog in filePaths) {
            const filePath = filePaths[dog]
            fs.readdirSync(filePath, { withFileTypes: true })
                .filter(dirent => dirent.isFile())
                .forEach(file => {
                    let imagePath = `${filePath}/${file.name}`;
                    let imageExt = path.parse(imagePath).ext;
                    if (imageExt !== '.webp') {
                        fs.unlinkSync(imagePath)
                    }
                })
          }
    })