#!/bin/bash

NODEJS_DLPATH="https://nodejs.org/dist/latest-v8.x/"
NODEJS_TAR_EXT=".tar.xz"
ARCH=$(uname -m)
NODEJS_DLPATTERN="node-[^>]*-linux-$ARCH$NODEJS_TAR_EXT"
NODEJS_INSTALL_PATH="/opt/nodejs"


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


# get nodejs tarball and install
installnodejs() {
	infomessage "Download nodejs"
	NODEJS_FILE=$(wget -O - "$NODEJS_DLPATH" | grep -o $NODEJS_DLPATTERN | head -1)
	if [ $? -ne 0 ]; then
		errormessage "Failed to find nodejs download file."
		exit 1
	fi
	NODEJS_TMP_DIR=$(mktemp -d)
	NODEJS_TMP_FILE="$NODEJS_TMP_DIR/$NODEJS_FILE"
	wget -O $NODEJS_TMP_FILE "$NODEJS_DLPATH$NODEJS_FILE"
	if [ $? -ne 0 ]; then
                errormessage "Failed to download nodejs file."
                exit 1
        fi

	infomessage "Extract nodejs."
	cd "$NODEJS_TMP_DIR"
	sudo mkdir -p "$NODEJS_INSTALL_PATH"
	sudo tar xf "$NODEJS_FILE" -C "$NODEJS_INSTALL_PATH/"
	if [ $? -ne 0 ]; then
                errormessage "Failed to extract tarball."
                exit 1
        fi

	infomessage "Create symlinks."
	NODEJS_DIR="$NODEJS_INSTALL_PATH/${NODEJS_FILE%$NODEJS_TAR_EXT}"
	sudo ln -s "$NODEJS_DIR/bin/node" /usr/bin/node
	sudo ln -s "$NODEJS_DIR/bin/npm" /usr/bin/npm

	infomessage "Clean up."
	rm -rf "$NODEJS_TMP_DIR"
}


if installed node && installed npm; then
	infomessage "node and npm commands already installed."
else
	infomessage "Install node and npm."
	installnodejs
fi

