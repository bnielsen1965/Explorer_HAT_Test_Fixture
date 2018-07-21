#!/bin/bash

. ./functions.sh


BOOT_CONFIG="/boot/config.txt"
OVERLAY_SOURCE="../overlay/exhattf.dtbo"
OVERLAY_DEST="/boot/overlays/exhattf.dtbo"


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
