
const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');

// TODO need to change this to a ready display with info
const State = () => {
  return new Promise((resolve, reject) => {

    setTimeout(function () {
      try {
        let display = Display.openDisplay(DisplayConfig);
        Display.drawPNGBitmap(display, Path.join(__dirname, '../images', 'cb1.png'));
      }
      catch(e) {
        console.log('E', e.toString());
      }
      resolve();
    }, 1000);
  });
};




module.exports = State;
