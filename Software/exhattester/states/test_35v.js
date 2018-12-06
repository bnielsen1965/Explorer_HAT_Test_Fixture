
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');

const State = (loadState) => {
  let display;

  return new Promise((resolve, reject) => {
    preTest()
    .then(() => {
      return GPIOS.setGPIOState('test_35v');
    })
    .then(() => {
      resolve({
        name: 'test_35v',
        ready: true,
        destroy: destroy,

        up_on_clicked: () => {
          loadState('test_charge')
          .catch(err => {
            console.log(err.toString());
          });
        },

        up_on_doubleclicked: () => {
        },

        down_on_clicked: () => {
          loadState('test_32v')
          .catch(err => {
            console.log(err.toString());
          });
        },

        down_on_doubleclicked: () => {
        },

      });
    })
    .catch(err => { reject(err); });
  });


  function preTest() {
    return new Promise((resolve, reject) => {
      // ensure power is on
      GPIOS.setGPIOOnOff('GPIO_PWR', 'on')
      .then(() => {
        return startDisplay('3.5 Volt Test\n\nPress Load Fixture\nred button 5 sec\n\nLow Battery LED on?');
      })
      .then(newDisplay => {
        display = newDisplay;
        resolve();
      })
      .catch(err => { reject(err); });
    });
  }


  function startDisplay(title) {
    return new Promise((resolve, reject) => {
      try {
        let dis = Display.openDisplay(DisplayConfig);
        dis.clear();
        dis.write(title || '');
        resolve(dis);
      }
      catch(e) {
        reject(new Error(e.toString()));
      }
    });
  }

/*
  function waitCountDown(d, x, y, c) {
    return new Promise((resolve, reject) => {
      let countDown = i => {
        if (!i) {
          resolve();
        }
        else {
          d.setCursor(x * 5, y * 7);
          d.write('   in ... ' + i + ' ...');
          setTimeout(() => { countDown(i - 1); }, 1000);
        }
      }
      countDown(c);
    });
  }
*/

  function destroy() {
    return new Promise((resolve, reject) => {
      // ensure power is turned on
//      GPIOS.setGPIOOnOff('GPIO_PWR', 'on')
//      .then(() => {
        display.destroy();
        resolve();
//      })
//      .catch(err => { reject(err); });
    });
  }
};




module.exports = State;
