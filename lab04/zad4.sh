#!/bin/bash

# -ne not equal
# $# is the number of arguments
if [ "$#" -ne 2 ]; then
  echo "Uzycie: $0 <katalog> <raport_file>" >&2
  exit 1
fi

DIR="$1"
REPORT="$2"

if [ ! -d "$DIR" ]; then
  echo "Blad: Katalog '$DIR' nie istnieje." >&2
  exit 1
fi

echo "nazwa_pliku,rozmiar_kB,mial_x" > "$REPORT"

total_files=0
removed_x=0

while IFS= read -r file; do
# [-z ""] checks whether string's length is zero
  [ -z "$file" ] && continue

  ((total_files++))

# cut to only print get the first column
  size_kb=$(du -k "$file" | cut -f1)

  if [ -x "$file" ]; then
    had_x="TAK"
    chmod -x "$file"
    ((removed_x++))
  else
    had_x="NIE"
  fi

  echo "$file,$size_kb,$had_x" >> "$REPORT"
# < is redirect, <() is subshell
done < <(find "$DIR" -type f ! -name "*.sh")

echo "Liczba zbadanych plikow: $total_files"
echo "Liczba plikow, z ktorych usunieto atrybut x: $removed_x"
echo "Raport zapisano w: $REPORT"
