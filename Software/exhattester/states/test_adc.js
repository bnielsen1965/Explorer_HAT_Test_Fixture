
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');

const I2C = require('i2c-bus');
const VoltageConfig = require('../config/voltage.json');
const Voltage = require('../lib/voltage');

const ADC_SECONDS = 3;


const State = (loadState) => {
  let display;
  let i2cBus;
  let voltageInterval;

  return new Promise((resolve, reject) => {
    preTest()
    .then(() => {
      return GPIOS.setGPIOState('test_adc');
    })
    .then(() => {
      resolve({
        name: 'test_adc',
        ready: true,
        destroy: destroy,

        up_on_clicked: () => {
          loadState('test_32v')
          .catch(err => {
            console.log(err.toString());
          });
        },

        up_on_doubleclicked: () => {
        },

        down_on_clicked: () => {
          loadState('ready')
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
        return startDisplay('Test ADC\n\nLoad Fixture off.\n\n' + ADC_SECONDS + ' second intervals.');
      })
      .then(newDisplay => {
        display = newDisplay;
        startADC();
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


  function startADC() {
      i2cBus = I2C.openSync(1);
      VoltageConfig.i2cBus = i2cBus;
      let voltage = Voltage(VoltageConfig);

      voltageInterval = setInterval(() => {
        voltage()
        .then(function (v) {
          display.setCursor(0, 6 * 7);
          display.write('Voltage ' + v + ' VDC   ');
        })
        .catch(function (e) { console.log(e.toString()); });
      }, ADC_SECONDS * 1000);
  }



  function destroy() {
    return new Promise((resolve, reject) => {
      clearInterval(voltageInterval);
      display.destroy();
      resolve();
    });
  }
};




module.exports = State;
