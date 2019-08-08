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