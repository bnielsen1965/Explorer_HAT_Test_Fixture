#!/bin/bash

PIBUTTONS_REPO="https://github.com/bnielsen1965/pi-buttons"
PIBUTTONS_VERSION="v1.0.1"


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


# clone pi-buttons, build and install
installpibuttons() {
	infomessage "Clone pi-buttons"
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
	make
	sudo make install
	sudo make install_service

# TODO configure pi-buttons for application then restart service

	infomessage "Clean up."
	rm -rf "$PIBUTTONS_TMP_DIR"
}


if installed pi-buttons; then
	infomessage "pi-buttons already installed."
else
	infomessage "Install pi-buttons."
	installpibuttons
fi

