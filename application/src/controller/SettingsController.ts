import { Express, Request, Response } from 'express';
import { Settings, SettingsSchema } from '../model/Settings';
import { Validator } from 'express-json-validator-middleware';
import * as fs from 'fs';

export class SettingsController {
    private FILE_NAME = 'wastechain.json';
    private validator = new Validator({ allErrors: true });

    constructor(app: Express) {
        let validator = this.validator.validate({ body: SettingsSchema });
        app.get('/settings', this.getSettings.bind(this));
        app.post('/settings', validator, this.postSettings.bind(this));
    }

    private getSettings(_: Request, response: Response) {
        fs.readFile(this.FILE_NAME, (error, data: Buffer) => {
            if (error) {
                response.send('Error reading Settings.');
                console.log('Error reading Settings: ' + error);
            } else {
                let settings = JSON.parse(data.toString('utf8')) as Settings;
                response.setHeader('Content-Type', 'application/json');
                response.send(settings);
            }
        });
    }

    private async postSettings(request: Request, response: Response) {
        let settings = request.body as Settings;

        fs.writeFile(this.FILE_NAME, JSON.stringify(settings), 'utf8', (error) => {
            if (error) {
                response.send('Error writing Settings.');
                console.log('Error writing Settings: ' + error);
            } else {
                response.setHeader('Content-Type', 'application/json');
                response.send(settings);
            }
        });
    }
}