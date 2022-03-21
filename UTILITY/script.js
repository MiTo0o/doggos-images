const fs = require('fs');
const sizeOf = require('image-size');

const filePaths = {
  Brownie: '../Brownie/images',
  Leo : '../Leo/images',
  Lucky: '../Lucky/images'
}

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
      height: Math.round(imageSize.height / imageSize.width * 1000) / 1000
    }

    writeData.imgList.push(imgInfo);
  })
  const data = `export const ${dog} = ${JSON.stringify(writeData)};`;
  fs.writeFile(`./compiledData/${dog}.js`, data, (err) => {
    if (err) throw err;
    console.log('complete')
  })
}

