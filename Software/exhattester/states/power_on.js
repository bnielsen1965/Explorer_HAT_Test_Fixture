
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const StateModule = (loadState) => {
  return new Promise((resolve, reject) => {
    GPIOS.exportGPIOs()
    .then(() => {
      return GPIOS.setGPIOState('power_on');//GPIO_PINS.outputs, GPIO_STATES['power_on']);
    })
    .then(() => {
      // give export time to complete
      setTimeout(() => {
        // watch for HAT present
        GPIOS.watchGPIO(GPIO_PINS.inputs.GPIO_HAT_PRESENT.gpio, value => {
          console.log('HAT CHANGE', value);
          if (parseInt(value) === GPIO_PINS.inputs.GPIO_HAT_PRESENT.on) {
            loadState('ready')
            .catch(err => {
              console.log(err.toString());
            });
          }
          else {
            loadState('idle')
            .catch(err => {
              console.log(err.toString());
            });
          }
        });

        // transition to idle state and resolve with idle in place of power on
        loadState('idle')
        .then(newState => {
          resolve(newState);
        })
        .catch(err => { reject(err); });
      }, 1000);
    })

/*
    return {
      up_on_clicked: () => {

      },

      up_on_doubleclicked: () => {

      },

      down_on_clicked: () => {

      },

      down_on_doubleclicked: () => {

      },
    }
    */
  });
};

module.exports = StateModule;
