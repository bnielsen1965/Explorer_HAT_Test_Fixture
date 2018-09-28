
const GPIO_PINS = require('./config/gpio-pins');

const Path = require('path');

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
  console.log('CLICKED', gpio, currentState.name)
  if (currentState.ready) {
    switch (parseInt(gpio)) {
      case GPIO_PINS.buttons.GPIO_UP:
      if (currentState.up_on_clicked) { currentState.up_on_clicked(); }
      break;

      case GPIO_PINS.buttons.GPIO_DOWN:
      if (currentState.down_on_clicked) { currentState.down_on_clicked(); }
      break;
    }
  }
})
.on('clicked_pressed', function (gpio, data) {
  switch (parseInt(gpio)) {
    case GPIO_PINS.buttons.GPIO_UP:
    loadState('idle', true)
    .catch(err => {
      console.log(err.toString());
    });
    break;

    case GPIO_PINS.buttons.GPIO_DOWN:
    loadState('hat_on', true)
    .catch(err => {
      console.log(err.toString());
    });
    break;
  }

})
.on('double_clicked', function (gpio, data) {
  switch (parseInt(gpio)) {
    case GPIO_PINS.buttons.GPIO_UP:
    if (currentState.up_on_doubleclicked) { currentState.up_on_doubleclicked(); }
    break;

    case GPIO_PINS.buttons.GPIO_DOWN:
    if (currentState.down_on_doubleclicked) { currentState.down_on_doubleclicked(); }
    break;
  }
});


loadState('power_on')
.then(newState => {
})
.catch(err => {
  console.log(err.toString());
});


// make sure pi-buttons socket is closed before exit
process.on('SIGINT', function() {
  console.log('DESTROY SOCKET')
  myNPB.destroySocket();
  process.exit();
});


function loadState(state, arg) {
  return new Promise((resolve, reject) => {
    console.log('LOAD STATE', state);
    destroy()
    .then(() => {
      currentState = null;
      return require(Path.join(process.cwd(), 'states', state))(loadState, arg);
    })
    .then(newState => {
      currentState = newState;
      console.log('NEW STATE', currentState.name)
      resolve(newState);
    })
    .catch(err => {
      console.log('Load state error.', state, err.toString(), err.stack);
    });
  });
}

function destroy() {
  return new Promise((resolve, reject) => {
    if (currentState && currentState.destroy) {
      currentState.destroy()
      .then(() => {
        resolve();
      })
      .catch(err => { reject(err); });
    }
    else {
      resolve();
    }
  });
}
