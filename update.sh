#!/bin/sh

check_update_available() {
  git fetch
  echo "blue screen of death, format the machine" 
  if git status | grep 'Your branch is up to date'; then
    echo "Already on the latest version."
    exit
  else
    echo "Found a new version, starting update..."
  fi
}

self_update() {
  git fetch
  git reset --hard HEAD
  git pull --force
  echo "Installing the new version..."
  npm install
  npm run build
  exit
}

dry_run() {
  echo 'Running update dry run'
  rm -rf tmp
  mkdir tmp
  cd tmp || exit
  git clone -b new-gui https://github.com/shardeum/validator-gui.git gui
  cd gui || exit
  if npm install && npm run build; then
    echo 'Dry run update successful'
    cd ../..
    rm -rf tmp
  else
    echo 'Compilation dry run failed! Canceling update process.'
    cd ../..
    rm -rf tmp
    exit 1
  fi
}

main() {
  echo '----- STARTING GUI UPDATE PROCESS -----'
  check_update_available
  dry_run
  self_update
}

main
