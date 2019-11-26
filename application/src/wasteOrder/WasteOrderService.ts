import * as Joi from '@hapi/joi';
import { getFabricConnection } from "../FabricConnection";
import { WasteOrderCommissionSchema, WasteOrderCorrectionSchema, WasteOrderRejectSchema, WasteOrderCompleteSchema, WasteOrder, WasteOrderStatus, WasteOrderUpdateStatusSchema } from './WasteOrder';
import { WasteOrderTransaction } from './WasteOrderTransaction';
import { TransientMap } from 'fabric-network';
import { WasteOrderPublic } from './WasteOrderPublic';
import { WasteOrderPrivate } from './WasteOrderPrivate';

async function getWasteOrder(wasteOrderId: string): Promise<WasteOrder> {
    const contract = getFabricConnection().wasteOrderContract;
    const wasteOrderBuffer = await contract.evaluateTransaction('getWasteOrder', wasteOrderId);
    const wasteOrder: WasteOrder = JSON.parse(wasteOrderBuffer.toString('utf-8'));
    return wasteOrder;
}

async function getWasteOrderHistory(wasteOrderId: string): Promise<WasteOrderTransaction[]> {
    let contract = await getFabricConnection().wasteOrderContract;
    let result = await contract.evaluateTransaction('getWasteOrderHistory', wasteOrderId);

    let history: WasteOrderTransaction[] = JSON.parse(result.toString('utf-8'));
    return history;
}

async function commissionWasteOrder(wasteOrderId: string, wasteOrderPublic: WasteOrderPublic, wasteOrderPrivate: WasteOrderPrivate): Promise<WasteOrder> {
    delete (wasteOrderPublic.id);
    delete (wasteOrderPublic.originatorMSPID);

    delete (wasteOrderPrivate.id);
    delete (wasteOrderPrivate.status);
    delete (wasteOrderPrivate.rejectionMessage);

    const contract = getFabricConnection().wasteOrderContract;

    let transaction = contract.createTransaction("commissionWasteOrder");
    const transientData: TransientMap = {
        order: Buffer.from(JSON.stringify(wasteOrderPrivate))
    };
    transaction.setTransient(transientData);
    const commissionedWasteOrderBuffer = await transaction.submit(wasteOrderId, JSON.stringify(wasteOrderPublic));
    console.log("Log: " + commissionedWasteOrderBuffer.toString('utf-8'));
    const commissionedWasteOrder: WasteOrder = JSON.parse(commissionedWasteOrderBuffer.toString('utf-8'));

    console.log('Commissioned Waste Order with ID: ' + commissionedWasteOrder.id);
    return commissionedWasteOrder;
}

async function updateWasteOrder(wasteOrderId: string, updatedWasteOrder: WasteOrder): Promise<WasteOrder> {
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

    delete updatedWasteOrder.status;

    const contract = await getFabricConnection().wasteOrderContract;
    let submittedWasteOrderBuffer: Buffer;
    if (sendBody) {
        submittedWasteOrderBuffer = await contract.submitTransaction(procedure, wasteOrderId, JSON.stringify(updatedWasteOrder));
    } else {
        submittedWasteOrderBuffer = await contract.submitTransaction(procedure, wasteOrderId);
    }

    let submittedWasteOrder: WasteOrder = JSON.parse(submittedWasteOrderBuffer.toString('utf-8'));
    console.log('Updated Contract with ID: ' + wasteOrderId);
    return submittedWasteOrder;
}

async function getWasteOrdersForSubcontractorWithStatus(status: string): Promise<Buffer> {
    let MSPID = getFabricConnection().client.getMspid();
    let contract = await getFabricConnection().wasteOrderContract;
    let wasteOrdersBuffer = await contract.evaluateTransaction('getWasteOrdersForSubcontractorWithStatus', MSPID, status);

    console.log('Retrieved Waste Orders with status ' + status + ' for Subcontractor: ' + MSPID);
    return wasteOrdersBuffer;
}

async function getWasteOrdersForOriginatorWithStatus(status: string): Promise<Buffer> {
    let MSPID = getFabricConnection().client.getMspid();
    let contract = await getFabricConnection().wasteOrderContract;
    let wasteOrdersBuffer = await contract.evaluateTransaction('getWasteOrdersForOriginatorWithStatus', MSPID, status);

    console.log('Retrieved Waste Orders with status ' + status + ' for Originator: ' + MSPID);
    return wasteOrdersBuffer;
}

export {
    getWasteOrder,
    getWasteOrderHistory,
    commissionWasteOrder,
    updateWasteOrder,
    getWasteOrdersForSubcontractorWithStatus,
    getWasteOrdersForOriginatorWithStatus
};