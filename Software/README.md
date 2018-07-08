# Explorer HAT Test Fixture Software

This section of the project holds the instructions and application code to setup
and run the test fixture.

# Requirements

- Raspberry Pi (tested on Pi Zero W)
- SD Card (8GB or more, Class 10)
- Raspbian Image file
- Explorer HAT Test Fixture
- Explorer HAT

# Install

Installation procedure covers installation of the Raspbian operating system and software
dependencies.

## Raspbian Image

Download the Raspbian Lite zip file (tested with the latest stretch release)

https://www.raspberrypi.org/downloads/raspbian/

Unzip the image file and use image writing software to flash the image to the SD card.

After writing the image eject the SD card then reinsert the card and wait for the /boot partition to mount.

Add an empty file on the SD card /boot partition named ssh. The empty file named ssh tells the raspbian OS
to enable and start the ssh service when the device first boots.

Add a file named wpa_supplicant.conf to the /boot partition and enter the following information.

```shell
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP-netdev
network={
  ssid="<SSID FOR YOUR WIFI ROUTER>"
  psk="<PASS PHRASE FOR YOUR WIFI ROUTER>"
  key_mgmt=WPA-PSK
}
```

After creating the files in the /boot partition eject the SD card and insert in the raspberry pi.

Apply power to the raspberry pi to begin the boot process with  the new SD card.

Monitor the WiFi router for the IP address given to the raspberry pi.

User terminal software, I.E. putty, to establish an SSH connection to the raspberry pi. And login
with the default pi user with the default raspberry password.


## Configure Raspbian

After establishing an SSH connection the localisation settings need to be adjusted using the
raspi-config application...

> sudo raspi-config

### Locale

Select Localisation Options then select Change Locale. On the Locale menu deselect en_GB.UTF-8 UTF-8
and select the en_US.UTF-8 UTF-8 option.


### Timezone

Again select Localisation Options then select Change Timezone. Select the appropriate geographic area
time zone.


### Upgrades

After finishing the localisation settings update and upgrade the OS packages and reboot

> sudo apt-get update

> sudo apt-get dist-upgrade -y

> sudo reboot


## Install git

## Install Test Fixture Software
