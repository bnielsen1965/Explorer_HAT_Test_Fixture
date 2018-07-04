#!/bin/bash

BOOT_CONFIG="/boot/config.txt"
OVERLAY_SOURCE="../overlay/exhattf.dtbo"
OVERLAY_DEST="/boot/overlays/exhattf.dtbo"


# display a green message
infomessage() {
	echo -e "\e[92m$1\e[0m"
}


# display a red message
errormessage() {
	echo -e "\e[91m$1\e[0m"
}


# check if a command is installed
installed() {
# check if command exists and is executable
	if [ -x "$(command -v $1)" ]; then
		return 0
	fi
	return 1
}

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

if bootvariableset "dtoverlay" "exhattf"; then
	infomessage "Overlay already installed."
else
	infomessage "Install overlay"
	installoverlay
fi

