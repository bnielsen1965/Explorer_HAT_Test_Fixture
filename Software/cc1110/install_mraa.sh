#!/bin/bash

sudo apt-get --assume-yes install cmake git build-essential swig3.0 python-dev nodejs-dev cmake libjson-c-dev
cd /tmp
git clone https://github.com/intel-iot-devkit/mraa
cd mraa
mkdir build
cd build
cmake ..
make
sudo make install

