const FS = require('fs');
const Path = require('path');
const I2C = require('i2c-bus');
const PngParse = require('pngparse');

const Display = {
  /*
  config parameters...
  {
    "i2cBusNumber": 1,
    "title": " ",
    "height": 64,
    "displayLines": 8
  }
  */
  openDisplay: config => {
    let i2cBus = I2C.openSync(config.i2cBusNumber);
    config.i2cBus = i2cBus;
    return require('./ssd1306')(config);
  },

  drawPNGBitmap: (display, imageFile) => {
    PngParse.parseFile(imageFile, (err, image) => {
      if(err)
        throw err
      display.oled.drawBitmap(image.data);
    });
  },

  write: (display, str) => {
    display.write(str);
  },

  clear: (display) => {
    display.clear();
  },

  dimDisplay: display => {
    display.oled.dimDisplay(true);
  }


};

module.exports = Display;
