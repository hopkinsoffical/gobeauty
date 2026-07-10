#!/usr/bin/env bash
# Build a skinsort URL list (gb_skinsort_scrape.py --urls-file format) for the
# empty gb_categories. Bare header lines carry OUR category names so ingest
# slugify() maps to existing taxonomy rows.
# Pagination is a Rails button_to: POST /products/<cat>/filtered_products?page=N
# with the session cookie + csrf-token from the page-1 GET.
set -uo pipefail
export LC_ALL=C  # sort/comm must agree on collation for the overlap dedupe
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
PAGES="${PAGES:-10}"
OUT="${1:?usage: build_category_urls.sh out.txt}"
: > "$OUT"

extract() { grep -oE 'href="/products/[a-z0-9-]+/[a-z0-9-]+"' \
  | sed 's|href="|https://skinsort.com|; s|"||' | sort -u; }

fetch_cat() { # $1=skinsort slug -> product URLs, one per line
  local slug="$1" jar tok p page urls
  jar=$(mktemp)
  page=$(curl -sk -A "$UA" -c "$jar" "https://skinsort.com/products/${slug}")
  tok=$(echo "$page" | grep -oE 'name="csrf-token" content="[^"]+"' | sed 's/.*content="//; s/"//')
  echo "$page" | extract
  for p in $(seq 2 "$PAGES"); do
    sleep 1
    urls=$(curl -sk -A "$UA" -b "$jar" -X POST \
      -H "Accept: text/vnd.turbo-stream.html, text/html" \
      --data-urlencode "authenticity_token=$tok" \
      "https://skinsort.com/products/${slug}/filtered_products?page=${p}" | extract)
    [ -z "$urls" ] && break
    echo "$urls"
  done | sort -u
  rm -f "$jar"
}

declare -A MAP=(
  [Cleansers]=cleansers
  ["Face Washes"]=face-cleansers
  [Essences]=essences
  [Exfoliators]=exfoliators
  ["Face Masks"]=masks
  ["Face Oils"]=oils
  ["Lip Care"]=lip-care
  [Sunscreens]=sunscreens
)
ORDER=(Cleansers "Face Washes" Essences Exfoliators "Face Masks" "Face Oils" "Lip Care" Sunscreens)

CLEANSERS=$(fetch_cat cleansers)
FACEWASH=$(fetch_cat face-cleansers)
# overlap belongs to the more specific Face Washes
CLEANSERS=$(comm -23 <(echo "$CLEANSERS") <(echo "$FACEWASH"))

for name in "${ORDER[@]}"; do
  case "$name" in
    Cleansers)      urls="$CLEANSERS" ;;
    "Face Washes")  urls="$FACEWASH" ;;
    *)              urls=$(fetch_cat "${MAP[$name]}") ;;
  esac
  n=$(echo "$urls" | grep -c . || true)
  echo "$name: $n urls" >&2
  { echo "$name"; echo "$urls"; echo; } >> "$OUT"
done
