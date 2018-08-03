
const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');

const State = (loadState) => {
  return new Promise((resolve, reject) => {
    let images = ['allon.png', 'cb1.png', 'cb2.png'];
    let imageIndex = 0;
    let display = openDisplay(DisplayConfig);
    drawImage(display, images[imageIndex]);

    /*
    try {
      let display = Display.openDisplay(DisplayConfig);
      Display.drawPNGBitmap(display, Path.join(__dirname, '../images', 'allon.png'));
    }
    catch(e) {
      console.log('E', e.toString());
    }
    */
    resolve({

      up_on_clicked: () => {
        imageIndex -= 1;
        if (imageIndex > -1) {
          drawImage(display, images[imageIndex]);
        }
        else {
          loadState('ready')
          .catch(err => {
            console.log(err.toString());
          });
        }
      },

      up_on_doubleclicked: () => {
      },

      down_on_clicked: () => {
        imageIndex += 1;
        if (imageIndex < images.length) {
          drawImage(display, images[imageIndex])
        }
        else {
          loadState('test2')
          .catch(err => {
            console.log(err.toString());
          });
        }
      },

      down_on_doubleclicked: () => {
      },

    });
  });
};

function openDisplay() {
  try {
    return Display.openDisplay(DisplayConfig);
  }
  catch(e) {
    console.log('Error opening display.', e.toString());
    return;
  }
}

function drawImage(display, imageFile) {
  try {
    Display.drawPNGBitmap(display, Path.join(__dirname, '../images', imageFile));
  }
  catch(e) {
    console.log('E', e.toString());
  }
}



module.exports = State;
