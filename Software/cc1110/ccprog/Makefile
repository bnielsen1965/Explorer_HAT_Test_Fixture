DESTDIR=
BINDIR= $(DESTDIR)/usr/bin


ccprog: ccprog.c readhex.c
	gcc -o ccprog ccprog.c readhex.c -lmraa

.PHONY: install
install: ccprog
	mkdir -p $(BINDIR)
	cp ccprog $(BINDIR)/

.PHONY: uninstall
uninstall:
	rm -f $(BINDIR)/ccprog

