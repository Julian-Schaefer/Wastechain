docker-compose kill && docker-compose down
cd ../../network/
./teardown.sh
./start.sh
cd ../contract/cli
docker-compose up -d cli
docker exec cli peer chaincode install -n Wastechain -v 0 -p /opt/gopath/src/github.com/contract -l node
docker exec cli peer chaincode instantiate -n Wastechain -v 0 -l node -c '{"Args":["orderExists", "test001"]}' -C mychannel -P "AND ('Org1MSP.member')"