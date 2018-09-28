

const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');
const MenuBe = require('menube');
const MenuConfig = require('../config/menu.json');

const GPIO_HAT_ON_PAUSE_MS = 2000;

const State = (loadState) => {
  let display, menu;
  return new Promise((resolve, reject) => {
    GPIOS.setGPIOState('hat_on')
    .then(() => {
      // waith then transition to ready state
      setTimeout(function () {
        loadState('ready')
        .then(newState => {
          resolve(newState);
        })
        .catch(err => { reject(err); });
      }, GPIO_HAT_ON_PAUSE_MS);
    })
    .catch(err => { reject(err); });
  });
};




module.exports = State;
