
const FS = require('fs');
const Path = require('path');
const Epoll = require('epoll').Epoll;

const GPIO_PATH = '/sys/class/gpio';

const GPIOs = {
  // export the GPIOs defined in the given array
  exportGPIOs: gpios => {
    return new Promise((resolve, reject) => {
      let gpioNames = Object.keys(gpios);
      let initGPIO = i => {
        if (i >= gpioNames.length) {
          resolve();
          return;
        }

        GPIOs.exportGPIO(gpios[gpioNames[i]].gpio)
        .then(() => {
          return (gpios[gpioNames[i]].edge ? GPIOs.edgeGPIO(gpios[gpioNames[i]].gpio, gpios[gpioNames[i]].edge) : null);
        })
        .then(() => {
          initGPIO(i + 1);
        })
        .catch(err => { reject(err); });
      }
      initGPIO(0);
    });
  },

  exportGPIO: gpioPin => {
    return new Promise((resolve, reject) => {
      FS.writeFile(Path.join(GPIO_PATH, 'export'), gpioPin, err => {
        if (!require('fs').existsSync(Path.join(GPIO_PATH, 'gpio' + gpioPin))) { console.log('gpio', gpioPin, 'doesn\'t exist'); }
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
      console.log('EDGE', gpio, value);
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


  setGPIOValue: (gpio, value) => {
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

module.exports = GPIOs;
