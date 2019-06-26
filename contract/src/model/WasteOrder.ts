import { Service, ServiceSchema } from "./Service";
import { TaskSite, TaskSiteSchema } from "./TaskSite";
import * as Joi from '@hapi/joi';

export interface WasteOrder {
    service: Service;
    taskSite: TaskSite;
    description: string;
    quantity: number;
    unitPrice: number;
    originatorMSPID?: string;
    contractorMSPID: string;
}

export const WasteOrderSchema = Joi.object().keys({
    service: ServiceSchema,
    taskSite: TaskSiteSchema,
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    originatorMSPID: Joi.string(),
    contractorMSPID: Joi.string().required()
});