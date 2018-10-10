#!/bin/bash

EEP_SOURCE="../eeprom/ERD_Explorer_HAT.eep"
SUM_SOURCE=(`md5sum $EEP_SOURCE`)

sudo eepflash -c -t=24c32 -r -f=/tmp/verify.eep
SUM_VERIFY=(`md5sum /tmp/verify.eep`)

if [ "$SUM_SOURCE" = "$SUM_VERIFY" ]; then
  exit 0
else
  exit 1
fi
