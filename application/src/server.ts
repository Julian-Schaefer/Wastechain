import * as express from 'express';
import { OrderController } from './controller/OrderController';
import { FabricConnection } from './fabric';

export class WastechainServer {
    private app = express();
    private _orderController: OrderController;

    constructor(fabricConnection: FabricConnection) {
        this.app.listen(3000, function () {
            console.log('Wastechain-Server listening on port 3000!');
        });
        this._orderController = new OrderController(this.app, fabricConnection);
    }

    get getOrderController(): OrderController {
        return this._orderController;
    }
}