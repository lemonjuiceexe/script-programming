#!/bin/bash

INPUT="panTadeusz.txt"
OUTDIR="ksiegi"

if [ ! -f "$INPUT" ]; then
  echo "Blad: Plik '$INPUT' nie istnieje." >&2
  exit 1
fi

mkdir -p "$OUTDIR"

rm -f "$OUTDIR"/ksiega_*.txt

book_nr=0
out_file=""

while IFS= read -r line; do
  if [[ "$line" =~ ^Księga\ (pierwsza|druga|trzecia|czwarta|piąta|szósta|siódma|ósma|dziewiąta|dziesiąta|jedenasta|dwunasta) ]]; then
    ((book_nr++))
    out_file="$OUTDIR/ksiega_$book_nr.txt"
  fi

  if [ -n "$out_file" ]; then
    echo "$line" >> "$out_file"
  fi
done < "$INPUT"
