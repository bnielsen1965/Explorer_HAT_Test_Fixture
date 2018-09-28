
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
      return startDisplay('Charge Test\n\nCharging LED on?');
    })
    .then(newDisplay => {
      display = newDisplay;
      return GPIOS.setGPIOState('test_charge');
    })
    .then(() => {
      resolve({
        name: 'test_charge',
        ready: true,
        destroy: destroy,

        up_on_clicked: () => {
          loadState('test_batt')
          .catch(err => {
            console.log(err.toString());
          });
        },

        up_on_doubleclicked: () => {
        },

        down_on_clicked: () => {
          loadState('test_35v')
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
      // need to preset test to make sure battery is detected
      GPIOS.setGPIOOnOff('GPIO_BATT', 'on')
      .then(() => {
        return GPIOS.setGPIOOnOff('GPIO_HAT', 'off');
      })
      .then(() => {
        setTimeout(resolve, 1000);
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


  function destroy() {
    return new Promise((resolve, reject) => {
      // ensure battery does not continue to charge
      GPIOS.setGPIOOnOff('GPIO_BATT', 'off')
      .then(() => {
        display.destroy();
        resolve();
      })
      .catch(err => { reject(err); });
    });
  }
};




module.exports = State;
