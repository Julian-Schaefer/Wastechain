import * as express from 'express';
import * as bodyparser from 'body-parser';
import { OrderController } from './controller/OrderController';
import { FabricConnection } from './fabric';
import { SettingsController } from './controller/SettingsController';

export class WastechainServer {
    private app = express();
    private _orderController: OrderController;

    constructor(fabricConnection: FabricConnection) {
        this.app.use(bodyparser.json());
        this.app.listen(3000, function () {
            console.log('Wastechain-Server listening on port 3000!');
        });
        this._orderController = new OrderController(this.app, fabricConnection);
        new SettingsController(this.app);
    }

    get getOrderController(): OrderController {
        return this._orderController;
    }
}