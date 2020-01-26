'use strict';

const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    let args = process.argv.slice(2);

    const walletLocation = args[0];
    const organisationURL = args[1];
    const organisationMSP = args[2];
    const username = args[3];
    let networkFolder;

    if (args[4]) {
        networkFolder = args[4];
    } else {
        networkFolder = await new Promise((resolve) => {
            rl.question('Please enter the Path of the Network Folder: ', (response) => {
                networkFolder = response;
                rl.close();
                resolve(networkFolder)
            });
        }).then((value) => {
            return value;
        });
    }

    let wallet = new FileSystemWallet(walletLocation);

    try {
        // Identity to credentials to be stored in the wallet
        const credPath = path.join(networkFolder, '/crypto-config/peerOrganizations/' + organisationURL + '/users/' + username);
        const cert = fs.readFileSync(path.join(credPath, '/msp/signcerts/' + username + '-cert.pem')).toString();
        let key;

        //const key = fs.readFileSync(path.join(credPath, '/msp/keystore/cd96d5260ad4757551ed4a5a991e62130f8008a0bf996e4e4b84cd097a747fec_sk')).toString();
        fs.readdirSync(path.join(credPath, '/msp/keystore/')).forEach((file) => {
            key = fs.readFileSync(path.join(credPath, '/msp/keystore/' + file)).toString();
        })

        // Load credentials into wallet
        const identityLabel = username;
        const identity = X509WalletMixin.createIdentity(organisationMSP, cert, key);

        await wallet.import(identityLabel, identity);
    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
    process.exit(0);
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});