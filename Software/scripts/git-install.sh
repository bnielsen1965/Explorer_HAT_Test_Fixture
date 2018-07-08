#!/bin/bash

. ./functions.sh



# install git if not already installed
installGit() {
	sudo apt-get update
	sudo apt-get install git -y
}


if commandInstalled git; then
	infomessage "git already installed."
else
	infomessage "Install git."
	installGit
fi
