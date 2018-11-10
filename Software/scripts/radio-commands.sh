#!/bin/bash

cd ../cc1110/rftest
shift 1
sudo node index.js "$@"
exit $?
