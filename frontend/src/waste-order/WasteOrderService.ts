import { WasteOrder, WasteOrderCommissionSchema, WasteOrderStatus, WasteOrderCorrectionSchema } from "./WasteOrder";
import { get, post, put } from "../HttpClient";
import { WasteOrderFilterType } from "./components/WasteOrderFilterComponent";

async function getWasteOrdersWithTypeAndStatus(type: WasteOrderFilterType, status: number): Promise<WasteOrder[]> {
    let typeString = type === WasteOrderFilterType.INCOMING ? "incoming" : "outgoing";

    let wasteOrders = await get('/order/' + typeString + '/status/' + status);
    console.log(wasteOrders);
    return wasteOrders as WasteOrder[];
}

async function commissionWasteOrder(wasteOrderId: string, wasteOrder: WasteOrderCommissionSchema): Promise<WasteOrder> {
    let commissionWasteOrder = await post('/order/' + wasteOrderId, wasteOrder);
    console.log(commissionWasteOrder);
    return commissionWasteOrder as WasteOrder;
}

async function correctWasteOrder(wasteOrderId: string, wasteOrder: WasteOrderCorrectionSchema): Promise<WasteOrder> {
    let updatedWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.COMMISSIONED, ...wasteOrder });
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
    let updatedWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.ACCEPTED, rejectionMessage });
    console.log(updatedWasteOrder);
    return updatedWasteOrder as WasteOrder;
}

export {
    getWasteOrdersWithTypeAndStatus,
    commissionWasteOrder,
    cancelWasteOrder,
    acceptWasteOrder
};