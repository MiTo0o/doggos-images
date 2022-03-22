const sharp = require('sharp');

sharp('../Brownie/images/10.jpg')
  .rotate()
  .resize(600, 400)
  .toFile('xd.webp')