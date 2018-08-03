
const GPIO_STATES = require('./gpio-states');
const Config = require('./config');

const GPIO_UP = 17;
const GPIO_DOWN = 27;

const StateSequence = ['idle', 'ready', 'test1', 'test2', 'test3'];

const Path = require('path');
const GPIOS = require('./lib/gpios');
//const Display = require('./lib/display');

let currentState = {};

const npb = require('node-pi-buttons');

// create with default config
let myNPB = npb();
myNPB
.on('pressed', function (gpio, data) {
  console.log('PRESSED', gpio, JSON.stringify(data, null, 2));
})
.on('released', function (gpio, data) {
  console.log('RELEASED', gpio, JSON.stringify(data, null, 2));
})
.on('clicked', function (gpio, data) {
  console.log('CLICKED', gpio, JSON.stringify(data, null, 2));
  switch (parseInt(gpio)) {
    case GPIO_UP:
    //previousState();
    if (currentState.up_on_clicked) { currentState.up_on_clicked(); }
    break;

    case GPIO_DOWN:
    //nextState();
    if (currentState.down_on_clicked) { currentState.down_on_clicked(); }
    break;
  }
})
.on('clicked_pressed', function (gpio, data) {
  console.log('CLICKED_PRESSED', gpio, JSON.stringify(data, null, 2));
  //loadState(Config.GPIOs, 'idle');
})
.on('double_clicked', function (gpio, data) {
  console.log('DOUBLE_CLICKED', gpio, JSON.stringify(data, null, 2));
  switch (parseInt(gpio)) {
    case GPIO_UP:
    //previousState();
    if (currentState.up_on_doubleclicked) { currentState.up_on_doubleclicked(); }
    break;

    case GPIO_DOWN:
    //nextState();
    if (currentState.down_on_doubleclicked) { currentState.down_on_doubleclicked(); }
    break;
  }
});


//watchHATPresent();
loadState('power_on')
.then(newState => {
  //currentState = newState;
})
.catch(err => {
  console.log(err.toString());
});

/*
GPIOS.exportGPIOs(Config.GPIOs)
.then(() => {
  return setGPIOState(Config.GPIOs, GPIO_STATES['power_on']);
})
.then(state => {
  currentState = state;
  return setGPIOState(Config.GPIOs, GPIO_STATES['idle']);
})
.then(state => {
  currentState = state;
  return GPIOS.getGPIOValue(Config.GPIOs.GPIO_HAT_PRESENT.gpio);
})
.then(hatPresent => {
  if (parseInt(hatPresent) === Config.GPIOs.GPIO_HAT_PRESENT.on) {
    loadState(Config.GPIOs, 'ready');
  }

  watchHATPresent();
  console.log('Done');
})
.catch(err => {
  console.log('ERROR', err.toString(), err.stack);
  process.exit(1);
});
*/

// make sure pi-buttons socket is closed before exit
process.on('SIGINT', function() {
  console.log('DESTROY SOCKET')
  myNPB.destroySocket();
  process.exit();
});

/*
function nextState() {
  let ni = StateSequence.indexOf(currentState) + 1;
  if (ni < StateSequence.length) {
    loadState(Config.GPIOs, StateSequence[ni]);
  }
}

function previousState() {
  let ni = StateSequence.indexOf(currentState) - 1;
  console.log(ni, StateSequence, currentState)
  if (ni >= 0) {
    loadState(Config.GPIOs, StateSequence[ni]);
  }
}
*/

function loadState(state) { //(gpios, state) {
  return new Promise((resolve, reject) => {
    console.log('LOAD STATE', state);
    // TODO should this be handled as a promise???
    require(Path.join(process.cwd(), 'states', state))(loadState)
    .then(newState => {
      currentState = newState;
      resolve(newState);
    })
    .catch(err => {
      console.log('Load state error.', state, err.toString());
    });
  });
  /*
  setGPIOState(gpios, GPIO_STATES[state])
  .then(() => {
    currentState = state;
    let mod = require('./states/' + state)(gpios)
  })
  .catch(err => {
    console.log('State load error.', err.toString(), err.stack);
  });
  */
}
/*
// TODO should move to gpios module
// TODO would be better if state was passed as a string and function extracts state settings
function setGPIOState(gpios, state) {
  console.log('STATE', state)
  return new Promise((resolve, reject) => {
    let gpioNames = Object.keys(gpios);
    let setGPIO = i => {
      if (i >= gpioNames.length) {
        resolve();
        return;
      }
      let gpioName = gpioNames[i];
      if (state[gpioName]) {
        let value = state[gpioName] === 'on' ? gpios[gpioName].on : gpios[gpioName].on^1&1;
        //console.log('SET', gpioName, state[gpioName], value);
        GPIOS.setGPIOValue(gpios[gpioName].gpio, value)
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
}
*/

function watchHATPresent() {
  GPIOS.watchGPIO(Config.GPIOs.GPIO_HAT_PRESENT.gpio, value => {
    console.log('HAT CHANGE', value);
    if (parseInt(value) === Config.GPIOs.GPIO_HAT_PRESENT.on) {
      loadState(Config.GPIOs, 'ready');
    }
    else {
      loadState(Config.GPIOs, 'idle');
      /*
      setGPIOState(Config.GPIOs, GPIO_STATES['idle'])
      .catch(err => {
        consoel.log('E', err.toString());
      });
      */
    }
  });
}
