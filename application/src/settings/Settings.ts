import * as Joi from '@hapi/joi';

/**
 * @swagger
 * definition:
 *   settings:
 *     properties:
 *       name:
 *         postUrl: string
 */
export interface Settings {
    postUrl: string;
}

export const SettingsSchema = Joi.object().keys({
    postUrl: Joi.string().required()
});