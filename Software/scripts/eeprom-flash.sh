#!/bin/bash

EEP_SOURCE="../eeprom/ERD_Explorer_HAT.eep"

sudo eepflash -c -t=24c32 -w -f=$EEP_SOURCE

exit $?
