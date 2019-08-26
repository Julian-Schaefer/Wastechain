import { WasteOrder } from "./WasteOrder";
import { get, post } from "../HttpClient";

async function getWasteOrdersWithTypeAndStatus(type: string, status: number): Promise<WasteOrder[]> {
    try {
        let wasteOrders = await get('/order/' + type + '/status/' + status);
        console.log(wasteOrders);
        return wasteOrders as WasteOrder[];
    } catch (error) {
        throw error;
    }
}

async function commissionWasteOrder(wasteOrderId: string, wasteOrder: WasteOrder): Promise<WasteOrder> {
    try {
        let commissionWasteOrder = await post('/order/' + wasteOrderId, wasteOrder);
        console.log(commissionWasteOrder);
        return commissionWasteOrder as WasteOrder;
    } catch (error) {
        throw error;
    }
}

export {
    getWasteOrdersWithTypeAndStatus,
    commissionWasteOrder
};