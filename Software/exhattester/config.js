const Config = {
  // GPIO configuration { gpio: 'gpio pin #', on: 'value that defines on state' }
  // gpio configurations
  GPIOs: {
    // outputs
    GPIO_HAT:  { gpio: 18, on: 0 }, // enable HAT power
    GPIO_PWR:  { gpio: 25, on: 0 }, // enable USB power
    GPIO_BATT: { gpio: 16, on: 0 }, // enable battery power
    GPIO_PGM:  { gpio: 12, on: 1 }, // enable EEPROM programming
    GPIO_35V:  { gpio: 13, on: 0 }, // enable 3.5V
    GPIO_32V:  { gpio: 26, on: 0 }, // enable 3.2V

    // inputs
    GPIO_HAT_PRESENT: { gpio: 20, on: 0, edge: 'both' },
    
  },

};

module.exports = Config;
