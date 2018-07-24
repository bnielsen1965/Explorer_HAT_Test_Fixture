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

```
If the intial steps in this procedure are not clear
then refer to the detailed instructions for the
installation of the Raspbian OS on an SD card at the
Raspberry Pi Project website...

https://www.raspberrypi.org/documentation/installation/installing-images/README.md
```

#### 1) Download the Raspbian Lite zip file (tested with the latest stretch release)

https://www.raspberrypi.org/downloads/raspbian/

#### 2) Unzip the image file and use image writing software to flash the image to the SD card.

#### 3) Add boot files to the boot partition on the SD card.

##### a) Mount /boot partition

After writing the image eject the SD card from your laptop / workstation then
reinsert the card into your laptop / workstation and wait for the /boot partition to mount.

```
The SD card will have two partitions, Windows cannot read the second partition.
Press cancel if Windows asks to format the second partition.
```

##### b) Enable SSH service

Add an empty file on the SD card /boot partition named ssh. The empty file named
ssh tells the raspbian OS to enable and start the ssh service when the device
first boots. After the first boot the ssh file will be automatically removed from
the /boot partition.

##### c) Configure WiFi

Add a file named wpa_supplicant.conf to the /boot partition and enter the
following information in the file. (Use your WiFi router SSID and pass phrase.)

```shell
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP-netdev
network={
  ssid="<SSID FOR YOUR WIFI ROUTER>"
  psk="<PASS PHRASE FOR YOUR WIFI ROUTER>"
  key_mgmt=WPA-PSK
}
```

#### 4) Boot the Raspberry Pi with the SD card.

After creating the files in the /boot partition eject the SD card from your
laptop / workstation and insert into the Raspberry Pi.

Apply power to the Raspberry Pi to begin the boot process with the new SD card.

Monitor the WiFi router for the IP address given to the raspberry pi.

Use terminal software, I.E. putty, to establish an SSH connection to the Raspberry Pi.
And login with the default user "pi" and the default password "raspberry".

> NOTE: For initial configuration it is recommended to use mini adapters to connect
> a USB keyboard and HDMI monitor.


## Configure Raspbian Localisation

After establishing a terminal connection the Localisation settings need to be
adjusted using the raspi-config application...

> sudo raspi-config

### Locale

Select Localisation Options then select Change Locale. On the Locale menu
deselect en_GB.UTF-8 UTF-8 and select the en_US.UTF-8 UTF-8 option.


### Timezone

Again select Localisation Options then select Change Timezone. Select the
appropriate geographic area time zone.


### Keyboard Layout

If using a USB keyboard and HDMI monitor for configuration you can set the keyboard
layout. Select Localisation Options then select Change Keyboard Layout. Select the
appropriate settings for your keyboard and locale, I.E. Generic 105-key (Intl) PC,
English (US), The default AltGr for the keyboard layout, No compose key.


### Finish and Reboot

After configuring locale settings tab to the Finish option and press Enter. Then
enter the reboot command.

> sudo reboot


## OS Package Upgrades

After finishing the Localisation settings connect with a terminal again and run
the commands to update and upgrade the OS packages, then reboot.

> sudo apt-get update

> sudo apt-get dist-upgrade -y

> sudo reboot


## Run setup.sh

The setup.sh script will install and configure the software to support the
Explorer HAT Test Fixture. Use the terminal to download and execute the script file.

### Download and prepare setup.sh

> curl -LOk https://github.com/bnielsen1965/Explorer_HAT_Test_Fixture/raw/master/Software/scripts/setup.sh

> chmod a+x setup.sh


### Execute setup.sh

> ./setup.sh

### Reboot

After the setup process has successfully completed the Raspberry Pi needs a reboot
before all the new settings and services will function properly, I.E. the new boot
overlay that configures the GPIO pins is not applied until a reboot.

> sudo reboot
