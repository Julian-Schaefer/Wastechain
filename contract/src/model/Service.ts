import * as Joi from '@hapi/joi';

export interface Service {
    description: string;
    description2: string;
}

export const ServiceSchema = Joi.object().keys({
    description: Joi.string().required(),
    description2: Joi.string().required()
});