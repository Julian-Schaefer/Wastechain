import * as express from 'express';
import * as bodyparser from 'body-parser';
import { ValidationError } from '@hapi/joi';
import { OrderController } from './controller/OrderController';
import { FabricConnection } from './fabric';
import { SettingsController } from './controller/SettingsController';

export class WastechainServer {
    private app = express();
    private _orderController: OrderController;

    constructor(fabricConnection: FabricConnection) {
        this.app.use(bodyparser.json());
        this.app.listen(process.env.PORT, function () {
            console.log('Wastechain-Server listening on port 3000!');
        });

        this.app.use((req, _, next) => {
            console.log('Logger:' + JSON.stringify(req.body));
            next();
        })

        this._orderController = new OrderController(this.app, fabricConnection);
        new SettingsController(this.app);

        this.app.use(function (error: Error, _: any, response: any, next: any) {
            if ((error as ValidationError).isJoi) {
                response.status(400).send('Invalid Format of the Request Body.');
                next();
            }
            else {
                next(error); // pass error on if not a validation error
            }
        });
    }

    get getOrderController(): OrderController {
        return this._orderController;
    }
}