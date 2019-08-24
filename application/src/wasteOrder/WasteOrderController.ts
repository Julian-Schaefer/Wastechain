import { Request, Response } from 'express';
import * as service from './WasteOrderService';
import { WasteOrder } from './WasteOrder';
import { WasteOrderTransaction } from './WasteOrderTransaction';

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
    const wasteOrder = request.body;

    try {
        const createdWasteOrder: WasteOrder = await service.commissionWasteOrder(wasteOrderId, wasteOrder);
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
        let submittedWasteOrder = await service.updateWasteOrder(wasteOrderId, updatedWasteOrder);
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