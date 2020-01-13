import * as Joi from '@hapi/joi';

export interface WasteOrderPublic {
    id: string;
    subcontractorMSPID: string;
    originatorMSPID: string;
    wasteOrderPrivateId: string;
}

export const WasteOrderPublicSchema = Joi.object().keys({
    id: Joi.string().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required(),
    wasteOrderPrivateId: Joi.string().required(),
});

export const WasteOrderPublicCommissionSchema = Joi.object().keys({
    subcontractorMSPID: Joi.string().required(),
});
