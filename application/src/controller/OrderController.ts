import { Express, Request, Response } from 'express';
import * as Joi from '@hapi/joi';
import * as FabricClient from 'fabric-client';
import { FabricConnection } from '../fabric';
import { WasteOrderSchema, WasteOrderUpdateSchema, WasteOrder } from '../model/WasteOrder';

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
            let result = await contract.evaluateTransaction('getHistory2', orderId);

            // let resultArray: WasteOrder[] = JSON.parse(result.toString('utf-8'));
            // resultArray.forEach((wasteOrder: WasteOrder) => {
            //     const validationResult = Joi.validate(wasteOrder, WasteOrderSchema);
            //     if (validationResult.error !== null) {
            //         throw validationResult.error;
            //     }
            // });
            // console.log('GANZER INPUT ' + result.toString('utf-8') + '\n\n');


            // let jsonobject: any[] = JSON.parse(result.toString('utf-8'));
            // let response2 = '';
            // for (let i = 0; i < jsonobject.length; i++) {
            //     jsonobject[i].value = this.convert(jsonobject[i].value);
            //     response2 += JSON.stringify(jsonobject[i]) + "\n\n?????";
            // }

            response.send(result.toString());
        } catch (error) {
            console.log('Error submitting Transaction: ' + error);
            response.send('Error submitting Transaction: ' + error);
        }
    }

    private convert(input: string): string {
        let string = '';

        console.log('INPUT: ' + input + '\n\n'); 
        let start = -1;
        let open = 0;
        for (let i = 0; i < input.length; i++) {
            let char = input.charAt(i);
            console.log(char);
            if (char === '{') {
                if (start === -1) {
                    start = i;
                } else {
                    open++;
                }
            } else if (char === '}') {
                if (start !== -1) {
                    if (open !== 0) {
                        open--;
                    } else {
                        //console.log(i + ', ' + start);
                        let sub = input.substring(start, i - start + 1);
                        //console.log(sub);
                        string += sub + '---;---';
                        start = -1;
                    }
                }
            }
        }

        return string;
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