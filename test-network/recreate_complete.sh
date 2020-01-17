./teardown.sh
docker rmi $(docker images -aq)
docker volume prune -f

cd ../contract
npm install

cd ../application
npm install
npm run build

cd ../test-network

./generate.sh
./import_wallet.sh

./up.sh