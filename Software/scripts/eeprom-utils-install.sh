#!/bin/bash

. ./functions.sh


PIBUTTONS_REPO="https://github.com/bnielsen1965/pi-buttons"
PIBUTTONS_VERSION="v1.0.1"



# clone pi-buttons, build and install
installpibuttons() {
	infomessage "Clone pi-buttons"
	CURRENT_PATH=$(pwd)
	PIBUTTONS_TMP_DIR=$(mktemp -d)
	cd "$PIBUTTONS_TMP_DIR"
	git clone "$PIBUTTONS_REPO"
	if [ $? -ne 0 ]; then
		errormessage "Failed to clone from $PIBUTTONS_REPO."
		exit 1
	fi

	infomessage "Checkout version $PIBUTTONS_VERSION"
	cd pi-buttons/src
	git checkout "tags/$PIBUTTONS_VERSION"
	if [ $? -ne 0 ]; then
		errormessage "Failed to checkout branch $PIBUTTONS_VERSION."
		exit 1
	fi
	infomessage "Make and install pi-buttons."
	make
	sudo make install
	sudo make install_service

	infomessage "Configure pi-buttons."
	cd "$CURRENT_PATH"
	sudo cp pi-buttons.conf /etc/
	sudo systemctl enable pi-buttons
	sudo systemctl restart pi-buttons

	infomessage "Clean up."
	rm -rf "$PIBUTTONS_TMP_DIR"
}

echo "Need to configure i2c-0..."
echo "Need to build and install eeprom utils..."
exit 0;

if commandInstalled pi-buttons; then
	infomessage "pi-buttons already installed."
else
	infomessage "Install pi-buttons."
	installpibuttons
fi
