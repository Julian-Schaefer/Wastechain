#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=wastechain

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

mkdir config

# generate genesis block for orderer
configtxgen -profile OrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
configtxgen -profile WastechainChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
configtxgen -profile WastechainChannel -outputAnchorPeersUpdate ./config/OrderingOrgMSPanchors.tx -channelID $CHANNEL_NAME -asOrg OrderingOrgMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrderingOrg..."
  exit 1
fi

configtxgen -profile WastechainChannel -outputAnchorPeersUpdate ./config/SubcontractorOrgMSPanchors.tx -channelID $CHANNEL_NAME -asOrg SubcontractorOrgMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for SubcontractorOrg..."
  exit 1
fi

configtxgen -profile WastechainChannel -outputAnchorPeersUpdate ./config/ThirdPartyOrgMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ThirdPartyOrgMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for ThirdPartyOrg..."
  exit 1
fi