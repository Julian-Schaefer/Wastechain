import { Service, ServiceSchema } from "./Service";
import { TaskSite, TaskSiteSchema } from "./TaskSite";
import * as Joi from '@hapi/joi';
import * as JoiDate from '@hapi/joi-date';

const JoiExtended: any = Joi.extend(JoiDate);

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
    weighbridgeTicketNo: string;
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
    taskDate: JoiExtended.date().format('DD/MM/YYYY').required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string(),
    referenceNo: Joi.string().required(),
    weighbridgeTicketNo: Joi.string(),
    lastChanged: Joi.date().required(),
    lastChangedByMSPID: Joi.string().required()
});

export const WasteOrderCreateSchema = Joi.object().keys({
    subcontractorMSPID: Joi.string().required(),
    customerName: Joi.string().required(),
    taskSite: TaskSiteSchema.required(),
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    unitOfMeasure: Joi.string().required(),
    taskDate: JoiExtended.date().format('DD/MM/YYYY').required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string(),
    referenceNo: Joi.string().required(),
    weighbridgeTicketNo: Joi.string()
});

export const WasteOrderUpdateSchema = Joi.object().keys({
    quantity: Joi.number(),
    unitPrice: Joi.number()
}).min(1);

export const WasteOrderUpdateStatusSchema = Joi.object().keys({
    status: Joi.number().required()
});