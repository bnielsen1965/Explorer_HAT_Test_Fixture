
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const State = (loadState, stayIdle) => {
  return new Promise((resolve, reject) => {
    GPIOS.setGPIOState('power_on')
    .then(() => {
      return GPIOS.getGPIOValue(GPIO_PINS.inputs.GPIO_HAT_PRESENT.gpio);
    })
    .then(hatPresent => {
      // if HAT is attached then go to ready state
      if (!stayIdle && parseInt(hatPresent) === GPIO_PINS.inputs.GPIO_HAT_PRESENT.on) {
        loadState('ready')
        .then(newState => {
          resolve(newState);
        })
        .catch(err => { reject(err); });
      }
      resolve({});
    })
    .catch(err => { reject(err); });
  });
};

module.exports = State;
