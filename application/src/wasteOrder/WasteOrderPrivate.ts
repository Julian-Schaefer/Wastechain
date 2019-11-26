import { Service, ServiceSchema } from "./Service";
import { TaskSite, TaskSiteSchema } from "./TaskSite";
import { WasteOrder } from "./WasteOrder";
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

export interface WasteOrderPrivate {
    id: string;
    status: WasteOrderStatus;
    customerName: string;
    taskSite: TaskSite;
    service: Service;
    description: string;
    quantity: number;
    unitPrice: number;
    unitOfMeasure: string;
    taskDate: Date;
    startingTime: string;
    finishingTime: string;
    referenceNo: string;
    rejectionMessage: string;
    lastChanged: Date;
    lastChangedByMSPID: string;
}

export const WasteOrderPrivateSchema = Joi.object().keys({
    id: Joi.string().required(),
    status: Joi.number().required(),
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
    rejectionMessage: Joi.string(),
    lastChanged: Joi.date().required(),
    lastChangedByMSPID: Joi.string().required()
});

export const WasteOrderPrivateCommissionSchema = Joi.object().keys({
    id: Joi.string().required(),
    status: Joi.number().required(),
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
    lastChanged: Joi.date().required(),
    lastChangedByMSPID: Joi.string().required()
});

export const WasteOrderPrivateCorrectionSchema = Joi.object().keys({
    customerName: Joi.string().required(),
    taskSite: TaskSiteSchema.required(),
    service: ServiceSchema.required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    unitOfMeasure: Joi.string().required(),
    taskDate: JoiExtended.date().format('DD/MM/YYYY').required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string()
});

export const WasteOrderPrivateCompleteSchema = Joi.object().keys({
    quantity: Joi.number().required(),
    taskDate: JoiExtended.date().format('DD/MM/YYYY').required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string()
});

export const WasteOrderPrivateRejectSchema = Joi.object().keys({
    rejectionMessage: Joi.string().required()
});

export function getWasteOrderPrivateFromWasteOrder(wasteOrder: WasteOrder): WasteOrderPrivate {
    return {
        id: wasteOrder.id,
        status: wasteOrder.status,
        customerName: wasteOrder.customerName,
        taskSite: wasteOrder.taskSite,
        service: wasteOrder.service,
        description: wasteOrder.description,
        quantity: wasteOrder.quantity,
        unitPrice: wasteOrder.unitPrice,
        unitOfMeasure: wasteOrder.unitOfMeasure,
        taskDate: wasteOrder.taskDate,
        startingTime: wasteOrder.startingTime,
        finishingTime: wasteOrder.finishingTime,
        referenceNo: wasteOrder.referenceNo,
        rejectionMessage: wasteOrder.rejectionMessage,
        lastChanged: wasteOrder.lastChanged,
        lastChangedByMSPID: wasteOrder.lastChangedByMSPID
    }
}