#!/bin/bash

# -ne not equal
# $# is the amount of arguments
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

# b) Rekurencyjne wyszukanie plikow innych niz *.sh
while IFS= read -r file; do
  [ -z "$file" ] && continue

  ((total_files++))

  # Rozmiar pliku w kB (du -k)
  size_kb=$(du -k "$file" | cut -f1)

  # c) & d) Sprawdzenie atrybutu wykonywalnosci i jego usuniecie
  if [ -x "$file" ]; then
    mial_x="TAK"
    chmod -x "$file"
    ((removed_x++))
  else
    mial_x="NIE"
  fi

  # e) Zapis wpisu do raportu CSV
  echo "$file,$size_kb,$mial_x" >> "$REPORT"
done < <(find "$DIR" -type f ! -name "*.sh")

# f) Wyswietlenie podsumowania na ekranie
echo "=== Podsumowanie audytu ==="
echo "Liczba zbadanych plikow: $total_files"
echo "Liczba plikow, z ktorych usunieto atrybut x: $removed_x"
echo "Raport zapisano w: $REPORT"
