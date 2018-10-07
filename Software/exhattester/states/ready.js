

const GPIO_PINS = require('../config/gpio-pins');
const GPIO_STATES = require('../config/gpio-states');
const GPIOS = require('../lib/gpios');

const SpawnSync = require('child_process').spawnSync;
const Path = require('path');
const DisplayConfig = require('../config/display.json');
const Display = require('../lib/display');
const MenuBe = require('menube');
const MenuConfig = require('../config/menu.json');

const GPIO_READY_PAUSE_MS = 1000;

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

        // resolve with the ready state
        resolve({
          name: 'ready',
          ready: true,
          destroy: destroy,

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
      }, GPIO_READY_PAUSE_MS);
    })
    .catch(err => { reject(err); });
  });


  function loadMenu() {
    let menu = MenuBe('./config/menu-ready.json', MenuConfig);
    menu
    .on('menu_changed', () => {
      showMenu(menu);
    })
    .on('test_display', () => {
      loadState('test_display')
      .catch(err => {
        console.log(err.toString());
      });
    })
    .on('test_electrical', () => {
      loadState('test_batt')
      .catch(err => {
        console.log(err.toString());
      });
    })
    .on('show_wifi', () => {
      showWiFi();
    })
    .on('eeprom_verify', () => {

    })
    .on('eeprom_flash', () => {
      
    })
    .on('show_date', (error, stdout, stderr) => {
      display.clear();
      if (error) {
        display.write('ERROR: ' + error + '\n');
      }

      if (stdout) {
        display.write('DATE:\n' + stdout);
      }
    });

    return menu;
  }


  function showWiFi() {
    let child, stdout, match;
    child = SpawnSync('ip', ['addr', 'show', 'wlan0']);
    stdout = child.stdout.toString();
    match = /inet\s+([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/mg.exec(stdout);
    let ipAddress = match ? match[1] : '???';

    child = SpawnSync('iwconfig', ['wlan0']);
    stdout = child.stdout.toString();
    match = /ESSID:"([^"]*)"/mg.exec(stdout);
    let essid = match ? match[1] : '???';
    match = /Bit Rate=([0-9.]+\s[^\s]+)/mg.exec(stdout);
    let bitRate = match ? match[1] : '???';
    match = /Link Quality=([0-9]+)\/([0-9]+)\s/mg.exec(stdout);
    let linkQuality = match ? Math.floor(parseInt(match[1]) / parseInt(match[2]) * 100) : '???';

    display.clear();
    display.write('IP: ' + ipAddress + '\n');
    display.write('SSID: ' + essid + '\n');
    display.write('BR: ' + bitRate + '\n');
    display.write('LQ: ' + linkQuality + '%\n');
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
    return new Promise((resolve, reject) => {
      if (display) { display.destroy(); }
      resolve();
    });
  }
};




module.exports = State;
