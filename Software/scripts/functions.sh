#!/bin/bash


# display a green message
infomessage() {
	echo -e "\e[92m$1\e[0m"
}


# display a red message
errormessage() {
	echo -e "\e[91m$1\e[0m"
}


# check if a command is installed
commandInstalled() {
# check if command exists and is executable
	if [ -x "$(command -v $1)" ]; then
		return 0
	fi
	return 1
}
