import { WasteOrderPublic } from './WasteOrderPublic';

export interface WasteOrderTransaction {
    txId: string;
    timestamp: string;
    isDelete: string;
    value: WasteOrderPublic;
}