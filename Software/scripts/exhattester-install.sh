#!/bin/bash

. ./functions.sh


# paths assume present working directory is scripts
EXHATTESTER_DIR=$(readlink -f "../exhattester")

installexhattester() {
	infomessage "Install exhattester..."
	cd "$EXHATTESTER_DIR"

  npm install

	infomessage "exhattester install complete"
}

installexhattester
