import { WasteOrder } from "./WasteOrder";
import { get, post } from "../HttpClient";

async function getOutgoingWasteOrdersWithStatus(status: number): Promise<WasteOrder[]> {
    try {
        let wasteOrders = await get('/order/outgoing/status/' + status);
        console.log(wasteOrders);
        return wasteOrders as WasteOrder[];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function commissionWasteOrder(wasteOrder: WasteOrder): Promise<WasteOrder> {
    try {
        let commissionWasteOrder = await post('/order/' + wasteOrder.id, wasteOrder);
        console.log(commissionWasteOrder);
        return commissionWasteOrder as WasteOrder;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {
    getOutgoingWasteOrdersWithStatus,
    commissionWasteOrder
};