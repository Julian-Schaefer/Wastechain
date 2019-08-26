import { WasteOrder, WasteOrderCommissionSchema, WasteOrderStatus, WasteOrderCorrectionSchema } from "./WasteOrder";
import { get, post, put } from "../HttpClient";

async function getWasteOrdersWithTypeAndStatus(type: string, status: number): Promise<WasteOrder[]> {
    let wasteOrders = await get('/order/' + type + '/status/' + status);
    console.log(wasteOrders);
    return wasteOrders as WasteOrder[];
}

async function commissionWasteOrder(wasteOrderId: string, wasteOrder: WasteOrderCommissionSchema): Promise<WasteOrder> {
    let commissionWasteOrder = await post('/order/' + wasteOrderId, wasteOrder);
    console.log(commissionWasteOrder);
    return commissionWasteOrder as WasteOrder;
}

async function correctWasteOrder(wasteOrderId: string, wasteOrder: WasteOrderCorrectionSchema) {
    let commissionWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.COMMISSIONED, ...wasteOrder });
    console.log(commissionWasteOrder);
    return commissionWasteOrder as WasteOrder;
}

async function cancelWasteOrder(wasteOrderId: string) {
    let commissionWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.CANCELLED });
    console.log(commissionWasteOrder);
    return commissionWasteOrder as WasteOrder;
}

async function acceptWasteOrder(wasteOrderId: string) {
    let commissionWasteOrder = await put('/order/' + wasteOrderId, { status: WasteOrderStatus.ACCEPTED });
    console.log(commissionWasteOrder);
    return commissionWasteOrder as WasteOrder;
}

export {
    getWasteOrdersWithTypeAndStatus,
    commissionWasteOrder,
    cancelWasteOrder,
    acceptWasteOrder
};