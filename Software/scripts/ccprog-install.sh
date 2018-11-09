#!/bin/bash

. ./functions.sh


# paths assume present working directory is scripts
CCPROG_DIR="../cc1110/ccprog"

installccprog() {
	infomessage "Install ccprog..."
	cd "$CCPROG_DIR"

	infomessage "Make and install libmraa."
	./install_mraa.sh

	infomessage "Make and install ccprog."
	make
	sudo make install

	infomessage "ccprog install complete"
}


if commandInstalled ccprog; then
	infomessage "ccprog is already installed."
else
	infomessage "Install ccprog."
	installccprog
fi
