#!/bin/bash

FILE="panTadeusz.txt"

echo "a)"
echo -n "Liczba wierszy: "
wc -l < "$FILE"
echo -n "Liczba slow: "
wc -w < "$FILE"
echo

echo "b) Wystapienia slowa Litwa"
# -P makes the regex handle polish diacritics
# -o only-matching, returns just matching fragments instead of whole lines
# \b - word boundary - only match whole words (so this won't match Litwinka or sth)
# wc -l - count lines, -o forced every occurence into a separate line
grep -o -P '\bLitw(a|y|ie|ę|e|ą|o)\b' "$FILE" | wc -l
echo

echo "c) 20 najczestszych slow od wielkiej litery"
# uniq -c replaces a sorted list with (number of occurences) word
# sort -nr  -n numeric sort -r reverse
grep -o -P '\b[A-ZĄĆĘŁŃÓŚŹŻ][a-zA-Ząćęłńóśźż]*\b' "$FILE" | sort | uniq -c | sort -nr | head -n 20
echo


echo "d) Wiersze ze slowem Ojczyzna (duze litery)"
# -i ignore-case  -n  prints line numbers
# $0 is the current textline in awk
grep -n -i "ojczyzn" "$FILE" | awk '{print toupper($0)}'
