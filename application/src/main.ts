import * as express from 'express';
import { FabricConnection } from './fabric';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { WastechainServer } from './server';

async function main() {

    const username = 'Admin@org1.example.com';
    const channelName = 'mychannel';
    const walletLocation = '/Users/julian/Documents/wallets/identity/user/balaji/wallet';
    let connectionProfile = yaml.safeLoad(fs.readFileSync('networkConnection.yaml', 'utf8'));

    const fabricConnection = new FabricConnection(username, channelName, walletLocation, connectionProfile);
    await fabricConnection.connect();

    new WastechainServer(fabricConnection);
}

main().then(() => {
    console.log('Application started.');
}).catch((e: Error) => {
    console.log('Error starting application: ' + e);
});