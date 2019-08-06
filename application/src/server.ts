import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import { ValidationError } from '@hapi/joi';
import { WasteOrderController } from './controller/WasteOrderController';
import { FabricConnection } from './fabric';
import { SettingsController } from './controller/SettingsController';

export class WastechainServer {
    private app = express();
    private _orderController: WasteOrderController;

    constructor(fabricConnection: FabricConnection) {
        if (process.env.ALLOW_CORS === 'true') {
            console.log(process.env.ALLOW_CORS);
            this.app.use(cors());
        }
        this.app.use(bodyparser.json());
        this.app.listen(process.env.PORT, function () {
            console.log('Wastechain-Server listening on port ' + process.env.PORT + '!');
        });

        this.app.use((req, _, next) => {
            console.log('Logger:' + JSON.stringify(req.body));
            next();
        })

        this._orderController = new WasteOrderController(this.app, fabricConnection);
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

    get getOrderController(): WasteOrderController {
        return this._orderController;
    }
}