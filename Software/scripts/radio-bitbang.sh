#!/bin/bash

HEX_SOURCE="../cc1110/spi1_alt2_EDISON_EXPLORER_US_STDLOC.hex"

if [ "$#" -lt 1 ]; then
  echo "Command required (reset, erase, write)"
  exit 1
fi

CMD="$1"

#if ! [[ "$CMD" =~ ^(reset|erase|write)$ ]]; then
#  echo "Unknown command $CMD"
#  exit 1
#fi


unknowncommand() {
  echo "Unknown command $CMD"
  exit 1
}

reset() {
  sudo ccprog -p 16,18,7 reset
  exit $?
}

erase() {
  sudo ccprog -p 16,18,7 erase
  exit $?
}

write() {
  sudo ccprog -p 16,18,7 write "$HEX_SOURCE"
  exit $?
}


case "$CMD" in
  reset)
  reset
  ;;
  erase)
  erase
  ;;
  write)
  write
  ;;
  *)
  unknowncommand
  ;;
esac
