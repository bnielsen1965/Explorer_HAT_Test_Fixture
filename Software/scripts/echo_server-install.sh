#!/bin/bash

. ./functions.sh


# paths assume present working directory is scripts
ECHO_SERVER_DIR="../echo_server"

installechoserver() {
	infomessage "Install echo_server..."
	cd "$ECHO_SERVER_DIR"

  npm install

	infomessage "echo_server install complete"
}

installechoserver
