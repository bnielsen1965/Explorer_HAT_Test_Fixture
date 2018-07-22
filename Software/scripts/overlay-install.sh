#!/bin/bash

. ./functions.sh


BOOT_CONFIG="/boot/config.txt"
OVERLAY_SOURCE="../overlay/exhattf.dtbo"
OVERLAY_DEST="/boot/overlays/exhattf.dtbo"
BOOT_I2C_SETTINGS="i2c1=on,i2c1_baudrate=400000"
BOOT_SPI_SETTINGS="spi=on"

bootvariableset() {
	FIND="^\s*$1\s*=\s*$2\s*[#]*.*$"
	RESULT=$(grep "$FIND" "$BOOT_CONFIG")
	if [ -z "$RESULT" ]; then
		return 1
	fi
	return 0
}

installoverlay() {
	infomessage "Copy overlay to boot directory."
	sudo cp "$OVERLAY_SOURCE" "$OVERLAY_DEST"
	infomessage "Configure boot overlay."
	echo "" | sudo tee -a "$BOOT_CONFIG" > /dev/null
	echo "dtoverlay=exhattf" | sudo tee -a "$BOOT_CONFIG" > /dev/null
}

i2cbootsettings() {
	infomessage "Setting i2c boot settings."
	echo "" | sudo tee -a "$BOOT_CONFIG" > /dev/null
	echo "dtparam=$BOOT_I2C_SETTINGS" | sudo tee -a "$BOOT_CONFIG" > /dev/null
}

spibootsettings() {
	infomessage "Setting spi boot settings."
	echo "" | sudo tee -a "$BOOT_CONFIG" > /dev/null
	echo "dtparam=$BOOT_SPI_SETTINGS" | sudo tee -a "$BOOT_CONFIG" > /dev/null
}

if bootvariableset "dtoverlay" "exhattf"; then
	infomessage "Overlay already installed."
else
	infomessage "Install overlay"
	installoverlay
fi

if bootvariableset "dtparam" "$BOOT_I2C_SETTINGS"; then
	infomessage "I2C boot settings already set."
else
	i2cbootsettings
fi

if bootvariableset "dtparam" "$BOOT_SPI_SETTINGS"; then
	infomessage "SPI boot settings already set."
else
	spibootsettings
fi
