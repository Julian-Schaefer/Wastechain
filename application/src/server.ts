import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import { ValidationError } from '@hapi/joi';
import SettingsRouter from './controller/SettingsRouter';
import WasteOrderRouter from './wasteOrder/WasteOrderRouter';

const app = express();

if (process.env.ALLOW_CORS === 'true') {
    app.use(cors());
}

app.use(bodyparser.json());

app.use((req: express.Request, _, next) => {
    console.log('Logger:' + JSON.stringify(req.body));
    next();
});

app.use(function (error: Error, _: any, response: any, next: any) {
    if ((error as ValidationError).isJoi) {
        response.status(400).send('Invalid Format of the Request Body.');
        next();
    }
    else {
        next(error); // pass error on if not a validation error
    }
});

app.use('/settings', SettingsRouter);
app.use('/order', WasteOrderRouter);

export function startServer() {
    app.listen(process.env.PORT, function () {
        console.log('Wastechain-Server listening on port ' + process.env.PORT + '!');
    });
}
