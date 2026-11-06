#!/bin/bash

FILE="przykladowy_log.log"

echo "a) Sformatowane wpisy z logu"
# -r  raw, read special chars literally
while read -r month day time host user ip; do
  # % is strip shortest match from end
  host="${host%:}"
  echo "timestamp: $month $day $time, host: $host, user: $user, adres_ip: $ip;"
done < "$FILE"
echo

echo "b) Liczba wystapien uzytkownikow"
# cut delimiter=' ' fields=5 for all lines returns the fifth column from file (username)
cut -d' ' -f5 "$FILE" | sort | uniq -c | sort -nr
