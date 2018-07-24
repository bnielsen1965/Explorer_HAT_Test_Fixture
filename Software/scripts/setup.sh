#!/bin/bash

REPO_NAME="Explorer_HAT_Test_Fixture"
REPO_URL="https://github.com/bnielsen1965/$REPO_NAME.git"
REPO_SCRIPTS_PATH="/Software/scripts"


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
	infomessage "clone"
	REPO_TMP_DIR=$(mktemp -d)
	if [ $? -ne 0 ]; then
		errormessage "Failed to create tmp directory for clone."
		return 1
	fi

	cd "$REPO_TMP_DIR"
	git clone "$REPO_URL"
	if [ $? -ne 0 ]; then
		errormessage "Error while cloning repo. $REPO_URL"
		return 1
	fi

	REPO_DIR="$REPO_TMP_DIR/$REPO_NAME"

	return 0
}


runSetupScripts() {
	declare -a scripts=("overlay-install.sh" "nodejs-install.sh" "pi-buttons-install.sh")
	for script in "${scripts[@]}"; do
	  cd "$REPO_DIR$REPO_SCRIPTS_PATH"
		. "./$script"
	done
}


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
