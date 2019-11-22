
cd ../contract
npm run build
cd ../test-network

# Install Wastechain on peer0.ordering-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=OrderingOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ordering-organisation.com/users/Admin@ordering-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.ordering-organisation.com:7051" cli peer chaincode install -n Wastechain -v 0 -p /opt/gopath/src/github.com/contract -l node

# Install Wastechain on peer0.subcontractor-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=SubcontractorOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/subcontractor-organisation.com/users/Admin@subcontractor-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.subcontractor-organisation.com:7051" cli peer chaincode install -n Wastechain -v 0 -p /opt/gopath/src/github.com/contract -l node

# Install Wastechain on peer0.third-party-organisation.com.
docker exec -e "CORE_PEER_LOCALMSPID=ThirdPartyOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/third-party-organisation.com/users/Admin@third-party-organisation.com/msp" -e "CORE_PEER_ADDRESS=peer0.third-party-organisation.com:7051" cli peer chaincode install -n Wastechain -v 0 -p /opt/gopath/src/github.com/contract -l node

# Instantiate Chaincode
docker exec cli peer chaincode instantiate -n Wastechain -v 0 -l node -c '{"Args":["checkIfWasteOrderExists", "test001"]}' -C wastechain -P "OR('OrderingOrgMSP.peer', 'SubcontractorOrgMSP.peer', 'ThirdPartyOrgMSP.peer')" --collections-config "/opt/gopath/src/github.com/hyperledger/fabric/peer/config/private-data-collections.json"