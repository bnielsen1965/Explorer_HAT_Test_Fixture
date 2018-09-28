
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const State = (loadState, stayIdle) => {
  return new Promise((resolve, reject) => {
    GPIOS.setGPIOState('idle')
    .then(() => {
      // get HAT present state
      return GPIOS.getGPIOValue(GPIO_PINS.inputs.GPIO_HAT_PRESENT.gpio);
    })
    .then(hatPresent => {
      // if HAT is attached then transition state
      if (!stayIdle && parseInt(hatPresent) === GPIO_PINS.inputs.GPIO_HAT_PRESENT.on) {
        loadState('hat_on')
        .then(newState => {
          resolve(newState);
        })
        .catch(err => { reject(err); });
      }
      else {
        // resolve with the idle state
        resolve({
          name: 'idle',
          ready: true
        });
      }
    })
    .catch(err => { reject(err); });
  });
};

module.exports = State;
