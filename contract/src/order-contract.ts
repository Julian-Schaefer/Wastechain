/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import * as Joi from '@hapi/joi';
import { WasteOrder, WasteOrderSchema, WasteOrderUpdateSchema } from './model/WasteOrder';

@Info({ title: 'OrderContract', description: 'Contract to exchange Waste Orders' })
export class OrderContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async orderExists(ctx: Context, orderId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createOrder(ctx: Context, orderId: string, wasteOrderValue: string): Promise<void> {
        let wasteOrder: WasteOrder = JSON.parse(wasteOrderValue);

        let validationResult = Joi.validate(wasteOrder, WasteOrderSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Schema!";
        }

        orderId = ctx.clientIdentity.getMSPID() + '-' + orderId;
        const exists = await this.orderExists(ctx, orderId);
        if (exists) {
            throw new Error(`The order ${orderId} already exists`);
        }

        wasteOrder.originatorMSPID = ctx.clientIdentity.getMSPID();

        const buffer = Buffer.from(JSON.stringify(wasteOrder));
        await ctx.stub.putState(orderId, buffer);
        ctx.stub.setEvent("CREATE_ORDER", buffer);
    }

    @Transaction(false)
    public async getHistory2(ctx: Context, key: string): Promise<any> {

        let iterator = await ctx.stub.getHistoryForKey(key);
        let isHistory = true;

        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes: any = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.is_delete.toString();
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    // jsonRes.Key = res.value.key;
                    // try {
                    //     jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    // } catch (err) {
                    //     console.log(err);
                    //     jsonRes.Record = res.value.value.toString('utf8');
                    // }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                break;
            }
        }

        return JSON.stringify(allResults);
    }
    @Transaction(false)
    public async getHistory(ctx: Context, key: string): Promise<{ key: string, timestamp: string, value: string }[]> {
        let iterator = await ctx.stub.getHistoryForKey(key);
        let allResults: { key: string, timestamp: string, value: string }[] = [];

        while (true) {
            let result = await iterator.next();
            if (result.value === undefined) {
                throw 'No History for Key: ' + key;
            }

            let transactionContent = String.fromCharCode.apply(null, new Uint16Array(result.value.value.buffer)) as string;
            let start = transactionContent.indexOf('{');
            let wasteOrderValue = transactionContent.substr(start, transactionContent.lastIndexOf('}') - start + 1) + '?!---END---!?';

            var date = new Date(0);
            date.setSeconds(result.value.timestamp.getSeconds(), result.value.timestamp.getNanos() / 1000000);

            allResults.push({
                key: result.value.tx_id,
                timestamp: date.toString(),
                value: wasteOrderValue
            });

            if (result.done) {
                await iterator.close();
                break;
            }
        }

        return allResults;
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
