./teardown.sh
docker rmi $(docker images -aq)
docker volume prune -f

cd ../contract

cd ../application
npm run build

cd ../test-network

./generate.sh
./import_wallet.sh

./up.sh