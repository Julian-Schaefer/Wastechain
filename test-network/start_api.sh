docker build ../application --tag wastechain.azurecr.io/wastechain-api:master
docker build ../frontend --tag wastechain.azurecr.io/wastechain-frontend:master

docker-compose -f api-compose.yml up -d