
const MAX_LINES = 6;
const MAX_COUNT = 99;
const DisplayConfig = require('./display.json');
const Display = require('./lib/display');

display = Display.openDisplay(DisplayConfig);

display.clear();
display.write('Echo server...' + '\n');

let lines = [];
let count = 0;

function appendLine(line) {
  if (count > MAX_COUNT) { count = 0; }
  lines.push(line + ' ' + count);
  if (lines.length > MAX_LINES) {
    lines.shift();
  }
  display.setCursor(0, 8);
  lines.forEach(line => {
    display.write(line + '                \n');
  });
  count += 1;
}


let spawn = require('child_process').spawn;
let command = spawn('../scripts/radio-commands.sh', ['echo_server']);
command.stdout.on('data', function(data) {
  appendLine(data.toString().replace(/[\r\n]/g, ''));
});
command.on('close', function(code) {
  process.exit(0);
});
