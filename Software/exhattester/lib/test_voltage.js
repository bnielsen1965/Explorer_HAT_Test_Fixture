const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const I2C = require('i2c-bus');

GPIOS.exportGPIOs()
.then(() => {
  var i2cBus = I2C.openSync(1);
  var voltageConfig = require('../config/voltage.json')
  voltageConfig.i2cBus = i2cBus
  var voltage = require('../lib/voltage')(voltageConfig)

  readVoltage(voltage);
  setTimeout(() => { readVoltage(voltage); }, 1000);
})
.catch(err => {
  console.log('E', err)
})

function readVoltage(voltage) {
  voltage()
  .then(function (v) {
    console.log('V', v)
  })
  .catch(function (e) { console.log(e.toString()); });
}
