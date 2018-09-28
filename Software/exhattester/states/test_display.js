
const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');

const State = (loadState) => {
  // TODO may need to change GPIO after coming out of test state
  let display;
  return new Promise((resolve, reject) => {
    let images = ['allon.png', 'cb1.png', 'cb2.png'];
    let imageIndex = 0;
    display = openDisplay(DisplayConfig);
    drawImage(display, images[imageIndex]);
    resolve({
      name: 'test_display',
      ready: true,
      destroy: destroy,

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
          loadState('ready')
          .catch(err => {
            console.log(err.toString());
          });
        }
      },

      down_on_doubleclicked: () => {
      },

    });
  });


  function destroy() {
    return new Promise((resolve, reject) => {
      display.destroy();
      resolve();
    });
  }
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
