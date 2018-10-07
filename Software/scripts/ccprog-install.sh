#!/bin/bash

. ./functions.sh

CCPROG_DIR="../cc1110/ccprog"

installccprog() {
	infomessage "Install ccprog..."
	CURRENT_PATH=$(pwd)
	cd "$CCPROG_DIR"

	infomessage "Make and install libmraa."
	./install_mraa.sh

	infomessage "Make and install ccprog."
	make
	sudo make install
}


if commandInstalled ccprog; then
	infomessage "ccprog is already installed."
else
	infomessage "Install ccprog."
	installccprog
fi
