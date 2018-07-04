# Creating overlay file to configure Raspberry Pi GPIO for Explorer Hat Test Fixture

The exhattf-overlay.dts file contains settings for a Raspbian overlay file that will configure the GPIO pins for use with as an Explorer HAT Test Fixture.

Compile the dts file into a dtbo file with the following command...

> dtc -W no-unit_address_vs_reg -@ -I dts -O dtb -o exhattf.dtbo exhattf-overlay.dts


Next copy the exhattf.dtbo file to /boot/overlays/ and then edit the /boot/config.txt file and add a line to load the overlay file, i.e.

dtoverlay=exhattf

