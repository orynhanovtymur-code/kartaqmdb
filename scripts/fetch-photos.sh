#!/bin/bash
# Бір реттік: mqd.kz суреттерін жүктеп, assets/mosques/*.webp (720px, q72) етіп сақтайды.
# Пайдалану: scripts/fetch-photos.sh urls.txt
set -u
cd "$(dirname "$0")/.."
one(){ u="$1"; n=$(printf %s "$u" | md5 | cut -c1-12); o="assets/mosques/$n.webp"
  [ -s "$o" ] && return 0
  t=$(mktemp); 
  for i in 1 2 3; do curl -sf -m 40 "$u" -o "$t" && break; sleep 1; done
  if [ -s "$t" ] && cwebp -quiet -q 72 -resize 720 0 -m 4 "$t" -o "$o" 2>/dev/null; then :; else echo "FAIL $u" >> assets/mosques/_failed.txt; fi
  rm -f "$t"; }
export -f one
xargs -P 12 -I{} bash -c 'one "{}"' < "$1"
