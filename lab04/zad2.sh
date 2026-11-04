#!/bin/bash

# internal field separator - there's no separator just read the line as is
# -r treats \ literally and not as an escape char
lineCount=0
wordCount=0
litwaCount=0
declare -A validDeclinations=(
  ["Litwa"]=1
  ["Litwy"]=1
  ["Litwie"]=1
  ["Litwę"]=1
  ["Litwą"]=1
  ["Litwo"]=1
)
while IFS= read -r line; do
  # (( )) allows arithmetic operations and automatically expands vars without $
  ((lineCount++))
  for word in $line; do
    ((wordCount++))
    # [[ ]] allows logic condition checking
    # -v checks existence of a key
    if [[ -v validDeclinations["$word"]; then
      ((litwaCount++)
    fi
  done
done
