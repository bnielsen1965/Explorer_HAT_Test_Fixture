
const FS = require('fs');
const Path = require('path');
const Epoll = require('epoll').Epoll;

const GPIO_STATES = require('../config/gpio-states');
const GPIO_PINS = require('../config/gpio-pins');
const GPIO_PATH = '/sys/class/gpio';

const GPIOS = {
  // export the GPIOS defined in the given array
  exportGPIOs: gpios => {
    return new Promise((resolve, reject) => {
      GPIOS.exportGPIOArray(GPIO_PINS.outputs)
      .then(() => {
        return GPIOS.exportGPIOArray(GPIO_PINS.inputs);
      })
      .then(() => {
        resolve();
      })
      .catch(err => { reject(err); });
    });
  },

  exportGPIOArray: gpioArray => {
    return new Promise((resolve, reject) => {
      let gpioNames = Object.keys(gpioArray);
      let initGPIO = i => {
        if (i >= gpioNames.length) {
          resolve();
          return;
        }

        GPIOS.exportGPIO(gpioArray[gpioNames[i]].gpio)
        .then(() => {
          return (gpioArray[gpioNames[i]].edge ? GPIOS.edgeGPIO(gpioArray[gpioNames[i]].gpio, gpioArray[gpioNames[i]].edge) : null);
        })
        .then(() => {
          return gpioArray[gpioNames[i]].init ? GPIOS.setGPIOValue(gpioNames[i], GPIOS.getOnOffValue(gpioNames[i], gpioArray[gpioNames[i]].init)) : null;
        })
        .then(() => {
          initGPIO(i + 1);
        })
        .catch(err => { reject(err); });
      }
      initGPIO(0);
    });
  },


  isExported: gpioPin => {
    return FS.existsSync(Path.join(GPIO_PATH, 'gpio' + gpioPin));
  },


  exportGPIO: gpioPin => {
    return new Promise((resolve, reject) => {
      FS.writeFile(Path.join(GPIO_PATH, 'export'), gpioPin, err => {
        if (err) {
          // TODO handle errors
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  },

  edgeGPIO(gpio, value) {
    return new Promise((resolve, reject) => {
      FS.writeFile(Path.join(GPIO_PATH, 'gpio' + gpio, 'edge'), value, err => {
        if (err) {
          // TODO handle errors
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  },


  setGPIOState: (state) => {
    return new Promise((resolve, reject) => {
      let gpioNames = Object.keys(GPIO_PINS.outputs);
      let setGPIO = i => {
        if (i >= gpioNames.length) {
          resolve();
          return;
        }
        let gpioName = gpioNames[i];
        if (GPIO_STATES[state][gpioName]) {
          // set value to on or off based on the defined map of on = 0 | 1
          let value = GPIOS.getOnOffValue(gpioName, GPIO_STATES[state][gpioName]);// === 'on' ? GPIO_PINS.outputs[gpioName].on : GPIO_PINS.outputs[gpioName].on^1&1;
          console.log(gpioName, GPIO_STATES[state][gpioName]);
          GPIOS.setGPIOValue(GPIO_PINS.outputs[gpioName].gpio, value)
          .then(() => {
            setGPIO(i + 1);
          })
          .catch(err => { reject(err); });
        }
        else {
          setGPIO(i + 1);
        }
      }
      setGPIO(0);
    });
  },


  getOnOffValue: (gpioName, onoff) => {
    return onoff === 'on' ? GPIO_PINS.outputs[gpioName].on : GPIO_PINS.outputs[gpioName].on^1&1;
  },



  setGPIOValue: (gpio, value) => {
    console.log('GSET', gpio, value)
    return new Promise((resolve, reject) => {
      FS.writeFile(Path.join(GPIO_PATH, 'gpio' + gpio, 'value'), value, err => {
        if (err) {
          // TODO handle errors
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  },


  getGPIOValue: (gpio, value) => {
    return new Promise((resolve, reject) => {
      FS.readFile(Path.join(GPIO_PATH, 'gpio' + gpio, 'value'), (err, data) => {
        if (err) {
          reject(new Error(err.toString));
        }
        else {
          resolve(parseInt(data));
        }
      });
    });
  },


  unexportGPIO: gpio => {
    return new Promise((resolve, reject) => {
      FS.writeFile(Path.join(GPIO_PATH, 'unexport'), gpio, err => {
        if (err) {
          // TODO handle errors
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  },


  watchGPIO: (gpio, callback) => {
    let valuefd = FS.openSync(Path.join(GPIO_PATH, 'gpio' + gpio, 'value'), 'r');
    let buffer = Buffer.alloc(1);

    // Create a new Epoll. The callback is the interrupt handler.
    let poller = new Epoll((err, fd, events) => {
      // Read GPIO value file. Reading also clears the interrupt.
      FS.readSync(fd, buffer, 0, 1, 0);
      callback(buffer.toString());
    });

    // Read the GPIO value file before watching to
    // prevent an initial unauthentic interrupt.
    FS.readSync(valuefd, buffer, 0, 1, 0);

    // Start watching for interrupts.
    poller.add(valuefd, Epoll.EPOLLPRI);
  }



};

module.exports = GPIOS;
