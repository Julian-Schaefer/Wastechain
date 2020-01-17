#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#Start CLI
docker-compose up -d cli

export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=wastechain

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# generate crypto material
docker exec cli cryptogen generate --config="/etc/hyperledger/crypto-config.yaml" --output="/etc/hyperledger/crypto-config"
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

mkdir config

# generate genesis block for orderer
docker exec -e "FABRIC_CFG_PATH=/etc/hyperledger/" cli configtxgen -profile OrdererGenesis -outputBlock /etc/hyperledger/config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
docker exec -e "FABRIC_CFG_PATH=/etc/hyperledger/" cli configtxgen -profile WastechainChannel -outputCreateChannelTx /etc/hyperledger/config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
docker exec -e "FABRIC_CFG_PATH=/etc/hyperledger/" cli configtxgen -profile WastechainChannel -outputAnchorPeersUpdate /etc/hyperledger/config/OrderingOrgMSPanchors.tx -channelID $CHANNEL_NAME -asOrg OrderingOrgMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrderingOrg..."
  exit 1
fi

docker exec -e "FABRIC_CFG_PATH=/etc/hyperledger/" cli configtxgen -profile WastechainChannel -outputAnchorPeersUpdate /etc/hyperledger/config/SubcontractorOrgMSPanchors.tx -channelID $CHANNEL_NAME -asOrg SubcontractorOrgMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for SubcontractorOrg..."
  exit 1
fi

docker exec -e "FABRIC_CFG_PATH=/etc/hyperledger/" cli configtxgen -profile WastechainChannel -outputAnchorPeersUpdate /etc/hyperledger/config/ThirdPartyOrgMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ThirdPartyOrgMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for ThirdPartyOrg..."
  exit 1
fi

cp private-data-collections.json config/private-data-collections.json