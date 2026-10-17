#!/usr/bin/env bash
# Renderiza e masteriza os capítulos em sequência (pula os que já existem em out/).
# Uso: bash scripts/render-chapters.sh [Ch1 Ch2 ...]   (sem argumentos = todos)
# Cada linha "DONE <id> <arquivo>" ou "FAIL <id>" serve de evento para monitorar o progresso.
cd "$(dirname "$0")/.."
declare -A NAME=(
  [Ch1]="01_The_Concept" [Ch2]="02_Track_Record" [Ch3]="03_Firepower" [Ch4]="04_Crew_and_Sensors"
  [Ch5]="05_Protection" [Ch6]="06_Mobility_and_Support" [Ch7]="07_The_Verdict" [Final]="08_Final"
)
IDS=("$@")
[ ${#IDS[@]} -eq 0 ] && IDS=(Ch1 Ch2 Ch3 Ch4 Ch5 Ch6 Ch7 Final)
mkdir -p out
for id in "${IDS[@]}"; do
  final="out/${NAME[$id]}.mp4"
  [ -f "$final" ] && { echo "SKIP $id $final"; continue; }
  start=$(date +%s)
  if npx remotion render "$id" "out/${id}_raw.mp4" --codec=h264 --crf=16 --jpeg-quality=92 \
      --audio-bitrate=320k --concurrency=4 --log=error \
    && node scripts/master.mjs "out/${id}_raw.mp4" "$final"; then
    echo "DONE $id $final $(( $(date +%s) - start ))s"
  else
    echo "FAIL $id"
  fi
done
echo "ALL FINISHED"
