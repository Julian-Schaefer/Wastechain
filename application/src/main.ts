import { connectToFabric } from './FabricConnection';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as dotenv from 'dotenv';
import { startServer } from './server';

async function main() {
    dotenv.config();

    const username = process.env.USERNAME;
    const channelName = process.env.CHANNEL_NAME;
    const walletLocation = process.env.WALLET_LOCATION;
    let networkConnectionString = fs.readFileSync(process.env.CONNECTION_FILE, 'utf8');
    let connectionProfile = yaml.safeLoad(networkConnectionString.split('${FABRIC_NETWORK_URL}').join(process.env.FABRIC_NETWORK_URL));

    await connectToFabric(username, channelName, walletLocation, connectionProfile);
    startServer();
}

main().then(() => {
    console.log('Application started.');
}).catch((e: Error) => {
    console.log('Error starting application: ' + e);
    console.log(e.stack);
});
