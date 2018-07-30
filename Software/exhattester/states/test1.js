
const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');

const State = () => {
  return new Promise((resolve, reject) => {

    setTimeout(function () {
      try {
        let display = Display.openDisplay(DisplayConfig);
        Display.drawPNGBitmap(display, Path.join(__dirname, '../images', 'allon.png'));
      }
      catch(e) {
        console.log('E', e.toString());
      }
      resolve();
    }, 500);
  });
};




module.exports = State;
