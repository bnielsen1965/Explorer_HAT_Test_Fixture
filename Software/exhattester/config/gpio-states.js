
const GPIO_STATES = {
  power_on: {
    'GPIO_HAT': 'off',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'off',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'off'
  },

  idle: {
    'GPIO_HAT': 'off',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'off',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'off'
  },

  hat_on: {
    'GPIO_HAT': 'on',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'off',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'off'
  },

  ready: {
    'GPIO_HAT': 'on',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'off',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'off'
  },

  test_charge: {
    'GPIO_HAT': 'on',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'on',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'off'
  },


  test_batt: {
    'GPIO_HAT': 'on',
    'GPIO_PWR': 'off',
    'GPIO_BATT': 'on',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'off'
  },


  test_35v: {
    'GPIO_HAT': 'on',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'off',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'on',
    'GPIO_32V': 'on'
  },


  test_32v: {
    'GPIO_HAT': 'on',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'off',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'on'
  },


  test_adc: {
    'GPIO_HAT': 'on',
    'GPIO_PWR': 'on',
    'GPIO_BATT': 'off',
    'GPIO_PGM': 'off',
    'GPIO_35V': 'off',
    'GPIO_32V': 'off'
  },
};

module.exports = GPIO_STATES;
