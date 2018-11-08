#!/bin/bash

. ./functions.sh

EEPROM_UTILS_DIR="../eeprom/eepromutils"

installeepromutils() {
	infomessage "Install eeprom utils..."
	CURRENT_PATH=$(pwd)
	cd "$EEPROM_UTILS_DIR"

	infomessage "Make and install eepromutils."
	make
	sudo make install

	cd "$CURRENT_PATH"
	infomessage "eepromutils install complete"
}


if commandInstalled eepflash; then
	infomessage "eepromutils is already installed."
else
	infomessage "Install eeprom utils."
	installeepromutils
fi
