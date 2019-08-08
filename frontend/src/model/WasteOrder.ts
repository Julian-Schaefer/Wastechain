import { Service, ServiceSchema } from "./Service";
import { TaskSite, TaskSiteSchema } from "./TaskSite";
import * as Joi from '@hapi/joi';

export enum WasteOrderStatus {
    COMMISSIONED,
    ACCEPTED,
    REJECTED,
    CANCELLED,
    COMPLETED
}

export interface WasteOrder {
    key: string;
    status: WasteOrderStatus;
    subcontractorMSPID: string;
    originatorMSPID: string;
    customerName: string;
    taskSite: TaskSite;
    service: Service;
    description: string;
    quantity: number;
    unitPrice: number;
    unitOfMeasure: string;
    taskDate: Date
    startingTime: string;
    finishingTime: string;
    referenceNo: string;
    rejectionMessage: string;
    lastChanged: Date;
    lastChangedByMSPID: string;
}

export const WasteOrderSchema = Joi.object().keys({
    key: ServiceSchema.required(),
    status: Joi.number().required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required(),
    customerName: Joi.string().required(),
    taskSite: TaskSiteSchema.required(),
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    unitOfMeasure: Joi.string().required(),
    taskDate: Joi.date().required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string(),
    referenceNo: Joi.string().required(),
    rejectionMessage: Joi.string(),
    lastChanged: Joi.date().required(),
    lastChangedByMSPID: Joi.string().required()
});

export const WasteOrderCommissionSchema = Joi.object().keys({
    subcontractorMSPID: Joi.string().required(),
    customerName: Joi.string().required(),
    taskSite: TaskSiteSchema.required(),
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    unitOfMeasure: Joi.string().required(),
    taskDate: Joi.date().required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string(),
    referenceNo: Joi.string().required()
});

export const WasteOrderRecommissionSchema = Joi.object().keys({
    subcontractorMSPID: Joi.string().required(),
    customerName: Joi.string().required(),
    taskSite: TaskSiteSchema.required(),
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    unitOfMeasure: Joi.string().required(),
    taskDate: Joi.date().required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string()
});

export const WasteOrderCompleteSchema = Joi.object().keys({
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    unitOfMeasure: Joi.string().required(),
    taskDate: Joi.date().required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string()
});

export const WasteOrderRejectSchema = Joi.object().keys({
    rejectionMessage: Joi.string().required()
});
