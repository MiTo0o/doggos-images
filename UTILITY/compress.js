const sharp = require('sharp');

sharp('../Brownie/images/10.jpg')
  .rotate()
  .resize(600, 400, {
    fit: sharp.fit.inside,
    withoutEnlargement: true, 
  })
  .toFile('xd.jpg')