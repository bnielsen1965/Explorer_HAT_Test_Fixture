#!/bin/bash

REPO_NAME="Explorer_HAT_Test_Fixture"
REPO_URL="https://github.com/bnielsen1965/$REPO_NAME.git"
REPO_SCRIPTS_PATH="/Software/scripts"
INSTALL_TMP_DIR=$(mktemp -d)
INSTALL_DIR="/opt"

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



# install git if not already installed
installGit() {
	sudo apt-get update
	sudo apt-get install git -y
}


cloneRepo() {
	infomessage "Clone repo"

	cd "$INSTALL_TMP_DIR"
	sudo git clone "$REPO_URL"
	if [ $? -ne 0 ]; then
		errormessage "Error while cloning repo. $REPO_URL"
		return 1
	fi

	return 0
}


runSetupScripts() {
	declare -a scripts=("overlay-install.sh" "nodejs-install.sh" "pi-buttons-install.sh" "eeprom-utils-install.sh" "ccprog-install.sh" "rftest-install.sh" "exhattester-install.sh")
	for script in "${scripts[@]}"; do
	  cd "$INSTALL_TMP_DIR/$REPO_NAME$REPO_SCRIPTS_PATH"
		. "./$script"
	done

	infomessage "Copy $REPO_NAME to $INSTALL_DIR"
	cd "$INSTALL_TMP_DIR"
	sudo rsync -av "$REPO_NAME" "$INSTALL_DIR/"
}


# check if requested to only run setup scrxipts
if [[ "$1" == "runscripts" ]]; then
	infomessage "Running setup scripts only..."
	runSetupScripts
	exit 0
fi


# make sure we have git
if commandInstalled git; then
	infomessage "git already installed."
else
	infomessage "Install git."
	installGit
fi

# clone the project repo
if cloneRepo; then
	runSetupScripts
	infomessage "Setup complete. Reboot now to apply all changes."
	exit 0
else
	errormessage "Setup failed!"
	exit 1
fi
