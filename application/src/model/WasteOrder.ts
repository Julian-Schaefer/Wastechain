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
    startTime: string;
    endTime: string;
    referenceNo: string;
    weighbridgeTicketNo: string;
    lastChanged: Date;
    lastChangedByMSPID: string;
}

export const WasteOrderSchema = Joi.object().keys({
    key: ServiceSchema.required(),
    status: Joi.required(),
    subcontractorMSPID: Joi.string().required(),
    originatorMSPID: Joi.string().required(),
    customerName: Joi.string().required(),
    taskSite: TaskSiteSchema.required(),
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    taskDate: Joi.date().required(),
    referenceNo: Joi.string().required()
});

export const WasteOrderCreateSchema = Joi.object().keys({
    subcontractorMSPID: Joi.string().required(),
    customerName: Joi.string().required(),
    taskSite: TaskSiteSchema.required(),
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    taskDate: Joi.date().required(),
    referenceNo: Joi.string().required()
});

export const WasteOrderUpdateSchema = Joi.object().keys({
    quantity: Joi.number(),
    unitPrice: Joi.number()
}).min(1);

export const WasteOrderUpdateStatusSchema = Joi.object().keys({
    status: Joi.required()
});