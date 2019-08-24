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
    id: string;
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

/**
 *  @swagger
 *  definitions:
 *      WasteOrderSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *              status:
 *                  type: integer
 *              subcontractorMSPID:
 *                  type: string
 *              originatorMSPID:
 *                  type: string
 *              customerName:
 *                  type: string
 *              taskSite:
 *                  type: object
 *                  $ref: '#/definitions/TaskSiteSchema'
 *              service:
 *                  type: object
 *                  $ref: '#/definitions/ServiceSchema'
 *              description:
 *                  type: string
 *              quantity:
 *                  type: number
 *              unitPrice:
 *                  type: number
 *              unitOfMeasure:
 *                  type: string
 *              taskDate:
 *                  type: string
 *              startingTime:
 *                  type: string
 *              finishingTime:
 *                  type: string
 *              referenceNo:
 *                  type: string
 *              rejectionMessage:
 *                  type: string
 *              lastChanged:
 *                  type: string
 *              lastChangedByMSPID:
 *                  type: string
 */
export const WasteOrderSchema = Joi.object().keys({
    id: ServiceSchema.required(),
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
    rejectionMessage: Joi.string(),
    lastChanged: Joi.date().required(),
    lastChangedByMSPID: Joi.string().required()
});


/**
 *  @swagger
 *  definitions:
 *      WasteOrderCommissionSchema:
 *          type: object
 *          properties:
 *              subcontractorMSPID:
 *                  type: string
 *              customerName:
 *                  type: string
 *              taskSite:
 *                  type: object
 *                  $ref: '#/definitions/TaskSiteSchema'
 *              service:
 *                  type: object
 *                  $ref: '#/definitions/ServiceSchema'
 *              description:
 *                  type: string
 *              quantity:
 *                  type: number
 *              unitPrice:
 *                  type: number
 *              unitOfMeasure:
 *                  type: string
 *              taskDate:
 *                  type: string
 *              startingTime:
 *                  type: string
 *              finishingTime:
 *                  type: string
 *              referenceNo:
 *                  type: string
 */

export const WasteOrderCommissionSchema = Joi.object().keys({
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
    referenceNo: Joi.string().required()
});

/**
 *  @swagger
 *  definitions:
 *      WasteOrderCorrectionSchema:
 *          type: object
 *          properties:
 *              status:
 *                  type: integer
 *              subcontractorMSPID:
 *                  type: string
 *              customerName:
 *                  type: string
 *              taskSite:
 *                  type: object
 *                  $ref: '#/definitions/TaskSiteSchema'
 *              service:
 *                  type: object
 *                  $ref: '#/definitions/ServiceSchema'
 *              description:
 *                  type: string
 *              quantity:
 *                  type: number
 *              unitPrice:
 *                  type: number
 *              unitOfMeasure:
 *                  type: string
 *              taskDate:
 *                  type: string
 *              startingTime:
 *                  type: string
 *              finishingTime:
 *                  type: string
 */
export const WasteOrderCorrectionSchema = Joi.object().keys({
    status: Joi.number().required(),
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
    finishingTime: Joi.string()
});

/**
 *  @swagger
 *  definitions:
 *      WasteOrderCompleteSchema:
 *          type: object
 *          properties:
 *              status:
 *                  type: integer
 *              quantity:
 *                  type: number
 *              taskDate:
 *                  type: string
 *              startingTime:
 *                  type: string
 *              finishingTime:
 *                  type: string
 */
export const WasteOrderCompleteSchema = Joi.object().keys({
    status: Joi.number().required(),
    quantity: Joi.number().required(),
    taskDate: JoiExtended.date().format('DD/MM/YYYY').required(),
    startingTime: Joi.string(),
    finishingTime: Joi.string()
});

/**
 *  @swagger
 *  definitions:
 *      WasteOrderRejectSchema:
 *          type: object
 *          properties:
 *              status:
 *                  type: integer
 *              rejectionMessage:
 *                  type: string
 */
export const WasteOrderRejectSchema = Joi.object().keys({
    status: Joi.number().required(),
    rejectionMessage: Joi.string().required()
});

/**
 *  @swagger
 *  definitions:
 *      WasteOrderUpdateStatusSchema:
 *          type: object
 *          properties:
 *              status:
 *                  type: integer
 */
export const WasteOrderUpdateStatusSchema = Joi.object().keys({
    status: Joi.number().required()
});
