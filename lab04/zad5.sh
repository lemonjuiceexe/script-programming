#!/bin/bash

INPUT="${panTadeusz.txt}"
OUTDIR="ksiegi"

# Sprawdzenie, czy plik zrodlowy istnieje
if [ ! -f "$INPUT" ]; then
  echo "Blad: Plik '$INPUT' nie istnieje." >&2
  exit 1
fi

# Tworzymy katalog wyjsciowy (jesli jeszcze nie istnieje)
mkdir -p "$OUTDIR"

# Czyscimy ewentualne wczesniej wygenerowane pliki
rm -f "$OUTDIR"/ksiega_*.txt

book_nr=0
out_file=""

while IFS= read -r line; do
  if [[ "$line" =~ ^Księga\ (pierwsza|druga|trzecia|czwarta|piąta|szósta|siódma|ósma|dziewiąta|dziesiąta|jedenasta|dwunasta) ]]; then
    ((book_nr++))
    printf -v out_file "%s/ksiega_%02d.txt" "$OUTDIR" "$book_nr"
  fi

  # Jezeli out_file jest juz ustawiony (czyli napotkano juz co najmniej Ksiege pierwsza),
  # dopisujemy wiersz do aktualnego pliku ksiegi.
  # Wiersze sprzed Ksiegi pierwszej (tytul, autor) zostana pominiete, poniewaz out_file jest wtedy puste.
  if [ -n "$out_file" ]; then
    echo "$line" >> "$out_file"
  fi
done < "$INPUT"

# Wyswietlamy podsumowanie wygenerowanych ksiag
echo "Podzielono '$INPUT' na $book_nr ksiag w katalogu '$OUTDIR':"
for f in "$OUTDIR"/ksiega_*.txt; do
  lines=$(wc -l < "$f" | tr -d ' ')
  first_line=$(head -n 1 "$f")
  echo "  $(basename "$f"): $first_line ($lines wierszy)"
done
