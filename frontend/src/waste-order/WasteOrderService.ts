import { WasteOrder, WasteOrderCommissionSchema, WasteOrderStatus, WasteOrderCorrectionSchema, WasteOrderCompleteSchema } from "./WasteOrder";
import { WasteOrderTransaction } from "./WasteOrderTransaction";
import { get, post, put } from "../HttpClient";
import { WasteOrderFilterType } from "./components/WasteOrderFilterComponent";

async function getWasteOrdersWithTypeAndStatus(type: WasteOrderFilterType, status: number): Promise<WasteOrder[]> {
    let typeString = type === WasteOrderFilterType.INCOMING ? "incoming" : "outgoing";

    let wasteOrders = await get('/order/' + typeString + '/status/' + status);
    console.log(wasteOrders);
    return wasteOrders as WasteOrder[];
}

async function getWasteOrderHistory(wasteOrder: WasteOrder): Promise<WasteOrderTransaction[]> {
    let wasteOrderTransactions = await get('/order/' + wasteOrder.id + '/history');
    console.log(wasteOrderTransactions);
    return wasteOrderTransactions as WasteOrderTransaction[];
}

async function commissionWasteOrder(wasteOrderId: string, wasteOrder: WasteOrderCommissionSchema): Promise<WasteOrder> {
    let commissionWasteOrder = await post('/order/' + wasteOrderId, wasteOrder);
    console.log(commissionWasteOrder);
    return commissionWasteOrder as WasteOrder;
}

async function correctWasteOrder(wasteOrderId: string, wasteOrder: WasteOrder): Promise<WasteOrder> {
    let correctedWasteOrder: WasteOrderCorrectionSchema = {
        customerName: wasteOrder.customerName,
        subcontractorMSPID: wasteOrder.subcontractorMSPID,
        description: wasteOrder.description,
        taskSite: wasteOrder.taskSite,
        service: wasteOrder.service,
        quantity: wasteOrder.quantity,
        unitPrice: wasteOrder.unitPrice,
        unitOfMeasure: wasteOrder.unitOfMeasure,
        taskDate: wasteOrder.taskDate,
        startingTime: wasteOrder.startingTime,
        finishingTime: wasteOrder.finishingTime
    }

    let updatedWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.COMMISSIONED, ...correctedWasteOrder });
    console.log(updatedWasteOrder);
    return updatedWasteOrder as WasteOrder;
}

async function cancelWasteOrder(wasteOrderId: string): Promise<WasteOrder> {
    let updatedWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.CANCELLED });
    console.log(updatedWasteOrder);
    return updatedWasteOrder as WasteOrder;
}

async function acceptWasteOrder(wasteOrderId: string): Promise<WasteOrder> {
    let updatedWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.ACCEPTED });
    console.log(updatedWasteOrder);
    return updatedWasteOrder as WasteOrder;
}

async function rejectWasteOrder(wasteOrderId: string, rejectionMessage: string): Promise<WasteOrder> {
    let updatedWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.REJECTED, rejectionMessage });
    console.log(updatedWasteOrder);
    return updatedWasteOrder as WasteOrder;
}

async function completeWasteOrder(wasteOrderId: string, wasteOrder: WasteOrder): Promise<WasteOrder> {
    let correctedWasteOrder: WasteOrderCompleteSchema = {
        quantity: wasteOrder.quantity,
        taskDate: wasteOrder.taskDate,
        startingTime: wasteOrder.startingTime,
        finishingTime: wasteOrder.finishingTime
    }

    let updatedWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.COMPLETED, ...correctedWasteOrder });
    console.log(updatedWasteOrder);
    return updatedWasteOrder as WasteOrder;
}

export {
    getWasteOrdersWithTypeAndStatus,
    getWasteOrderHistory,
    commissionWasteOrder,
    cancelWasteOrder,
    correctWasteOrder,
    acceptWasteOrder,
    rejectWasteOrder,
    completeWasteOrder
};