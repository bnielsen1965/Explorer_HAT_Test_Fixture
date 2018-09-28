

const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');
const MenuBe = require('menube');
const MenuConfig = require('../config/menu.json');


const State = (loadState) => {
  let display, menu;
  return new Promise((resolve, reject) => {
    GPIOS.setGPIOState('hat_on1')
    .then(() => {
      setTimeout(function () {
        loadState('hat_on2')
        .then(newState => {
          resolve(newState);
        })
        .catch(err => { reject(err); });
      }, 2000);
    })
    .catch(err => { reject(err); });
  });
};




module.exports = State;
