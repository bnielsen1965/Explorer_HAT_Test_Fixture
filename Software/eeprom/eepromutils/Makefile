# Current tools are eepmake and eepdump

DESTDIR =
BINDIR = $(DESTDIR)/usr/bin

CC ?= gcc

all: eepmake eepdump

eepmake: eeptypes.h eepmake.c
	$(CC) eepmake.c -o eepmake -Wno-format

eepdump: eeptypes.h eepdump.c
	$(CC) eepdump.c -o eepdump -Wno-format

clean:
	rm -f eepmake eepdump

.PHONY: install
install: eepmake eepdump
	mkdir -p $(BINDIR)
	cp eepmake $(BINDIR)/
	cp eepdump $(BINDIR)/
	cp eepflash.sh $(BINDIR)/
	ln -s $(BINDIR)/eepflash.sh $(BINDIR)/eepflash

.PHONY: uninstall
uninstall:
	rm -f $(BINDIR)/eepmake
	rm -f $(BINDIR)/eepdump
	rm -f $(BINDIR)/eepflash.sh
	rm -f $(BINDIR)/eepflash
