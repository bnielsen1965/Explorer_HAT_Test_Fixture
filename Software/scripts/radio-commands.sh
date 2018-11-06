#!/bin/bash

cd ../cc1110/rftest
sudo node index.js "$1" "$2"
exit $?
