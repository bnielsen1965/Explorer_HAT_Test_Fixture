
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');
const I2C = require('i2c-bus');

const VoltageConfig = require('../config/voltage.json');
const Voltage = require('../lib/voltage');

const State = (loadState) => {
  let display;
  let i2cBus;
  let voltageInterval;
  return new Promise((resolve, reject) => {
    try {
      display = Display.openDisplay(DisplayConfig);
      display.clear();
      display.write('Charge Test\n- Charge current\n- Battery voltage\n- Charge LED');
    }
    catch(e) {
      console.log('E', e.toString());
    }

    i2cBus = I2C.openSync(1);
    VoltageConfig.i2cBus = i2cBus;
    let voltage = Voltage(VoltageConfig);

    voltageInterval = setInterval(() => {
      voltage()
      .then(function (v) {
        console.log('V', v * 1000)
        display.setCursor(0, 6 * 7);
        display.write('Voltage ' + v + ' VDC');
      })
      .catch(function (e) { console.log(e.toString()); });
    }, 3000);


    GPIOS.setGPIOState('test_charge')
    .then(() => {
      resolve({
        destroy: destroy,

        up_on_clicked: () => {
          loadState('test_display')
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
    })
    .catch(err => { reject(err); });
  });

/*
  function startVoltageInterval() {
    // setup battery voltage monitor
    var i2cBus = I2C.openSync(1);
    var voltageConfig = require('../config/voltage.json')
    voltageConfig.i2cBus = i2cBus
    var voltage = require('../lib/voltage')(voltageConfig)
    setInterval(readVoltage, 3000);
    function readVoltage() {
      voltage()
      .then(function (v) {
        console.log('V', v * 1000)
        display.setCursor(0, 6 * 7);
        display.write('Voltage ' + v + ' VDC');
      })
      .catch(function (e) { reject(e) });
    }
  }
*/
  function destroy() {
    clearInterval(voltageInterval);
    display.destroy();
  }
};




module.exports = State;
