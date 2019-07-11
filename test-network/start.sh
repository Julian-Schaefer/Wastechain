#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=OrderingOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@ordering-organisation.org/msp" peer0.ordering-organisation.org peer channel create -o orderer.wastechainorderer.org:7050 -c wastechain -f /etc/hyperledger/configtx/channel.tx
# Join peer0.ordering-organisation.org to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@ordering-organisation.org/msp" peer0.ordering-organisation.org peer channel join -b wastechain.block
# Join peer0.subcontractor-organisation.org to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@subcontractor-organisation.org/msp" peer0.subcontractor-organisation.org peer channel join -b wastechain.block
# Join peer0.third-party-organisation.org to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@third-party-organisation.org/msp" peer0.third-party-organisation.org peer channel join -b wastechain.block
