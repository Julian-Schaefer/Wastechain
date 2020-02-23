export FABRIC_NETWORK_URL="host.docker.internal"
export API_URL="localhost"

docker-compose -f api-compose-mac.yml build
docker-compose -f api-compose-mac.yml up -d