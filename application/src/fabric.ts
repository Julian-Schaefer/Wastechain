import { FileSystemWallet, Gateway, GatewayOptions, Contract, Network } from "fabric-network";
import * as FabricClient from "fabric-client";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { send } from "./main";

var network: Network;

async function startFabric() {
    const gateway = new Gateway();
    const wallet = new FileSystemWallet('/Users/julian/Documents/wallets/identity/user/balaji/wallet');

    try {
        const userName = 'Admin@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('networkConnection.yaml', 'utf8'));
        let clientConfig = yaml.safeLoad(fs.readFileSync('client.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions: GatewayOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);
        let client = gateway.getClient();

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        network = await gateway.getNetwork('mychannel');

        //let client = FabricClient.loadFromConfig(connectionProfile);
        //client.loadFromConfig(clientConfig);
        //client.setStateStore(wallet.getStateStore());
        //client.setCryptoSuite(wallet.getCryptoSuite());
        //await client.initCredentialStores();

        if (userName) {
            let user = await client.getUserContext(userName, true);
            if (!user) {
                throw new Error('User was not found :' + userName);
            } else {
                console.log('User found');
                //logger.debug('User %s was found to be registered and enrolled', userName);
            }
        }

        var channel = client.getChannel('mychannel', true);
        var eventHub = channel.newChannelEventHub('peer0.org1.example.com');
        eventHub.connect({ full_block: true }, (err, status) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Connected to EventHub');
            }
        });

        eventHub.registerChaincodeEvent('Wastechain', 'CREATE_ORDER', (event: FabricClient.ChaincodeEvent, blockNumber?: number, transactionId?: string, status?: string) => {
            return new Promise((resolve, reject) => {
                console.log(event.chaincode_id);
                console.log(event.payload.toString());
                console.log('Order Created: ' + status);
                send(JSON.stringify(event));
                resolve(event);
            });
        }, (error: Error) => {
            console.log(error);
        });



        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        let contract = await network.getContract('Wastechain', 'OrderContract');

        // contract.addContractListener('CREATdsE_ORDER', 'CREATE_ORDER', (error: Error, event: { [key: string]: any }, blockNumber: string, transactionId: string, status: string) => {
        //     return new Promise((resolve, reject) => {
        //         console.log('Order Created: ' + event.payload.toString('utf-8'));
        //         if (error) {
        //             reject(error)
        //         } else {
        //             resolve(event);
        //         }
        //     });
        // }, { filtered: false });


        //const tx = await contract.submitTransaction('createOrder', 'test2', 'Testvalue');
    } catch (e) {
        console.log(e);
    } finally {
        //console.log("Disconnecting from Fabric gateway.");
        //gateway.disconnect();
    }
}

export {
    startFabric,
    network
};