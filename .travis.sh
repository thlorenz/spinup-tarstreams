#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -e
trap 'kill $(jobs -p)' SIGINT SIGTERM EXIT

export TRAVIS=1
export DOCKER_HOST="unix:///var/run/docker.sock"

sudo usermod --append --groups docker `whoami`
sudo docker -d &
sleep 2 
# sudo chmod +rw /var/run/docker.sock 

# pull this repo before starting tests to avoid tap timeout
docker pull dockerfile/nodejs

cd $DIR && npm test
