import * as Joi from '@hapi/joi';
import * as JoiDate from '@hapi/joi-date';
import { Service, ServiceSchema } from './Service';
import { TaskSite, TaskSiteSchema } from './TaskSite';

const JoiExtended: any = Joi.extend(JoiDate);

export interface WasteOrderPrivate {
    id: string;
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
    lastChangedByMSPID: Joi.string().required(),
});

export const WasteOrderPrivateCommissionSchema = Joi.object().keys({
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
});

export const WasteOrderPrivateCompleteSchema = Joi.object().keys({
    quantity: Joi.number().required(),
    taskDate: JoiExtended.date().format('DD/MM/YYYY').required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string(),
});

export const WasteOrderPrivateRejectSchema = Joi.object().keys({
    rejectionMessage: Joi.string().required(),
});

export function getWasteOrderPrivateFromString(wasteOrderPrivateValue: string): WasteOrderPrivate {
    const wasteOrderPrivate: WasteOrderPrivate = JSON.parse(wasteOrderPrivateValue);

    return {
        id: wasteOrderPrivate.id,
        customerName: wasteOrderPrivate.customerName,
        taskSite: wasteOrderPrivate.taskSite,
        service: wasteOrderPrivate.service,
        description: wasteOrderPrivate.description,
        quantity: wasteOrderPrivate.quantity,
        unitPrice: wasteOrderPrivate.unitPrice,
        unitOfMeasure: wasteOrderPrivate.unitOfMeasure,
        taskDate: wasteOrderPrivate.taskDate,
        startingTime: wasteOrderPrivate.startingTime,
        finishingTime: wasteOrderPrivate.finishingTime,
        referenceNo: wasteOrderPrivate.referenceNo,
        rejectionMessage: wasteOrderPrivate.rejectionMessage,
        lastChanged: wasteOrderPrivate.lastChanged,
        lastChangedByMSPID: wasteOrderPrivate.lastChangedByMSPID,
    };
}
