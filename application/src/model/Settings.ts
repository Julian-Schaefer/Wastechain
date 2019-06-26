import * as Joi from '@hapi/joi';

export interface Settings {
    postUrl: string;
}

export const SettingsSchema = Joi.object().keys({
    postUrl: Joi.string().required()
});