import * as Joi from '@hapi/joi';
import { getFabricConnection } from "../FabricConnection";
import { WasteOrderCommissionSchema, WasteOrderRecommissionSchema, WasteOrderRejectSchema, WasteOrderCompleteSchema, WasteOrder, WasteOrderStatus, WasteOrderUpdateStatusSchema } from './WasteOrder';
import { WasteOrderTransaction } from './WasteOrderTransaction';

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

async function createWasteOrder(wasteOrderId: string, wasteOrder: WasteOrder): Promise<WasteOrder> {
    const validationResult = Joi.validate(wasteOrder, WasteOrderCommissionSchema);
    if (validationResult.error !== null) {
        throw validationResult.error;
    }

    const contract = getFabricConnection().wasteOrderContract;
    const createdWasteOrderBuffer = await contract.submitTransaction('commissionWasteOrder', wasteOrderId, JSON.stringify(wasteOrder));
    const createdWasteOrder: WasteOrder = JSON.parse(createdWasteOrderBuffer.toString('utf-8'));

    console.log('Submitted Waste Order with ID: ' + createdWasteOrder.id);
    return createdWasteOrder;
}

async function updateWasteOrder(wasteOrderId: string, updatedWasteOrder: WasteOrder): Promise<void> {
    let validationSchema: Joi.ObjectSchema;
    let procedure: string;
    let sendBody = false;

    switch (updatedWasteOrder.status) {
        case WasteOrderStatus.COMMISSIONED:
            validationSchema = WasteOrderRecommissionSchema;
            procedure = 'recommissionWasteOrder';
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
    if (sendBody) {
        await contract.submitTransaction(procedure, wasteOrderId, JSON.stringify(updatedWasteOrder));
    } else {
        await contract.submitTransaction(procedure, wasteOrderId);
    }

    console.log('Updated Contract with ID: ' + wasteOrderId);
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
    createWasteOrder,
    updateWasteOrder,
    getWasteOrdersForSubcontractorWithStatus,
    getWasteOrdersForOriginatorWithStatus
};