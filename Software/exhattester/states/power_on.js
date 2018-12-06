
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const GPIO_EXPORT_PAUSE_MS = 1000;

const StateModule = (loadState) => {
  let counter = null;
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
      if (!counter) {
        let nextState;
        // HAT changed
        if (parseInt(value) === GPIO_PINS.inputs.GPIO_HAT_PRESENT.on) {
          // HAT present
          nextState = 'hat_on';
          /*
          loadState('hat_on')
          .catch(err => {
            console.log(err.toString());
          });
          */
        }
        else {
          // HAT removed
          nextState = 'idle';
          /*
          loadState('idle')
          .catch(err => {
            console.log(err.toString());
          });
          */
        }
        counter = setTimeout(() => {
          loadState(nextState)
          .catch(err => {
            console.log(err.toString());
          });
          counter = null;
        }, 5000);
      }
    });
  }
};

module.exports = StateModule;
