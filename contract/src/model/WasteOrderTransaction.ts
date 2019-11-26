import { WasteOrderPublic } from './WasteOrderPublic';
import { WasteOrder } from './WasteOrder';

export interface WasteOrderTransaction {
    txId: string;
    timestamp: string;
    isDelete: string;
    value: WasteOrder;
}