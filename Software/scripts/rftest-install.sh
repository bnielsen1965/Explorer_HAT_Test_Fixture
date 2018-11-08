#!/bin/bash

. ./functions.sh

RFTEST_DIR="../cc1110/rftest"

installrftest() {
	infomessage "Install rftest..."
	CURRENT_PATH=$(pwd)
	cd "$RFTEST_DIR"

  sudo npm install

  # install system wide script?

	cd "$CURRENT_PATH"
	infomessage "rftest install complete"
}

installrftest

# use this if rftest script is installed system wide
#if commandInstalled rftest; then
#	infomessage "rftest is already installed."
#else
#	infomessage "Install rftest."
#	installrftest
#fi
