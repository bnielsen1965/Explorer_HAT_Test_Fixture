#!/bin/bash

. ./functions.sh


# paths assume present working directory is scripts
EXHATTESTER_DIR=$(readlink -f "../exhattester")

installexhattester() {
	infomessage "Install exhattester..."
	cd "$EXHATTESTER_DIR"

  sudo npm install

	infomessage "Configure as service..."
	sudo rm /etc/systemd/system/exhattester.service
	sudo ln -s "$EXHATTESTER_DIR/exhattester.service" /etc/systemd/system/
	sudo systemctl daemon-reload
	sudo systemctl enable exhattester.service
	sudo systemctl start exhattester.service

	infomessage "exhattester install complete"
}

installexhattester
