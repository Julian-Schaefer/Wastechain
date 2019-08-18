import { Express, Request, Response } from 'express';
import { Settings, SettingsSchema } from './Settings';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

const FILE_NAME = 'wastechain.json';

function getSettings(_: Request, response: Response) {
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

function postSettings(request: Request, response: Response) {
    let settings = request.body as Settings;
    const validationResult = Joi.validate(settings, SettingsSchema);
    if (validationResult.error !== null) {
        throw validationResult.error;
    }

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

export {
    getSettings,
    postSettings
};