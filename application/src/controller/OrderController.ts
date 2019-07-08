import { Express, Request, Response } from 'express';
import * as Joi from '@hapi/joi';
import * as FabricClient from 'fabric-client';
import { FabricConnection } from '../fabric';
import { WasteOrderCreateSchema, WasteOrderUpdateSchema, WasteOrderUpdateStatusSchema, WasteOrder } from '../model/WasteOrder';

export class OrderController {

    private responses: Response[] = [];
    private fabricConnection: FabricConnection;

    constructor(app: Express, fabricConnection: FabricConnection) {
        this.fabricConnection = fabricConnection;

        app.get('/order', this.getOrders.bind(this));
        app.get('/order/:orderId/history', this.getOrderHistory.bind(this));
        app.post('/order/:orderId', this.createWasteOrder.bind(this));
        app.put('/order/:orderId', this.updateWasteOrder.bind(this));
        app.get('/order/commissioned', this.getCommissionedWasteOrders.bind(this));
        app.put('/order/:orderId/status', this.setWasteOrderStatus.bind(this));

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

            let history: { txId: string, timestamp: string, isDelete: string, value: string }[] = JSON.parse(result.toString('utf-8'));
            response.send(JSON.stringify(history));
        } catch (error) {
            console.log('Error getting Transaction History: ' + error);
            response.send('Error getting Transaction History: ' + error);
        }
    }

    private async createWasteOrder(request: Request, response: Response) {
        const orderId = request.params.orderId;
        let wasteOrder = request.body;

        try {
            const validationResult = Joi.validate(wasteOrder, WasteOrderCreateSchema);
            if (validationResult.error !== null) {
                throw validationResult.error;
            }

            const contract = await this.fabricConnection.network.getContract('Wastechain', 'OrderContract');
            const submittedWasteOrderBuffer = await contract.submitTransaction('createOrder', orderId, JSON.stringify(wasteOrder));
            const submittedWasteOrder: WasteOrder = JSON.parse(submittedWasteOrderBuffer.toString('utf-8'));

            console.log('Submitted Contract with ID: ' + submittedWasteOrder.key);
            response.send(JSON.stringify(submittedWasteOrder));
        } catch (error) {
            console.log('Error submitting Transaction: ' + error);
            response.status(500).send('Error submitting Transaction: ' + error);
        }
    }

    private async updateWasteOrder(request: Request, response: Response) {
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
            response.status(500).send('Error submitting Transaction: ' + error);
        }
    }

    private async getCommissionedWasteOrders(_: Request, response: Response) {
        try {
            let MSPID = this.fabricConnection.client.getMspid();
            let contract = await this.fabricConnection.network.getContract('Wastechain', 'OrderContract');
            let wasteOrdersBuffer = await contract.evaluateTransaction('getCommissionedWasteOrdersForMSP', MSPID);
            
            console.log('Retrieved commissioned Waste Orders for MSP: ' + MSPID);
            response.send(wasteOrdersBuffer.toString('utf-8'));
        } catch (error) {
            console.log('Error evaluating Transaction: ' + error);
            response.status(500).send('Error evaluating Transaction: ' + error);
        }
    }

    private async setWasteOrderStatus(request: Request, response: Response) {
        const orderId = request.params.orderId;
        let wasteOrderUpdateStatus = request.body;

        try {
            const validationResult = Joi.validate(wasteOrderUpdateStatus, WasteOrderUpdateStatusSchema);
            if (validationResult.error !== null) {
                throw validationResult.error;
            }

            let contract = await this.fabricConnection.network.getContract('Wastechain', 'OrderContract');
            await contract.evaluateTransaction('updateWasteOrderStatus', orderId, JSON.stringify(wasteOrderUpdateStatus));
            
            console.log('Updated Waste Order Status: ' + orderId);
            response.send('Updated Waste Order Status: ' + orderId);
        } catch (error) {
            console.log('Error evaluating Transaction: ' + error);
            response.status(500).send('Error evaluating Transaction: ' + error);
        }
    }

    private sendEvent(data: any) {
        this.responses.forEach((response: Response) => {
            response.write(data);
            response.write('\n\n');
        });
    }
}