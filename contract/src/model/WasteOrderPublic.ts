import * as Joi from '@hapi/joi';

export enum WasteOrderStatus {
    COMMISSIONED,
    ACCEPTED,
    REJECTED,
    CANCELLED,
    COMPLETED,
}

export interface WasteOrderPublic {
    id: string;
    status: WasteOrderStatus;
    subcontractorMSPID: string;
    originatorMSPID: string;
    wasteOrderPrivateId: string;
}

export const WasteOrderPublicSchema = Joi.object().keys({
    id: Joi.string().required(),
    status: Joi.number().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required(),
    wasteOrderPrivateId: Joi.string().required(),
});

export const WasteOrderPublicCommissionSchema = Joi.object().keys({
    subcontractorMSPID: Joi.string().required(),
});
