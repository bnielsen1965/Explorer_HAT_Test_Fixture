
'use strict';

const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');


module.exports = function(settings) {
  const REGISTER_CONVERSION = 0x00;
  const REGISTER_CONFIG = 0x01;
  const REGISTER_THRESHOLD_LO = 0x10;
  const REGISTER_THRESHOLD_HI = 0x11;

  var addr = Number(settings.addr);
  var config = Number(settings.config);

  // TODO not sure why doing this, it was part of openaps menu
  setVoltReadState('on')
  .catch(err => { console.log(err.toString()); });

  // example, read single ended
  function convert() {
    return new Promise(function (resolve, reject) {
      try {
        setVoltReadState('on')
        .then(() => {
          setTimeout(() => {
            settings.i2cBus.writeWordSync(addr, REGISTER_CONFIG, swapEndian(config | 0x8000));
            sample(0);
          }, 1000);
        })
        .catch(err => { reject(err); });
      }
      catch (e) {
        console.log('CATCH', e.toString())
        reject(new Error(e.toString()));
        return;
      }

      let sample = i => {
        readValue()
        .then(function (v) {
          if (i > 3) {
            setVoltReadState('off');
            resolve(v);
          }
          else {
            console.log('sample', v)
            setTimeout(() => { sample(i + 1); }, 100);
          }
        })
        .catch(function (e) { reject(e); });
      }
      /*
      // need a smart calculation for delay
      setTimeout(function () {
        readValue()
        .then(function (v) {
          setVoltReadState('off');
          resolve(v);
        }).
        catch(function (e) { reject(e); });
      }, 1500);
      */
    });
  }

  /*
  this doesn't seem to work, or endian is wrong
  // wait for ready
  var waitReady = function () {
    var r = swapEndian(i2c1.readWordSync(addr, 0x01));
  //  console.log(r.toString(16))
    if (r & 0x8000) {
      readValue();
    }
    else {
      console.log('wait')
      setTimeout(waitReady, 10);
    }
  }
  */

  function readValue() {
    return new Promise(function (resolve, reject) {
      var v;
      try {
        var r = swapEndian(settings.i2cBus.readWordSync(addr, REGISTER_CONVERSION));
        v = 5 * (0x8000 & r ? (0x7fff & r) - 0x8000 : r) / 0x8000;
        v = (Math.round(v * 100))/100;
      }
      catch (e) {
        reject(new Error(e.toString()));
        return;
      }
      resolve(v);
    });
  }


  function swapEndian(word) {
    return ((word & 0xFF) << 8) | ((word >> 8) & 0xFF);
  }


  function setVoltReadState(onoff) {
    return GPIOS.setGPIOValue(GPIO_PINS.outputs.GPIO_ADC.gpio, GPIOS.getOnOffValue('GPIO_ADC', onoff));
    /*
    .then(() => {
    })
    .catch(err => { throw err; });
    */
  }


  return convert;
};
