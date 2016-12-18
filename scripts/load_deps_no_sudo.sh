#!/usr/bin/env bash

DEPENDENCIES=( "electron-prebuilt:electron" "electron-packager:electron-packager" "node-inspector:node-inspector" )
for DEP in ${DEPENDENCIES[@]}; do
  PKG="${DEP%%:*}"
  CMD="${DEP##*:}"
  type $CMD >/dev/null 2>&1 && printf "%s is already installed...\n" $PKG || npm install -g $PKG
done;

npm i -g node-sass
npm rebuild node-sass

npm install
bower install

printf "\nDONE\n";
