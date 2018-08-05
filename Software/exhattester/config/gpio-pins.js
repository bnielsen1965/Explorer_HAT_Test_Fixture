const GPIO_PINS = {
  // GPIO configuration { gpio: gpio pin #, on: value that defines 'on' state, init: initial state 'on' or 'off' }
  outputs: {
    GPIO_HAT:  { gpio: 18, on: 0, init: 'off' }, // enable HAT power
    GPIO_PWR:  { gpio: 25, on: 0, init: 'off' }, // enable USB power
    GPIO_BATT: { gpio: 16, on: 0, init: 'off' }, // enable battery power
    GPIO_PGM:  { gpio: 12, on: 1, init: 'off' }, // enable EEPROM programming
    GPIO_35V:  { gpio: 13, on: 0, init: 'off' }, // enable 3.5V
    GPIO_32V:  { gpio: 26, on: 0, init: 'off' }, // enable 3.2V

    GPIO_ADC:  { gpio: 19, on: 1, init: 'on', edge: 'none' }, // Enable voltage ADC
  },

  inputs: {
    GPIO_HAT_PRESENT: { gpio: 20, on: 0, edge: 'both' },
  },

  buttons: {
    GPIO_UP: 17,
    GPIO_DOWN: 27
  }
};

module.exports = GPIO_PINS;
