import * as Joi from '@hapi/joi';

export interface TaskSite {
    name: string;
    name2: string;
    address: string;
    address2: string;
    postCode: string;
    city: string;
    countryCode: string;
    areaCode: string;
}

/**
 *  @swagger
 *  definitions:
 *      TaskSiteSchema:
 *          type: object
 *          required:
 *              - name
 *              - name2
 *              - address
 *              - address2
 *              - postCode
 *              - city
 *              - countryCode
 *              - areaCode
 *          properties:
 *              name:
 *                  type: string
 *              name2:
 *                  type: string
 *              address:
 *                  type: string
 *              address2:
 *                  type: string
 *              postCode:
 *                  type: string
 *              city:
 *                  type: string
 *              countryCode:
 *                  type: string
 *              areaCode:
 *                  type: string
 */
export const TaskSiteSchema = Joi.object().keys({
    name: Joi.string().required(),
    name2: Joi.string().required(),
    address: Joi.string().required(),
    address2: Joi.string().required(),
    postCode: Joi.string().required(),
    city: Joi.string().required(),
    countryCode: Joi.string().required(),
    areaCode: Joi.string().required()
});