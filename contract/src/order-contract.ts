/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import * as Joi from '@hapi/joi';
import { WasteOrder, WasteOrderCreateSchema, WasteOrderUpdateSchema, WasteOrderStatus } from './model/WasteOrder';

@Info({ title: 'OrderContract', description: 'Contract to exchange Waste Orders' })
export class OrderContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async orderExists(ctx: Context, orderId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createOrder(ctx: Context, orderId: string, wasteOrderValue: string): Promise<WasteOrder> {
        let wasteOrder: WasteOrder = JSON.parse(wasteOrderValue);

        let validationResult = Joi.validate(wasteOrder, WasteOrderCreateSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Schema!";
        }

        wasteOrder.key = ctx.clientIdentity.getMSPID() + '-' + orderId;
        const exists = await this.orderExists(ctx, wasteOrder.key);
        if (exists) {
            throw new Error(`The order ${wasteOrder.key} already exists`);
        }

        wasteOrder.status = WasteOrderStatus.COMMISSIONED;
        wasteOrder.originatorMSPID = ctx.clientIdentity.getMSPID();

        const buffer = Buffer.from(JSON.stringify(wasteOrder));
        await ctx.stub.putState(wasteOrder.key, buffer);
        ctx.stub.setEvent("CREATE_ORDER", buffer);
        return wasteOrder;
    }

    @Transaction(false)
    public async getHistory(ctx: Context, key: string): Promise<{ txId: string, timestamp: string, isDelete: string, value: string }[]> {
        let iterator = await ctx.stub.getHistoryForKey(key);
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
                break;
            }
        }

        return transactionHistory;
    }

    @Transaction(false)
    @Returns('Order')
    public async readOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const buffer = await ctx.stub.getState(orderId);
        const wasteOrder = JSON.parse(buffer.toString()) as WasteOrder;
        return wasteOrder;
    }

    @Transaction()
    public async updateOrder(ctx: Context, orderId: string, wasteOrderValue: string): Promise<void> {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        let wasteOrder: WasteOrder = JSON.parse(wasteOrderValue);

        let validationResult = Joi.validate(wasteOrder, WasteOrderUpdateSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Update Schema!";
        }

        let oldWasteOrder = await this.readOrder(ctx, orderId);
        if (wasteOrder.quantity !== undefined) {
            oldWasteOrder.quantity = wasteOrder.quantity;
        }

        if (wasteOrder.unitPrice !== undefined) {
            oldWasteOrder.unitPrice = wasteOrder.unitPrice;
        }

        if (wasteOrder.contractorMSPID !== undefined) {
            oldWasteOrder.contractorMSPID = wasteOrder.contractorMSPID;
        }

        const buffer = Buffer.from(JSON.stringify(oldWasteOrder));
        await ctx.stub.putState(orderId, buffer);
        //ctx.stub.setEvent("CREATE_ORDER", buffer);
    }

    @Transaction()
    public async deleteOrder(ctx: Context, orderId: string): Promise<void> {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        await ctx.stub.deleteState(orderId);
    }

}
