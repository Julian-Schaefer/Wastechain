import { Service, ServiceSchema } from "./Service";
import { TaskSite, TaskSiteSchema } from "./TaskSite";
import * as Joi from '@hapi/joi';
import { startTimer } from "winston";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

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
    startTime: Timestamp;
    endTime: Timestamp;
    referenceNo: string;
    weighbridgeTicketNo: string;
    lastChanged: Date;
    lastChangedByMSPID: string;
}

export const WasteOrderSchema = Joi.object().keys({
    key: ServiceSchema.required(),
    status: Joi.required(),
    service: ServiceSchema.required(),
    taskSite: TaskSiteSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    originatorMSPID: Joi.string().required(),
    contractorMSPID: Joi.string().required()
});

export const WasteOrderCreateSchema = Joi.object().keys({
    service: ServiceSchema.required(),
    taskSite: TaskSiteSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    contractorMSPID: Joi.string().required()
});

export const WasteOrderUpdateSchema = Joi.object().keys({
    quantity: Joi.number(),
    unitPrice: Joi.number(),
    contractorMSPID: Joi.string()
}).min(1);

export const WasteOrderUpdateStatusSchema = Joi.object().keys({
    status: Joi.required()
});