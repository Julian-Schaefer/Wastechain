import { Express, Request, Response } from 'express';
import { FabricConnection } from '../fabric';
import * as FabricClient from 'fabric-client';

export class OrderController {

    private responses: Response[] = [];
    private fabricConnection: FabricConnection;

    constructor(app: Express, fabricConnection: FabricConnection) {
        this.fabricConnection = fabricConnection;

        app.get('/events', this.getEvents.bind(this));
        app.post('/order/:orderId', this.createOrder.bind(this));

        fabricConnection.eventHub.registerChaincodeEvent('Wastechain', 'CREATE_ORDER', (event: FabricClient.ChaincodeEvent, blockNumber?: number, transactionId?: string, status?: string) => {
            return new Promise((resolve) => {
                console.log('Order Created: ' + status);
                this.sendEvent(JSON.stringify(event));
                resolve({});
            });
        }, (error: Error) => {
            console.error(error);
        });
    }

    private getEvents = (request: Request, response: Response) => {
        // SSE Setup
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        response.write('\n');

        this.responses.push(response);

        request.on('close', () => {
            this.responses.splice(this.responses.indexOf(response));
            console.log('Connection closed');
        });
    };


    private async createOrder(request: Request, response: Response) {
        const orderId = request.params.orderId;
        let contract = await this.fabricConnection.network.getContract('Wastechain', 'OrderContract');
        try {
            await contract.submitTransaction('createOrder', orderId, 'Testvalue');
        } catch (error) {
            console.log('Error submitting Transaction: ' + error);
            response.send('Error submitting Transaction: ' + error);

        }
        console.log('Submitted Contract with ID: ' + orderId);
        response.send('Submitted Contract with ID: ' + request.params.orderId);
    }



    private sendEvent(data: any) {
        this.responses.forEach((response: Response) => {
            response.write(data);
            response.write('\n\n');
        });
    }
}