#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

./teardown.sh

# Exit on first error, print all commands.
set -ev

docker-compose -f docker-compose.yml up -d
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec cli peer channel create -o orderer.wastechain.org:7050 -c wastechain -f /etc/hyperledger/config/channel.tx

# Join peer0.ordering-organisation.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=OrderingOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/ordering-organisation.com/users/Admin@ordering-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.ordering-organisation.com:7051" cli peer channel join -b wastechain.block
docker exec -e "CORE_PEER_LOCALMSPID=OrderingOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/ordering-organisation.com/users/Admin@ordering-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.ordering-organisation.com:7051" cli peer channel update -o orderer.wastechain.org:7050 -c wastechain -f /etc/hyperledger/config/OrderingOrgMSPanchors.tx

# Join peer0.subcontractor-organisation.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=SubcontractorOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/subcontractor-organisation.com/users/Admin@subcontractor-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.subcontractor-organisation.com:7051" cli peer channel join -b wastechain.block
docker exec -e "CORE_PEER_LOCALMSPID=SubcontractorOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/subcontractor-organisation.com/users/Admin@subcontractor-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.subcontractor-organisation.com:7051" cli peer channel update -o orderer.wastechain.org:7050 -c wastechain -f /etc/hyperledger/config/SubcontractorOrgMSPanchors.tx

# Join peer0.third-party-organisation.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ThirdPartyOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/third-party-organisation.com/users/Admin@third-party-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.third-party-organisation.com:7051" cli peer channel join -b wastechain.block
docker exec -e "CORE_PEER_LOCALMSPID=ThirdPartyOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/third-party-organisation.com/users/Admin@third-party-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.third-party-organisation.com:7051" cli peer channel update -o orderer.wastechain.org:7050 -c wastechain -f /etc/hyperledger/config/ThirdPartyOrgMSPanchors.tx