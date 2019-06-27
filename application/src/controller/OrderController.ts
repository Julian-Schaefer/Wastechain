import { Express, Request, Response } from 'express';
import * as Joi from '@hapi/joi';
import * as FabricClient from 'fabric-client';
import { FabricConnection } from '../fabric';
import { WasteOrderSchema, WasteOrderUpdateSchema } from '../model/WasteOrder';

export class OrderController {

    private responses: Response[] = [];
    private fabricConnection: FabricConnection;

    constructor(app: Express, fabricConnection: FabricConnection) {
        this.fabricConnection = fabricConnection;

        app.get('/order', this.getOrders.bind(this));
        app.get('/order/:orderId/history', this.getOrderHistory.bind(this));
        app.post('/order/:orderId', this.createOrder.bind(this));
        app.put('/order/:orderId', this.updateOrder.bind(this));

        fabricConnection.eventHub.registerChaincodeEvent('Wastechain', 'CREATE_ORDER', (event: FabricClient.ChaincodeEvent, blockNumber?: number, transactionId?: string, status?: string) => {
            return new Promise((resolve) => {
                console.log('Order Created: ' + status);
                //this.sendEvent(JSON.stringify(event));
                this.sendEvent(JSON.stringify(event.payload.toString('utf-8')));

                resolve({});
            });
        }, (error: Error) => {
            console.error(error);
        });
    }

    private getOrders = (request: Request, response: Response) => {
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

    private async getOrderHistory(request: Request, response: Response) {
        const orderId = request.params.orderId;
        try {
            let contract = await this.fabricConnection.network.getContract('Wastechain', 'OrderContract');
            let result = await contract.evaluateTransaction('getHistory', orderId);
            response.send(result.toString('utf-8'));
        } catch (error) {
            console.log('Error submitting Transaction: ' + error);
            response.send('Error submitting Transaction: ' + error);
        }
    }

    private async createOrder(request: Request, response: Response) {
        const orderId = request.params.orderId;
        let wasteOrder = request.body;

        try {
            const validationResult = Joi.validate(wasteOrder, WasteOrderSchema);
            if (validationResult.error !== null) {
                throw validationResult.error;
            }

            let contract = await this.fabricConnection.network.getContract('Wastechain', 'OrderContract');
            await contract.submitTransaction('createOrder', orderId, JSON.stringify(wasteOrder));

            console.log('Submitted Contract with ID: ' + orderId);
            response.send('Submitted Contract with ID: ' + request.params.orderId);
        } catch (error) {
            console.log('Error submitting Transaction: ' + error);
            response.send('Error submitting Transaction: ' + error);
        }
    }

    private async updateOrder(request: Request, response: Response) {
        const orderId = request.params.orderId;  
        let wasteOrderUpdate = request.body;

        
        try {
            const validationResult = Joi.validate(wasteOrderUpdate, WasteOrderUpdateSchema);
            if (validationResult.error !== null) {
                throw validationResult.error;
            }

            let contract = await this.fabricConnection.network.getContract('Wastechain', 'OrderContract');
            await contract.submitTransaction('updateOrder', orderId, JSON.stringify(wasteOrderUpdate));

            console.log('Updated Contract with ID: ' + orderId);
            response.send('Updated Contract with ID: ' + request.params.orderId);
        } catch (error) {
            console.log('Error submitting Transaction: ' + error);
            response.send('Error submitting Transaction: ' + error);
        }
    }

    private sendEvent(data: any) {
        this.responses.forEach((response: Response) => {
            response.write(data);
            response.write('\n\n');
        });
    }
}