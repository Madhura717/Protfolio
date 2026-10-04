#!/bin/sh
set -eu

rm -rf dist
mkdir -p dist
cp index.html app.js styles.css dist/
cp public/manus-routes.json dist/manus-routes.json
