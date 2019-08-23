import * as Joi from '@hapi/joi';

/**
 * @swagger
 * definitions:
 *   Settings:
 *     type: object
 *     required:
 *       - postUrl
 *     properties:
 *       postUrl:
 *         type: string
 */
export interface Settings {
    postUrl: string;
}

export const SettingsSchema = Joi.object().keys({
    postUrl: Joi.string().required()
});