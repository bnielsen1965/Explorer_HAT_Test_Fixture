
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const GPIO_EXPORT_PAUSE_MS = 1000;

const StateModule = (loadState) => {
  return new Promise((resolve, reject) => {
    GPIOS.exportGPIOs()
   .then(() => {
      // give export time to complete
      setTimeout(() => {
        GPIOS.setGPIOState('power_on')
        .then(() => {
          watchHATPresent();
          return loadState('idle');
        })
        .then(newState => {
          resolve(newState);
        })
        .catch(err => { reject(err); });
      }, GPIO_EXPORT_PAUSE_MS);
    })
    .catch(err => { reject(err); });
  });


  function watchHATPresent() {
    // watch for HAT present
    GPIOS.watchGPIO(GPIO_PINS.inputs.GPIO_HAT_PRESENT.gpio, value => {
      // HAT changed
      if (parseInt(value) === GPIO_PINS.inputs.GPIO_HAT_PRESENT.on) {
        // HAT present
        loadState('hat_on')
        .catch(err => {
          console.log(err.toString());
        });
      }
      else {
        // HAT removed
        loadState('idle')
        .catch(err => {
          console.log(err.toString());
        });
      }
    });
  }
};

module.exports = StateModule;
