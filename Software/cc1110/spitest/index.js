
const MAX_CLEARCOMMS_BYTES = 128;

const RPIO = require('rpio');

RPIO.init({gpiomem: false});    /* Use /dev/mem for i²c/PWM/SPI */
RPIO.init({mapping: 'gpio'});   /* Use the GPIOxx numbering */

if (process.argv.length < 3) {
  console.log('No command specified.');
  process.exit(1);
}

let command = process.argv[2];


switch (command) {
  case 'reboot':
  reboot()
  .then(() => { complete(); })
  .catch(err => { failed(err); })
  break;

  case 'version':
  readVersion()
  .then(version => {
    console.log(version);
    complete();
  })
  .catch(err => { failed(err); });
  break;

  case 'leds_on':
  setLEDs(0x01)
  .then(() => {
    complete();
  })
  .catch(err => { failed(err); });
  break;

  case 'leds_off':
  setLEDs(0x00)
  .then(() => {
    complete();
  })
  .catch(err => { failed(err); });
  break;

  default:
  failed(new Error('Unknown command.'));
}


// set LED output values
async function setLEDs(value) {
  spiInit();
  await clearComms();
  await sendCommand(0x08, [0x01, value]);
  await sendCommand(0x08, [0x00, value]);
}

// read firmware version
async function readVersion() {
  spiInit();
  await clearComms();
  await sendCommand(0x02);
  let rxBuff = await readComms();
  if (rxBuff) {
    return rxBuff.toString();
  }
  throw new Error('Read version failed.');
}

// process complete
function complete() {
  console.log('Complete.');
  process.exit(0);
}

// process failed
function failed(err) {
  console.log(err.message);
  process.exit(1);
}

// initialize spi interface
function spiInit() {
  RPIO.spiBegin();
  RPIO.spiChipSelect(0);
  RPIO.spiSetClockDivider(6400); // 400MHz / 6400 = 62,500
  RPIO.spiSetDataMode(0);
}

// reboot radio
async function reboot() {
  RPIO.open(4, RPIO.OUTPUT, RPIO.HIGH);
  await setReset(RPIO.HIGH, 500)
  await setReset(RPIO.LOW, 500);
  await setReset(RPIO.HIGH, 3000);
}

// set reset pin value with optional delay
function setReset(v, d) {
	return new Promise((resolve, reject) => {
		RPIO.write(4, v);
		setTimeout(() => { resolve(); }, d);
	});
}

// clear comms by reading in any buffered data
async function clearComms() {
  let rx = 0;
  let count = MAX_CLEARCOMMS_BYTES;
  await transferByte(0x99);
  do {
    rx = await transferByte(0x00);
    count -= 1;
  } while (rx && count);
}

// send command and data
async function sendCommand(cmd, data) {
  data = data || [];
  await transferByteArray([0x99, data.length + 1, cmd].concat(data));
}

// read comms buffer by resyncing and reading buffer
async function readComms() {
  await transferByte(0x99);
  let readLen = await transferByte(0x00);
  if (readLen) {
    let rxBuff = Buffer.alloc(readLen, 0, 'binary');
    for(let ri = 0; ri < readLen; ri++) {
      let rx = await transferByte(0x00);
      rxBuff[ri] = rx;
    }
    return rxBuff;
  }
  return null;
}

// transfer byte array over spi
async function transferByteArray(a) {
	for( let ai = 0; ai < a.length; ai++) {
		await transferByte(a[ai]);
	}
	return;
}

// transfer single byte over spi
function transferByte(b) {
	return new Promise((resolve, reject) => {
		let txBuff = new Buffer([reverseByte(b)]);
		let rxBuff = new Buffer(1);
		RPIO.spiTransfer(txBuff, rxBuff, 1);
    resolve(reverseByte(rxBuff[0]));
	});
}

// reverse the bits in a byte to conform to radio firmware protocol
function reverseByte(b) {
	let bits = b.toString(2);
	bits = "00000000".substring(0, 8 - bits.length) + bits;
	return parseInt(bits.split('').reverse().join(''), 2);
}
