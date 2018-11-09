#!/bin/bash

sudo apt-get --assume-yes install cmake git build-essential swig python-dev python-setuptools nodejs-dev cmake libjson-c-dev
cd /tmp
git clone https://github.com/intel-iot-devkit/mraa
cd mraa
mkdir build
cd build

# cmake ..
echo "WARNING: Building mraa without swig node due to swig 3.0 not supporting node 8+"

cmake -DBUILDSWIGNODE=OFF ..
make
sudo make install
sudo ldconfig
