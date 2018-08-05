

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
    GPIOS.setGPIOState('ready')
    .then(() => {
      setTimeout(function () {
        try {
          display = Display.openDisplay(DisplayConfig);
          menu = loadMenu();
          showMenu(menu);
        }
        catch(e) {
          console.log('E', e.toString());
        }
        resolve({

          up_on_clicked: () => {
            menu.menuUp();
          },

          up_on_doubleclicked: () => {
            menu.menuBack();
          },

          down_on_clicked: () => {
            menu.menuDown();
          },

          down_on_doubleclicked: () => {
            menu.activateSelect();
          },

        });
      }, 1000);
    })
    .catch(err => { reject(err); });
  });

  function loadMenu() {
    let menu = MenuBe('./config/menu-ready.json', MenuConfig);
    menu
    .on('menu_changed', () => {
      showMenu(menu);
    })
    .on('test_all', () => {
      destroy();
      loadState('test_display')
      .catch(err => {
        console.log(err.toString());
      });
    });
    return menu;
  }

  function showMenu(menu) {
    display.clear();
    var text = '';
    var p = menu.getParentSelect();
    text += p ? '[' + p.label + ']\n' : '';
    var c = menu.getCurrentSelect();
    menu.getActiveMenu().forEach(function (m) {
      text += (m.selected ? '>' : ' ') + m.label + '\n';
    });
    display.write(text);
  }

  function destroy() {
    display.destroy();
  }
};




module.exports = State;
