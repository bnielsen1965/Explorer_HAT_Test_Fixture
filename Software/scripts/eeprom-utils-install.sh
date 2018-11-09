#!/bin/bash

. ./functions.sh


# paths assume present working directory is scripts
EEPROM_UTILS_DIR="../eeprom/eepromutils"

installeepromutils() {
	infomessage "Install eeprom utils..."
	cd "$EEPROM_UTILS_DIR"

	infomessage "Make and install eepromutils."
	make
	sudo make install

	infomessage "eepromutils install complete"
}


if commandInstalled eepflash; then
	infomessage "eepromutils is already installed."
else
	infomessage "Install eeprom utils."
	installeepromutils
fi
