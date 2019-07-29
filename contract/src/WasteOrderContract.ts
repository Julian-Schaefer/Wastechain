/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import * as Joi from '@hapi/joi';
import { WasteOrder, WasteOrderCreateSchema, WasteOrderUpdateSchema, WasteOrderStatus, WasteOrderUpdateStatusSchema } from './model/WasteOrder';

@Info({ title: 'WasteOrderContract', description: 'Contract to exchange Waste Orders' })
export class WasteOrderContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async checkWasteOrderExists(ctx: Context, orderId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createWasteOrder(ctx: Context, orderId: string, wasteOrderValue: string): Promise<WasteOrder> {
        let wasteOrder: WasteOrder = JSON.parse(wasteOrderValue);

        let validationResult = Joi.validate(wasteOrder, WasteOrderCreateSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Schema: " + validationResult.error.message;
        }

        wasteOrder.key = ctx.clientIdentity.getMSPID() + '-' + orderId;
        const exists = await this.checkWasteOrderExists(ctx, wasteOrder.key);
        if (exists) {
            throw new Error(`The order ${wasteOrder.key} already exists`);
        }

        if (wasteOrder.subcontractorMSPID === ctx.clientIdentity.getMSPID()) {
            throw new Error('It is not possible to commision a Waste Order to yourself.');
        }

        wasteOrder.status = WasteOrderStatus.COMMISSIONED;
        wasteOrder.originatorMSPID = ctx.clientIdentity.getMSPID();
        wasteOrder.lastChanged = new Date();
        wasteOrder.lastChangedByMSPID = ctx.clientIdentity.getMSPID();

        const buffer = Buffer.from(JSON.stringify(wasteOrder));
        await ctx.stub.putState(wasteOrder.key, buffer);
        ctx.stub.setEvent("CREATE_ORDER", buffer);

        return wasteOrder;
    }

    @Transaction(false)
    public async getWasteOrderHistory(ctx: Context, orderId: string): Promise<{ txId: string, timestamp: string, isDelete: string, value: string }[]> {
        const exists = await this.checkWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        let iterator = await ctx.stub.getHistoryForKey(orderId);
        let transactionHistory: { txId: string, timestamp: string, isDelete: string, value: string }[] = [];

        while (true) {
            let result = await iterator.next();

            if (result.value && result.value.value.toString()) {
                console.log(result.value.value.toString('utf8'));

                let value: string;
                try {
                    value = JSON.parse(result.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    value = result.value.value.toString('utf8');
                }

                let date = new Date(0);
                date.setSeconds(result.value.timestamp.getSeconds(), result.value.timestamp.getNanos() / 1000000);

                let transaction: { txId: string, timestamp: string, isDelete: string, value: string } = {
                    txId: result.value.tx_id,
                    timestamp: date.toString(),
                    isDelete: result.value.is_delete.toString(),
                    value
                };

                transactionHistory.push(transaction);
            }

            if (result.done) {
                await iterator.close();
                console.info(transactionHistory);
                return transactionHistory;
            }
        }

    }

    @Transaction(false)
    public async getCommissionedWasteOrdersForMSP(ctx: Context, MSPID: string): Promise<WasteOrder[]> {
        let query = {
            selector: {
                subcontractorMSPID: MSPID,
                status: WasteOrderStatus.COMMISSIONED
            }
        };

        let iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        let wasteOrders: WasteOrder[] = [];

        while (true) {
            let result = await iterator.next();

            if (result.value && result.value.value.toString()) {
                let wasteOrder: WasteOrder;

                try {
                    wasteOrder = JSON.parse(result.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    //wasteOrder = result.value.value.toString('utf8');
                }

                wasteOrders.push(wasteOrder);
            }

            if (result.done) {
                await iterator.close();
                return wasteOrders;
            }
        }
    }

    @Transaction(false)
    @Returns('Order')
    public async getWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
        const exists = await this.checkWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const buffer = await ctx.stub.getState(orderId);
        const wasteOrder = JSON.parse(buffer.toString()) as WasteOrder;
        return wasteOrder;
    }

    @Transaction()
    public async updateWasteOrder(ctx: Context, orderId: string, wasteOrderValue: string): Promise<void> {
        const exists = await this.checkWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        let wasteOrder: WasteOrder = JSON.parse(wasteOrderValue);

        let validationResult = Joi.validate(wasteOrder, WasteOrderUpdateSchema);
        if (validationResult.error !== null) {
            throw 'Invalid Waste Order Update Schema: ' + validationResult.error.message;
        }

        let oldWasteOrder = await this.getWasteOrder(ctx, orderId);
        if (ctx.clientIdentity.getMSPID() === oldWasteOrder.originatorMSPID && oldWasteOrder.status !== WasteOrderStatus.COMMISSIONED) {
            throw new Error('Only Waste Orders with the Status "Commissioned" can be changed by the Originator.');
        }

        if (ctx.clientIdentity.getMSPID() === oldWasteOrder.subcontractorMSPID && oldWasteOrder.status !== WasteOrderStatus.ACCEPTED) {
            throw new Error('Only Waste Orders with the Status "Accepted" can be changed by the Subcontractor.');
        }

        // Change old Waste Order Values
        if (wasteOrder.quantity !== undefined) {
            oldWasteOrder.quantity = wasteOrder.quantity;
        }

        if (wasteOrder.unitPrice !== undefined) {
            oldWasteOrder.unitPrice = wasteOrder.unitPrice;
        }

        if (wasteOrder.subcontractorMSPID !== undefined) {
            oldWasteOrder.subcontractorMSPID = wasteOrder.subcontractorMSPID;
        }

        oldWasteOrder.lastChanged = new Date();
        oldWasteOrder.lastChangedByMSPID = ctx.clientIdentity.getMSPID();

        const buffer = Buffer.from(JSON.stringify(oldWasteOrder));
        await ctx.stub.putState(orderId, buffer);
    }

    @Transaction()
    public async deleteWasteOrder(ctx: Context, orderId: string): Promise<void> {
        const exists = await this.checkWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist.`);
        }
        await ctx.stub.deleteState(orderId);
    }

    @Transaction()
    public async updateWasteOrderStatus(ctx: Context, orderId: string, wasteOrderUpdateStatusValue: string): Promise<void> {
        const exists = await this.checkWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        const validationResult = Joi.validate(wasteOrderUpdateStatusValue, WasteOrderUpdateStatusSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Status Update Schema!";
        }

        const wasteOrder: WasteOrder = await this.getWasteOrder(ctx, orderId);
        const status: WasteOrderStatus = JSON.parse(wasteOrderUpdateStatusValue).status;
        const MSPID = ctx.clientIdentity.getMSPID();

        switch (status) {
            case WasteOrderStatus.REJECTED:
                if (!(wasteOrder.status === WasteOrderStatus.COMMISSIONED && wasteOrder.subcontractorMSPID === MSPID)) {
                    throw new Error('The Waste Order can only be rejected by the Subcontractor and needs to have the Status "Commissioned".');
                }
                break;
            case WasteOrderStatus.ACCEPTED:
                if (!(wasteOrder.status === WasteOrderStatus.COMMISSIONED && wasteOrder.subcontractorMSPID === MSPID)) {
                    throw new Error('The Waste Order can only be accepted by the Subcontractor and needs to have the Status "Commissioned".');
                }
                break;
            case WasteOrderStatus.CANCELLED:
                if (wasteOrder.status === WasteOrderStatus.COMMISSIONED) {
                    if (!(wasteOrder.originatorMSPID === MSPID)) {
                        throw new Error('Waste Orders with Status "Commissioned" can only be cancelled by the Originator.');
                    }
                } else if (wasteOrder.status == WasteOrderStatus.ACCEPTED) {
                    if (!(wasteOrder.originatorMSPID === MSPID || wasteOrder.subcontractorMSPID === MSPID)) {
                        throw new Error('Waste Orders with Status "Accepted" can only be cancelled by the Subcontractor or the Originator.');
                    }
                } else {
                    throw new Error('Only Waste Orders with Status "Commissioned" or "Accepted" can be cancelled.');
                }
                break;
            case WasteOrderStatus.COMPLETED:
                if (!(wasteOrder.status === WasteOrderStatus.ACCEPTED && wasteOrder.subcontractorMSPID === MSPID)) {
                    throw new Error('The Waste Order can only be completed by the Subcontractor and needs to have the Status "Accepted".');
                }
                break;
            default:
                throw new Error('The specified status is not supported.');
        }

        wasteOrder.status = status;
        wasteOrder.lastChanged = new Date();
        wasteOrder.lastChangedByMSPID = ctx.clientIdentity.getMSPID();

        const buffer = Buffer.from(JSON.stringify(wasteOrder));
        await ctx.stub.putState(orderId, buffer);
    }
}
