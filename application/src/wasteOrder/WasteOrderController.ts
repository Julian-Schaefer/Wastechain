import { Request, Response } from 'express';
import * as service from './WasteOrderService';
import { WasteOrder, WasteOrderCommissionSchema, WasteOrderStatus, WasteOrderCorrectionSchema, WasteOrderUpdateStatusSchema, WasteOrderRejectSchema, WasteOrderCompleteSchema } from './WasteOrder';
import { getWasteOrderPrivateFromWasteOrder } from './WasteOrderPrivate';
import { getWasteOrderPublicFromWasteOrder } from './WasteOrderPublic';
import { WasteOrderTransaction } from './WasteOrderTransaction';
import * as Joi from '@hapi/joi';

async function getWasteOrder(request: Request, response: Response) {
    const wasteOrderId = request.params.id;

    try {
        const wasteOrder: WasteOrder = await service.getWasteOrder(wasteOrderId);
        response.send(JSON.stringify(wasteOrder));
    } catch (error) {
        console.log('Error evaluating Transaction: ' + error);
        response.status(500).send('Error evaluating Transaction: ' + error);
    }
}

async function getWasteOrderHistory(request: Request, response: Response) {
    const wasteOrderId = request.params.id;

    try {
        let history: WasteOrderTransaction[] = await service.getWasteOrderHistory(wasteOrderId)
        response.send(JSON.stringify(history));
    } catch (error) {
        console.log('Error getting Transaction History: ' + error);
        response.status(500).send('Error getting Transaction History: ' + error);
    }
}

async function commissionWasteOrder(request: Request, response: Response) {
    const wasteOrderId = request.params.id;
    const wasteOrder: WasteOrder = request.body;

    try {
        const validationResult = Joi.validate(wasteOrder, WasteOrderCommissionSchema);
        if (validationResult.error !== null) {
            throw validationResult.error;
        }

        const wasteOrderPrivate = getWasteOrderPrivateFromWasteOrder(wasteOrder);
        const wasteOrderPublic = getWasteOrderPublicFromWasteOrder(wasteOrder);

        const createdWasteOrder: WasteOrder = await service.commissionWasteOrder(wasteOrderId, wasteOrderPublic, wasteOrderPrivate);
        response.send(JSON.stringify(createdWasteOrder));
    } catch (error) {
        console.log('Error submitting Transaction: ' + error);
        response.status(500).send('Error submitting Transaction: ' + error);
    }
}

async function updateWasteOrder(request: Request, response: Response) {
    const wasteOrderId = request.params.id;
    const updatedWasteOrder: WasteOrder = request.body;

    try {
        let validationSchema: Joi.ObjectSchema;
        let procedure: string;
        let sendBody = false;

        switch (updatedWasteOrder.status) {
            case WasteOrderStatus.COMMISSIONED:
                validationSchema = WasteOrderCorrectionSchema;
                procedure = 'correctWasteOrder';
                sendBody = true;
                break;

            case WasteOrderStatus.ACCEPTED:
                validationSchema = WasteOrderUpdateStatusSchema;
                procedure = 'acceptWasteOrder';
                break;

            case WasteOrderStatus.REJECTED:
                validationSchema = WasteOrderRejectSchema;
                procedure = 'rejectWasteOrder';
                sendBody = true;
                break;

            case WasteOrderStatus.CANCELLED:
                validationSchema = WasteOrderUpdateStatusSchema;
                procedure = 'cancelWasteOrder';
                break;

            case WasteOrderStatus.COMPLETED:
                validationSchema = WasteOrderCompleteSchema;
                procedure = 'completeWasteOrder';
                sendBody = true;
                break;

            default:
                console.log('Error: Unknown Status "' + status + '"');
                throw ('Error: Unknown Status "' + status + '"');
        }

        let validationResult = Joi.validate(updatedWasteOrder, validationSchema);
        if (validationResult.error !== null) {
            throw validationResult.error;
        }

        const wasteOrderPrivate = getWasteOrderPrivateFromWasteOrder(updatedWasteOrder);
        let submittedWasteOrder = await service.updateWasteOrder(wasteOrderId, procedure, wasteOrderPrivate);
        response.send(JSON.stringify(submittedWasteOrder));
    } catch (error) {
        console.log('Error evaluating Transaction: ' + error);
        response.status(500).send('Error evaluating Transaction: ' + error);
    }
}

async function getWasteOrdersForSubcontractorWithStatus(request: Request, response: Response) {
    const status = request.params.status;

    try {
        let wasteOrdersBuffer = await service.getWasteOrdersForSubcontractorWithStatus(status);
        response.send(wasteOrdersBuffer.toString('utf-8'));
    } catch (error) {
        console.log('Error evaluating Transaction: ' + error);
        response.status(500).send('Error evaluating Transaction: ' + error);
    }
}

async function getWasteOrdersForOriginatorWithStatus(request: Request, response: Response) {
    const status = request.params.status;

    try {
        let wasteOrdersBuffer = await service.getWasteOrdersForOriginatorWithStatus(status);
        response.send(wasteOrdersBuffer.toString('utf-8'));
    } catch (error) {
        console.log('Error evaluating Transaction: ' + error);
        response.status(500).send('Error evaluating Transaction: ' + error);
    }
}

export {
    getWasteOrder,
    getWasteOrderHistory,
    commissionWasteOrder,
    updateWasteOrder,
    getWasteOrdersForSubcontractorWithStatus,
    getWasteOrdersForOriginatorWithStatus
};