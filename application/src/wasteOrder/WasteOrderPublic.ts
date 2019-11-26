import * as Joi from '@hapi/joi';
import { WasteOrder } from './WasteOrder';

export interface WasteOrderPublic {
    id: string;
    subcontractorMSPID: string;
    originatorMSPID: string;
}

export const WasteOrderPublicSchema = Joi.object().keys({
    id: Joi.string().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required()
});


export const WasteOrderPublicCommissionSchema = Joi.object().keys({
    id: Joi.string().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required()
});

export function getWasteOrderPublicFromWasteOrder(wasteOrder: WasteOrder): WasteOrderPublic {
    return {
        id: wasteOrder.id,
        subcontractorMSPID: wasteOrder.subcontractorMSPID,
        originatorMSPID: wasteOrder.originatorMSPID
    }
}