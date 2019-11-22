import * as Joi from '@hapi/joi';

export interface WasteOrder {
    id: string;
    subcontractorMSPID: string;
    originatorMSPID: string;
}

export const WasteOrderSchema = Joi.object().keys({
    id: Joi.string().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required()
});