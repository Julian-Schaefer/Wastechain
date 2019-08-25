import * as Joi from '@hapi/joi';

export enum EquipmentType {
    SUBMISSION,
    PICK_UP,
    EXCHANGE,
    CLEARANCE
}

export interface Service {
    description: string;
    description2: string;
    materialDescription: string;
    equipmentType: EquipmentType;
    equipmentDescription: string;
}

export const ServiceSchema = Joi.object().keys({
    description: Joi.string().required(),
    description2: Joi.string().required(),
    materialDescription: Joi.string().required(),
    equipmentType: Joi.number().required(),
    equipmentDescription: Joi.string().required()
});