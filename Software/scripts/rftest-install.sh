#!/bin/bash

. ./functions.sh


# paths assume present working directory is scripts
RFTEST_DIR="../cc1110/rftest"

installrftest() {
	infomessage "Install rftest..."
	cd "$RFTEST_DIR"

  npm install

	infomessage "rftest install complete"
}

installrftest
