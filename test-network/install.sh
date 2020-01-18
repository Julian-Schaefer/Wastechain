
cd ../contract
npm run build
cd ../test-network

# Install Wastechain on peer0.ordering-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=OrderingOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/ordering-organisation.com/users/Admin@ordering-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.ordering-organisation.com:7051" cli peer chaincode install -n Wastechain -v 1.0 -p /opt/gopath/src/github.com/contract -l node

# Install Wastechain on peer0.subcontractor-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=SubcontractorOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/subcontractor-organisation.com/users/Admin@subcontractor-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.subcontractor-organisation.com:7051" cli peer chaincode install -n Wastechain -v 1.0 -p /opt/gopath/src/github.com/contract -l node

# Install Wastechain on peer0.third-party-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=ThirdPartyOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/third-party-organisation.com/users/Admin@third-party-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.third-party-organisation.com:7051" cli peer chaincode install -n Wastechain -v 1.0 -p /opt/gopath/src/github.com/contract -l node

# Instantiate Chaincode
docker exec -e "CORE_PEER_LOCALMSPID=OrderingOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/ordering-organisation.com/users/Admin@ordering-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.ordering-organisation.com:7051" cli peer chaincode instantiate -n Wastechain -v 1.0 -l node -c '{"Args":["init"]}' -C wastechain -P "OR('OrderingOrgMSP.peer', 'SubcontractorOrgMSP.peer', 'ThirdPartyOrgMSP.peer')" --collections-config "/etc/hyperledger/config/private-data-collections.json"

sleep 2
#Query on peer0.subcontractor-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=SubcontractorOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/subcontractor-organisation.com/users/Admin@subcontractor-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.subcontractor-organisation.com:7051" cli peer chaincode query -C wastechain --name Wastechain -c '{"Args":["init"]}'

sleep 1
#Query on peer0.third-party-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=ThirdPartyOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/peerOrganizations/third-party-organisation.com/users/Admin@third-party-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.third-party-organisation.com:7051" cli peer chaincode query -C wastechain --name Wastechain -c '{"Args":["init"]}'