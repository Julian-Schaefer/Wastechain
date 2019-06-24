#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#


set -e
set -x

# Update the entire system to the latest releases
apt-get update
#apt-get dist-upgrade -y

# Install some basic utilities
apt-get install -y build-essential git make curl unzip g++ libtool

# ----------------------------------------------------------------
# Install Docker
# ----------------------------------------------------------------

# Update system
apt-get update -qq

# Prep apt-get for docker install
apt-get install -y apt-transport-https ca-certificates
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# Add docker repository
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# Update system
apt-get update -qq

# Install docker
#apt-get install -y docker-ce=17.06.2~ce~0~ubuntu  # in case we need to set the version
apt-get install -y docker-ce

# Install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.14.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

usermod -a -G docker vagrant # Add vagrant user to the docker group

# Test docker
docker run --rm busybox echo All good

# ----------------------------------------------------------------
# Install Golang
# ----------------------------------------------------------------
GO_VER=1.11.5
GO_URL=https://storage.googleapis.com/golang/go${GO_VER}.linux-amd64.tar.gz

# Set Go environment variables needed by other scripts
export GOPATH="/opt/gopath"
export GOROOT="/opt/go"
PATH=$GOROOT/bin:$GOPATH/bin:$PATH

cat <<EOF >/etc/profile.d/goroot.sh
export GOROOT=$GOROOT
export GOPATH=$GOPATH
export PATH=\$PATH:$GOROOT/bin:$GOPATH/bin
EOF

mkdir -p $GOROOT

curl -sL $GO_URL | (cd $GOROOT && tar --strip-components 1 -xz)

# ----------------------------------------------------------------
# Install NodeJS
# ----------------------------------------------------------------
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create directory for the DB
sudo mkdir -p /var/hyperledger
sudo chown -R vagrant:vagrant /var/hyperledger

# Ensure permissions are set for GOPATH
sudo chown -R vagrant:vagrant $GOPATH

# finally, remove our warning so the user knows this was successful
rm /etc/motd