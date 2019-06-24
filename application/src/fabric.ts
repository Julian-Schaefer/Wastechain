import { FileSystemWallet, Gateway, GatewayOptions, Network } from 'fabric-network';
import * as FabricClient from 'fabric-client';

export class FabricConnection {
    private gateway = new Gateway();

    private username: string;
    private channelName: string;
    private connectionProfile: any;
    private connectionOptions: GatewayOptions;
    private client: FabricClient;
    private _channel: FabricClient.Channel;
    private _eventHub: FabricClient.ChannelEventHub;
    private _network: Network;

    constructor(username: string, channelName: string, walletLocation: string, connectionProfile: any) {
        this.username = username;
        this.channelName = channelName;
        this.connectionProfile = connectionProfile;
        this.connectionOptions = {
            identity: username,
            wallet: new FileSystemWallet(walletLocation),
            discovery: { enabled: false, asLocalhost: true }
        };
    }

    async connect() {
        await this.gateway.connect(this.connectionProfile, this.connectionOptions);
        this.client = this.gateway.getClient();

        if (this.username) {
            let user = await this.client.getUserContext(this.username, true);
            if (!user) {
                throw new Error('User was not found :' + this.username);
            } else {
                console.log('User found');
            }
        }

        this._channel = this.client.getChannel(this.channelName, true);
        this._eventHub = this._channel.newChannelEventHub(this._channel.getChannelPeers()[0].getPeer());
        this._eventHub.connect({ full_block: true }, (error, status) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Connected to EventHub: ' + status.getName());
            }
        });

        this._network = await this.gateway.getNetwork(this.channelName);
    }

    get eventHub(): FabricClient.ChannelEventHub {
        return this._eventHub;
    }

    get channel(): FabricClient.Channel {
        return this._channel;
    }

    get network(): Network {
        return this._network;
    }
}