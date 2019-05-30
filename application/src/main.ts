import { FileSystemWallet, Gateway, GatewayOptions } from "fabric-network";
import * as fs from "fs";
import * as yaml from "js-yaml";

async function main() {
    const gateway = new Gateway();
    const wallet = new FileSystemWallet('/Users/julian/Documents/wallets/identity/user/balaji/wallet');

    try {
        const userName = 'Admin@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions: GatewayOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('Wastechain', 'OrderContract');
        const tx = await contract.submitTransaction('createOrder', 'tdsesddt2s2', 'Testvalue');

        contract.addContractListener('CREATE_ORDER', 'CREATE_ORDER', (error: Error, event: { [key: string]: any }, blockNumber: string, transactionId: string, status: string) => {
            return new Promise((resolve, reject) => {
                console.log('Order Created: ' + JSON.stringify(event.payload));
                if (error) {
                    reject(error)
                } else {
                    resolve(event);
                }
            });
        }, { filtered: false });
    } catch (e) {
        console.log(e);
    } finally {
        console.log("Disconnecting from Fabric gateway.");
        gateway.disconnect();
    }
}

main().then(() => console.log("Finished"), (e) => console.log("Error: " + e));