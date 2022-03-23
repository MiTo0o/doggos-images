const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
sharp.cache(false);

const filePaths = {
  Brownie: '../Brownie/images',
  Leo : '../Leo/images',
  Lucky: '../Lucky/images'
}

async function resizeFile(imgPath, imageFolderPath) {
  let buffer = await sharp(imgPath)
    .rotate()
    .resize(900, 600, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .webp({quality: 90})
    .toBuffer();
  const imageName = path.parse(imgPath).name
  const outputPath = `${imageFolderPath}/${imageName}.webp`
  return sharp(buffer).toFile(outputPath);
}

let resizePromises = []
for (const dog in filePaths) {
  const filePath = filePaths[dog]
  fs.readdirSync(filePath).forEach(file => {
    const imagePath = `${filePath}/${file}`;
    const imageFolderPath = filePath
    resizePromises.push(resizeFile(imagePath, imageFolderPath))
  })
}

// Run next part after resizing everything
Promise.all(resizePromises)
  .then(resizePromisesData => {

    // Delete all file types that arent '.webp'
    for (const dog in filePaths) {
      const filePath = filePaths[dog]
      fs.readdirSync(filePath).forEach(file => {
        let imagePath = `${filePath}/${file}`;
        let imageExt = path.parse(imagePath).ext;
        if (imageExt !== '.webp') {
          fs.unlinkSync(imagePath)
        }
      })
    }

    const phrase = 'dong-saya-dae';
    for (const dog in filePaths) {
      const filePath = filePaths[dog]
      fs.readdirSync(filePath).forEach((file, index) => {
        let imagePath = `${filePath}/${file}`;
        // This really doesn't have to be like this but I'm just making sure that file names are unique
        // Just adding making Date.now().toString() isn't good enough since the process is sometimes 
        // faster than 1 millisecond and it will override files 
        let randomString1 = Math.random().toString(36).substring(2)
        let randomString2 = Math.random().toString(36).substring(2)
        let randomPhrase = `${phrase}${randomString1}${randomString2}${index}`
        let renamedPath = `${filePath}/${randomPhrase}.webp`;
        fs.renameSync(imagePath, renamedPath)

      })
    }

    for (const dog in filePaths) {
      const filePath = filePaths[dog]
      fs.readdirSync(filePath).forEach((file, index) => {
        let imagePath = `${filePath}/${file}`;
        let fileNumber = index + 1
        let renamedPath = `${filePath}/${fileNumber}.webp`;
        fs.renameSync(imagePath, renamedPath)
      })
    }

    // Compile img data (ratio and links) to be used for doggos website
    for (const dog in filePaths) {
      const filePath = filePaths[dog]
    
      const writeData = {
        title: dog,
        imgList: []
      }
      
      fs.readdirSync(filePath).forEach(file => {
        const hostedStaticPath = `https://raw.githubusercontent.com/MiTo0o/doggos-static/main/${dog}/images/${file}`
        let imageSize = sizeOf(`${filePath}/${file}`);
    
        const imgInfo = {
          src: hostedStaticPath,
          width: 1,
          // get gcd
          height: Math.round(imageSize.height / imageSize.width * 1000) / 1000
        }

        writeData.imgList.push(imgInfo);
      })
      const data = `export const ${dog} = ${JSON.stringify(writeData)};`;
      fs.writeFileSync(`./compiledData/${dog}.js`, data)
    }
  })
