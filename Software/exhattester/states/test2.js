
const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');

const State = (loadState) => {
  return new Promise((resolve, reject) => {

    try {
      let display = Display.openDisplay(DisplayConfig);
      Display.drawPNGBitmap(display, Path.join(__dirname, '../images', 'cb1.png'));
    }
    catch(e) {
      console.log('E', e.toString());
    }
    resolve({

      up_on_clicked: () => {
        loadState('test1')
        .catch(err => {
          console.log(err.toString());
        });
      },

      up_on_doubleclicked: () => {
      },

      down_on_clicked: () => {
        loadState('test3')
        .catch(err => {
          console.log(err.toString());
        });
      },

      down_on_doubleclicked: () => {
      },

    });
  });
};




module.exports = State;
