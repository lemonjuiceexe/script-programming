#!/bin/bash

report="raport_systemowy.csv"

timestamp=$(date "+%a %Y-%m-%d %H:%M:%S")

read -r cpu_load _ < /proc/loadavg

while read -r label total used free _; do
  if [ "$label" = "Mem:" ]; then
    mem_used="$used"
    mem_free="$free"
    break
  fi
done < <(free -m)

users=""
while read -r u _; do
  if [ -n "$u" ] && [[ ! " $users " =~ " $u " ]]; then
    if [ -z "$users" ]; then
      users="$u"
    else
      users="$users $u"
    fi
  fi
done < <(who)

top_proc=""
count=0
while read -r cpu comm; do
  if [ "$count" -ge 1 ] && [ "$count" -le 5 ]; then
    if [ -z "$top_proc" ]; then
      top_proc="$comm ($cpu%)"
    else
      top_proc="$top_proc; $comm ($cpu%)"
    fi
  fi
  ((count++))
  [ "$count" -gt 5 ] && break
done < <(ps -eo %cpu,comm --sort=-%cpu)

echo "TIMESTAMP,CPU_LOAD,MEM_USED,MEM_FREE,USERS,TOP_PROC" > "$report"
echo "\"$timestamp\",$cpu_load,$mem_used,$mem_free,\"$users\",\"$top_proc\"" >> "$report"
