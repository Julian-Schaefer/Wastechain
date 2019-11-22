/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import * as Joi from '@hapi/joi';
import { WasteOrder, WasteOrderSchema } from './model/WasteOrder';
import { WasteOrderPrivate, WasteOrderPrivateCommissionSchema, WasteOrderStatus } from './model/WasteOrderPrivate';
import { WasteOrderTransaction } from './model/WasteOrderTransaction';
import { Iterators } from 'fabric-shim';

@Info({ title: 'WasteOrderContract', description: 'Contract to commission Waste Orders to Subcontractors' })
export class WasteOrderContract extends Contract {

    @Transaction()
    public async commissionWasteOrder(ctx: Context, orderId: string, wasteOrderValue: string): Promise<WasteOrder> {
        let wasteOrderId = ctx.clientIdentity.getMSPID() + '-' + orderId;

        let wasteOrder: WasteOrder = JSON.parse(wasteOrderValue);
        wasteOrder = {
            id: wasteOrderId,
            originatorMSPID: ctx.clientIdentity.getMSPID(),
            subcontractorMSPID: wasteOrder.subcontractorMSPID
        };

        let validationResult = Joi.validate(wasteOrder, WasteOrderSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Schema: " + validationResult.error.message;
        }

        let wasteOrderPrivate: WasteOrderPrivate = this.getWasteOrderPrivateFromString(wasteOrderValue);
        wasteOrderPrivate.id = wasteOrderId;
        wasteOrderPrivate.status = WasteOrderStatus.COMMISSIONED;
        wasteOrderPrivate.lastChanged = new Date();
        wasteOrderPrivate.lastChangedByMSPID = ctx.clientIdentity.getMSPID();
        delete wasteOrderPrivate.rejectionMessage;

        let privateValidationResult = Joi.validate(wasteOrderPrivate, WasteOrderPrivateCommissionSchema);
        if (privateValidationResult.error !== null) {
            throw "Invalid Waste Order Schema: " + privateValidationResult.error.message;
        }

        const exists = await this.checkIfWasteOrderExists(ctx, wasteOrder.id);
        if (exists) {
            throw new Error(`The order ${wasteOrder.id} already exists`);
        }

        if (wasteOrder.subcontractorMSPID === ctx.clientIdentity.getMSPID()) {
            throw new Error('It is not possible to commision a Waste Order to yourself.');
        }

        const wasteOrderBuffer = Buffer.from(JSON.stringify(wasteOrder));
        await ctx.stub.putState(wasteOrder.id, wasteOrderBuffer);

        const wasteOrderPrivateBuffer = Buffer.from(JSON.stringify(wasteOrderPrivate));

        try {
            await ctx.stub.putPrivateData(wasteOrder.originatorMSPID + '-' + wasteOrder.subcontractorMSPID, wasteOrder.id, wasteOrderPrivateBuffer);
        } catch {
            await ctx.stub.putPrivateData(wasteOrder.subcontractorMSPID + '-' + wasteOrder.originatorMSPID, wasteOrder.id, wasteOrderPrivateBuffer);
        }

        ctx.stub.setEvent("COMMISSION_WASTE_ORDER", wasteOrderBuffer);

        return wasteOrder;
    }

    public getWasteOrderPrivateFromString(wasteOrderPrivateValue: string): WasteOrderPrivate {
        let wasteOrderPrivate: WasteOrderPrivate = JSON.parse(wasteOrderPrivateValue);

        return {
            id: wasteOrderPrivate.id,
            status: wasteOrderPrivate.status,
            customerName: wasteOrderPrivate.customerName,
            taskSite: wasteOrderPrivate.taskSite,
            service: wasteOrderPrivate.service,
            description: wasteOrderPrivate.description,
            quantity: wasteOrderPrivate.quantity,
            unitPrice: wasteOrderPrivate.unitPrice,
            unitOfMeasure: wasteOrderPrivate.unitOfMeasure,
            taskDate: wasteOrderPrivate.taskDate,
            startingTime: wasteOrderPrivate.startingTime,
            finishingTime: wasteOrderPrivate.finishingTime,
            referenceNo: wasteOrderPrivate.referenceNo,
            rejectionMessage: wasteOrderPrivate.rejectionMessage,
            lastChanged: wasteOrderPrivate.lastChanged,
            lastChangedByMSPID: wasteOrderPrivate.lastChangedByMSPID
        };
    }

    // @Transaction()
    // public async acceptWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
    //     let wasteOrder = await this.getWasteOrder(ctx, orderId);
    //     const MSPID = ctx.clientIdentity.getMSPID();

    //     if (!(wasteOrder.status === WasteOrderStatus.COMMISSIONED && wasteOrder.subcontractorMSPID === MSPID)) {
    //         throw new Error('The Waste Order can only be accepted by the Subcontractor and needs to have the Status "Commissioned".');
    //     }

    //     const newWasteOrder: WasteOrder = {
    //         ...wasteOrder,
    //         status: WasteOrderStatus.ACCEPTED
    //     }

    //     await this.saveWasteOrder(ctx, newWasteOrder);
    //     return newWasteOrder;
    // }

    // @Transaction()
    // public async rejectWasteOrder(ctx: Context, orderId: string, updatedWasteOrderValue: string): Promise<WasteOrder> {
    //     let updatedWasteOrder: WasteOrder = JSON.parse(updatedWasteOrderValue);

    //     let validationResult = Joi.validate(updatedWasteOrder, WasteOrderRejectSchema);
    //     if (validationResult.error !== null) {
    //         throw 'Invalid Schema: ' + validationResult.error.message;
    //     }

    //     let wasteOrder = await this.getWasteOrder(ctx, orderId);
    //     const MSPID = ctx.clientIdentity.getMSPID();

    //     if (!(wasteOrder.status === WasteOrderStatus.COMMISSIONED && wasteOrder.subcontractorMSPID === MSPID)) {
    //         throw new Error('The Waste Order can only be rejected by the Subcontractor and needs to have the Status "Commissioned".');
    //     }

    //     const newWasteOrder: WasteOrder = {
    //         ...wasteOrder,
    //         ...updatedWasteOrder,
    //         status: WasteOrderStatus.REJECTED
    //     }

    //     await this.saveWasteOrder(ctx, newWasteOrder);
    //     return newWasteOrder;
    // }

    // @Transaction()
    // public async cancelWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
    //     let wasteOrder = await this.getWasteOrder(ctx, orderId);
    //     const MSPID = ctx.clientIdentity.getMSPID();

    //     if (wasteOrder.status === WasteOrderStatus.COMMISSIONED) {
    //         if (!(wasteOrder.originatorMSPID === MSPID)) {
    //             throw new Error('Waste Orders with Status "Commissioned" can only be cancelled by the Originator.');
    //         }
    //     } else if (wasteOrder.status == WasteOrderStatus.ACCEPTED) {
    //         if (!(wasteOrder.originatorMSPID === MSPID || wasteOrder.subcontractorMSPID === MSPID)) {
    //             throw new Error('Waste Orders with Status "Accepted" can only be cancelled by the Subcontractor or the Originator.');
    //         }
    //     } else {
    //         throw new Error('Only Waste Orders with Status "Commissioned" or "Accepted" can be cancelled.');
    //     }

    //     const newWasteOrder: WasteOrder = {
    //         ...wasteOrder,
    //         status: WasteOrderStatus.CANCELLED
    //     }

    //     await this.saveWasteOrder(ctx, newWasteOrder);
    //     return newWasteOrder;
    // }

    // @Transaction()
    // public async completeWasteOrder(ctx: Context, orderId: string, updatedWasteOrderValue: string): Promise<WasteOrder> {
    //     let updatedWasteOrder: WasteOrder = JSON.parse(updatedWasteOrderValue);

    //     let validationResult = Joi.validate(updatedWasteOrder, WasteOrderCompleteSchema);
    //     if (validationResult.error !== null) {
    //         throw 'Invalid Schema: ' + validationResult.error.message;
    //     }

    //     let wasteOrder = await this.getWasteOrder(ctx, orderId);
    //     const MSPID = ctx.clientIdentity.getMSPID();

    //     if (!(wasteOrder.status === WasteOrderStatus.ACCEPTED && wasteOrder.subcontractorMSPID === MSPID)) {
    //         throw new Error('The Waste Order can only be completed by the Subcontractor and needs to have the Status "Accepted".');
    //     }

    //     const newWasteOrder: WasteOrder = {
    //         ...wasteOrder,
    //         ...updatedWasteOrder,
    //         status: WasteOrderStatus.COMPLETED
    //     }

    //     await this.saveWasteOrder(ctx, newWasteOrder);
    //     return newWasteOrder;
    // }

    // @Transaction()
    // public async correctWasteOrder(ctx: Context, orderId: string, updatedWasteOrderValue: string): Promise<WasteOrder> {
    //     let updatedWasteOrder: WasteOrder = JSON.parse(updatedWasteOrderValue);

    //     let validationResult = Joi.validate(updatedWasteOrder, WasteOrderCorrectionSchema);
    //     if (validationResult.error !== null) {
    //         throw 'Invalid Schema: ' + validationResult.error.message;
    //     }

    //     const wasteOrder = await this.getWasteOrder(ctx, orderId);
    //     const MSPID = ctx.clientIdentity.getMSPID();

    //     if (!((wasteOrder.status === WasteOrderStatus.REJECTED || wasteOrder.status === WasteOrderStatus.COMMISSIONED) && wasteOrder.originatorMSPID === MSPID)) {
    //         throw new Error('The Waste Order can only be corrected by the Originator and needs to have the Status "Rejected" or "Commissioned".');
    //     }

    //     const newWasteOrder: WasteOrder = {
    //         ...wasteOrder,
    //         ...updatedWasteOrder,
    //         rejectionMessage: undefined,
    //         status: WasteOrderStatus.COMMISSIONED
    //     }

    //     await this.saveWasteOrder(ctx, newWasteOrder);
    //     return newWasteOrder;
    // }

    @Transaction(false)
    public async getWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
        const exists = await this.checkIfWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const buffer = await ctx.stub.getState(orderId);
        const wasteOrder = JSON.parse(buffer.toString()) as WasteOrder;

        let privateData: Buffer;

        try {
            privateData = await ctx.stub.getPrivateData(wasteOrder.originatorMSPID + '-' + wasteOrder.subcontractorMSPID, orderId);
        } catch {
            privateData = await ctx.stub.getPrivateData(wasteOrder.subcontractorMSPID + '-' + wasteOrder.originatorMSPID, orderId);
        }

        if (!privateData) {
            throw "Private Data not found or not accessible.";
        }



        return wasteOrder;
    }

    @Transaction(false)
    public async getWasteOrderHistory(ctx: Context, orderId: string): Promise<WasteOrderTransaction[]> {
        const exists = await this.checkIfWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        let iterator = await ctx.stub.getHistoryForKey(orderId);
        let transactionHistory: WasteOrderTransaction[] = [];

        while (true) {
            let result = await iterator.next();

            if (result.value && result.value.value.toString()) {
                console.log(result.value.value.toString('utf8'));

                let value: WasteOrder;
                try {
                    value = JSON.parse(result.value.value.toString('utf8'));
                } catch (error) {
                    console.log(error);
                    throw (error);
                }

                let date = new Date(0);
                date.setSeconds(result.value.timestamp.getSeconds(), result.value.timestamp.getNanos() / 1000000);

                let transaction: WasteOrderTransaction = {
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
    public async getWasteOrdersForSubcontractorWithStatus(ctx: Context, MSPID: string, status: string): Promise<WasteOrder[]> {
        let query = {
            selector: {
                subcontractorMSPID: MSPID,
                status: Number(status)
            }
        };

        let iterator: Iterators.StateQueryIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        return this.getWasteOrdersFromIterator(iterator);
    }

    @Transaction(false)
    public async getWasteOrdersForOriginatorWithStatus(ctx: Context, MSPID: string, status: string): Promise<WasteOrder[]> {
        let query = {
            selector: {
                originatorMSPID: MSPID,
                status: Number(status)
            }
        };

        let iterator: Iterators.StateQueryIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        return this.getWasteOrdersFromIterator(iterator);
    }

    @Transaction(false)
    public async checkIfWasteOrderExists(ctx: Context, orderId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }

    // private async saveWasteOrder(ctx: Context, wasteOrder: WasteOrder) {
    //     wasteOrder.lastChanged = new Date();
    //     wasteOrder.lastChangedByMSPID = ctx.clientIdentity.getMSPID();

    //     const buffer = Buffer.from(JSON.stringify(wasteOrder));
    //     await ctx.stub.putState(wasteOrder.id, buffer);
    // }

    private async getWasteOrdersFromIterator(iterator: Iterators.StateQueryIterator): Promise<WasteOrder[]> {
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
}
