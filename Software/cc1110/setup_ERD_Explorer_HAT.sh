#!/usr/bin/env bash

/home/pi/src/ccprog/ccprog -p 16,18,7 erase
/home/pi/src/ccprog/ccprog -p 16,18,7 write /home/pi/spi1_alt2_EDISON_EXPLORER_US_STDLOC.hex

/home/pi/eepflash.sh -w -f=/home/pi/ERD_Explorer_HAT.eep -t=24c32

python /home/pi/cc1110_set_leds.py
python /home/pi/shapes.py
