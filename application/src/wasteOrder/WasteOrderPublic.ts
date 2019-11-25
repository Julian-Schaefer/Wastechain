import * as Joi from '@hapi/joi';

export interface WasteOrderPublic {
    id: string;
    subcontractorMSPID: string;
    originatorMSPID: string;
    privateDataId: string;
}

export const WasteOrderPublicSchema = Joi.object().keys({
    id: Joi.string().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required(),
    privateDataId: Joi.string().required()
});


export const WasteOrderPublicCommissionSchema = Joi.object().keys({
    id: Joi.string().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required()
});