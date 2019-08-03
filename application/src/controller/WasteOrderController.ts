import { Express, Request, Response } from 'express';
import * as Joi from '@hapi/joi';
import * as FabricClient from 'fabric-client';
import { FabricConnection } from '../fabric';
import { WasteOrderCommissionSchema, WasteOrderRecommissionSchema, WasteOrderRejectSchema, WasteOrderCompleteSchema, WasteOrder, WasteOrderStatus, WasteOrderUpdateStatusSchema } from '../model/WasteOrder';

export class WasteOrderController {

    private responses: Response[] = [];
    private fabricConnection: FabricConnection;

    constructor(app: Express, fabricConnection: FabricConnection) {
        this.fabricConnection = fabricConnection;

        // GET
        app.get('/order', this.getWasteOrders.bind(this));
        app.get('/order/incoming/status/:status', this.getWasteOrdersForSubcontractorWithStatus.bind(this));
        app.get('/order/outgoing/status/:status', this.getWasteOrdersForOriginatorWithStatus.bind(this));
        app.get('/order/:id', this.getWasteOrder.bind(this));
        app.get('/order/:id/history', this.getWasteOrderHistory.bind(this));
        // POST
        app.post('/order/:id', this.createWasteOrder.bind(this));
        // PUT
        app.put('/order/:id', this.updateWasteOrder.bind(this));

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

    private getWasteOrders = (request: Request, response: Response) => {
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

    private async getWasteOrder(request: Request, response: Response) {
        const wasteOrderId = request.params.id;

        try {
            const contract = this.fabricConnection.wasteOrderContract;
            const wasteOrderBuffer = await contract.evaluateTransaction('getWasteOrder', wasteOrderId);
            const wasteOrder: WasteOrder = JSON.parse(wasteOrderBuffer.toString('utf-8'));

            console.log('Got Waste Order with ID: ' + wasteOrder.key);
            response.send(JSON.stringify(wasteOrder));
        } catch (error) {
            console.log('Error evaluating Transaction: ' + error);
            response.status(500).send('Error evaluating Transaction: ' + error);
        }
    }

    private async getWasteOrderHistory(request: Request, response: Response) {
        const wasteOrderId = request.params.id;

        try {
            let contract = await this.fabricConnection.wasteOrderContract;
            let result = await contract.evaluateTransaction('getWasteOrderHistory', wasteOrderId);

            let history: { txId: string, timestamp: string, isDelete: string, value: string }[] = JSON.parse(result.toString('utf-8'));
            response.send(JSON.stringify(history));
        } catch (error) {
            console.log('Error getting Transaction History: ' + error);
            response.send('Error getting Transaction History: ' + error);
        }
    }

    private async createWasteOrder(request: Request, response: Response) {
        const wasteOrderId = request.params.id;
        const wasteOrder = request.body;

        try {
            const validationResult = Joi.validate(wasteOrder, WasteOrderCommissionSchema);
            if (validationResult.error !== null) {
                throw validationResult.error;
            }

            const contract = this.fabricConnection.wasteOrderContract;
            const submittedWasteOrderBuffer = await contract.submitTransaction('commissionWasteOrder', wasteOrderId, JSON.stringify(wasteOrder));
            const submittedWasteOrder: WasteOrder = JSON.parse(submittedWasteOrderBuffer.toString('utf-8'));

            console.log('Submitted Waste Order with ID: ' + submittedWasteOrder.key);
            response.send(JSON.stringify(submittedWasteOrder));
        } catch (error) {
            console.log('Error submitting Transaction: ' + error);
            response.status(500).send('Error submitting Transaction: ' + error);
        }
    }

    private async updateWasteOrder(request: Request, response: Response) {
        const wasteOrderId = request.params.id;
        const updatedWasteOrder: WasteOrder = request.body;

        try {
            let validationSchema: Joi.ObjectSchema;
            let procedure: string;
            let sendBody = false;

            switch (updatedWasteOrder.status) {
                case WasteOrderStatus.COMMISSIONED:
                    validationSchema = WasteOrderRecommissionSchema;
                    procedure = 'recommissionWasteOrder';
                    sendBody = true;
                    break;

                case WasteOrderStatus.ACCEPTED:
                    validationSchema = WasteOrderUpdateStatusSchema;
                    procedure = 'acceptWasteOrder';
                    break;

                case WasteOrderStatus.REJECTED:
                    validationSchema = WasteOrderRejectSchema;
                    procedure = 'rejectWasteOrder';
                    sendBody = true;
                    break;

                case WasteOrderStatus.CANCELLED:
                    validationSchema = WasteOrderUpdateStatusSchema;
                    procedure = 'cancelWasteOrder';
                    break;

                case WasteOrderStatus.COMPLETED:
                    validationSchema = WasteOrderCompleteSchema;
                    procedure = 'completeWasteOrder';
                    sendBody = true;
                    break;

                default:
                    console.log('Error: Unknown Status "' + status + '"');
                    response.status(500).send('Error: Unknown Status "' + status + '"');
                    return;
            }


            let validationResult = Joi.validate(updatedWasteOrder, validationSchema);
            if (validationResult.error !== null) {
                throw validationResult.error;
            }

            delete updatedWasteOrder.status;

            const contract = await this.fabricConnection.wasteOrderContract;
            if (sendBody) {
                await contract.submitTransaction(procedure, wasteOrderId, JSON.stringify(updatedWasteOrder));
            } else {
                await contract.submitTransaction(procedure, wasteOrderId);
            }

            console.log('Updated Contract with ID: ' + wasteOrderId);
            response.send('Updated Contract with ID: ' + wasteOrderId);
        } catch (error) {
            console.log('Error evaluating Transaction: ' + error);
            response.status(500).send('Error evaluating Transaction: ' + error);
        }
    }

    private async getWasteOrdersForSubcontractorWithStatus(request: Request, response: Response) {
        const status = request.params.status;

        try {
            let MSPID = this.fabricConnection.client.getMspid();
            let contract = await this.fabricConnection.wasteOrderContract;
            let wasteOrdersBuffer = await contract.evaluateTransaction('getWasteOrdersForSubcontractorWithStatus', MSPID, status);

            console.log('Retrieved Waste Orders with status ' + status + ' for Subcontractor: ' + MSPID);
            response.send(wasteOrdersBuffer.toString('utf-8'));
        } catch (error) {
            console.log('Error evaluating Transaction: ' + error);
            response.status(500).send('Error evaluating Transaction: ' + error);
        }
    }

    private async getWasteOrdersForOriginatorWithStatus(request: Request, response: Response) {
        const status = request.params.status;

        try {
            let MSPID = this.fabricConnection.client.getMspid();
            let contract = await this.fabricConnection.wasteOrderContract;
            let wasteOrdersBuffer = await contract.evaluateTransaction('getWasteOrdersForOriginatorWithStatus', MSPID, status);

            console.log('Retrieved Waste Orders with status ' + status + ' for Originator: ' + MSPID);
            response.send(wasteOrdersBuffer.toString('utf-8'));
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