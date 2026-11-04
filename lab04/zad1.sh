#!/bin/bash

mkdir ~/Zad1
filenames=("plik1" "etc.txt" "abc.txt")
# arr[@] returns all array elements, separated
# "" so bash doesn't split the elements by space; here no difference
for filename in "${filenames[@]}"; do
  touch ~/Zad1/"${filename}"
done

echo "Adam Mickiewicz wielkim poetą był" > ~/Zad1/abc.txt
chmod 640 ~/Zad1/plik1
ls -a /etc > ~/Zad1/etc.txt
cp ~/Zad1/abc.txt ~/zad1.txt
rm ~/Zad1/plik1

