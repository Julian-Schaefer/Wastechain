/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import * as Joi from '@hapi/joi';
import { WasteOrder, WasteOrderCommissionSchema } from './model/WasteOrder';
import { WasteOrderPrivate, WasteOrderPrivateCommissionSchema, WasteOrderStatus, getWasteOrderPrivateFromString, WasteOrderPrivateRejectSchema, WasteOrderPrivateCompleteSchema, WasteOrderPrivateCorrectionSchema } from './model/WasteOrderPrivate';
import { WasteOrderTransaction } from './model/WasteOrderTransaction';
import { Iterators } from 'fabric-shim';
import { Guid } from 'guid-typescript';

@Info({ title: 'WasteOrderContract', description: 'Contract to commission Waste Orders to Subcontractors' })
export class WasteOrderContract extends Contract {

    @Transaction()
    public async commissionWasteOrder(ctx: Context, orderId: string, wasteOrderValue: string): Promise<WasteOrder & WasteOrderPrivate> {
        let wasteOrderId = ctx.clientIdentity.getMSPID() + '-' + orderId;

        let wasteOrder = JSON.parse(wasteOrderValue);
        wasteOrder = {
            id: wasteOrderId,
            originatorMSPID: ctx.clientIdentity.getMSPID(),
            subcontractorMSPID: wasteOrder.subcontractorMSPID
        };

        let validationResult = Joi.validate(wasteOrder, WasteOrderCommissionSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Schema: " + validationResult.error.message;
        }

        let wasteOrderPrivate: WasteOrderPrivate = getWasteOrderPrivateFromString(wasteOrderValue);
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

        this.saveWasteOrder(ctx, wasteOrder, wasteOrderPrivate);
        return {
            ...wasteOrder,
            ...wasteOrderPrivate
        };
    }

    @Transaction()
    public async acceptWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder & WasteOrderPrivate> {
        let wasteOrder = await this.getWasteOrder(ctx, orderId);
        let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, orderId);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!(wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED && wasteOrder.subcontractorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be accepted by the Subcontractor and needs to have the Status "Commissioned".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            status: WasteOrderStatus.ACCEPTED
        }

        await this.saveWasteOrder(ctx, wasteOrder, newWasteOrderPrivate);
        return {
            ...wasteOrder,
            ...newWasteOrderPrivate
        };
    }

    @Transaction()
    public async rejectWasteOrder(ctx: Context, orderId: string, updatedWasteOrderValue: string): Promise<WasteOrder & WasteOrderPrivate> {
        let updatedWasteOrderPrivate: WasteOrderPrivate = JSON.parse(updatedWasteOrderValue);

        let validationResult = Joi.validate(updatedWasteOrderPrivate, WasteOrderPrivateRejectSchema);
        if (validationResult.error !== null) {
            throw 'Invalid Schema: ' + validationResult.error.message;
        }

        let wasteOrder = await this.getWasteOrder(ctx, orderId);
        let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, orderId);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!(wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED && wasteOrder.subcontractorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be rejected by the Subcontractor and needs to have the Status "Commissioned".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            ...updatedWasteOrderPrivate,
            status: WasteOrderStatus.REJECTED
        }

        await this.saveWasteOrder(ctx, wasteOrder, newWasteOrderPrivate);
        return {
            ...wasteOrder,
            ...newWasteOrderPrivate
        };
    }

    @Transaction()
    public async cancelWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder & WasteOrderPrivate> {
        let wasteOrder = await this.getWasteOrder(ctx, orderId);
        let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, orderId);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED) {
            if (!(wasteOrder.originatorMSPID === MSPID)) {
                throw new Error('Waste Orders with Status "Commissioned" can only be cancelled by the Originator.');
            }
        } else if (wasteOrderPrivate.status == WasteOrderStatus.ACCEPTED) {
            if (!(wasteOrder.originatorMSPID === MSPID || wasteOrder.subcontractorMSPID === MSPID)) {
                throw new Error('Waste Orders with Status "Accepted" can only be cancelled by the Subcontractor or the Originator.');
            }
        } else {
            throw new Error('Only Waste Orders with Status "Commissioned" or "Accepted" can be cancelled.');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            status: WasteOrderStatus.CANCELLED
        }

        await this.saveWasteOrder(ctx, wasteOrder, newWasteOrderPrivate);
        return {
            ...wasteOrder,
            ...newWasteOrderPrivate
        };
    }

    @Transaction()
    public async completeWasteOrder(ctx: Context, orderId: string, updatedWasteOrderValue: string): Promise<WasteOrder & WasteOrderPrivate> {
        let updatedWasteOrderPrivate: WasteOrder = JSON.parse(updatedWasteOrderValue);

        let validationResult = Joi.validate(updatedWasteOrderPrivate, WasteOrderPrivateCompleteSchema);
        if (validationResult.error !== null) {
            throw 'Invalid Schema: ' + validationResult.error.message;
        }

        let wasteOrder = await this.getWasteOrder(ctx, orderId);
        let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, orderId);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!(wasteOrderPrivate.status === WasteOrderStatus.ACCEPTED && wasteOrder.subcontractorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be completed by the Subcontractor and needs to have the Status "Accepted".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            ...updatedWasteOrderPrivate,
            status: WasteOrderStatus.COMPLETED
        }

        await this.saveWasteOrder(ctx, wasteOrder, newWasteOrderPrivate);
        return {
            ...wasteOrder,
            ...newWasteOrderPrivate
        };
    }

    @Transaction()
    public async correctWasteOrder(ctx: Context, orderId: string, updatedWasteOrderValue: string): Promise<WasteOrder & WasteOrderPrivate> {
        let updatedWasteOrderPrivate: WasteOrder = JSON.parse(updatedWasteOrderValue);

        let validationResult = Joi.validate(updatedWasteOrderPrivate, WasteOrderPrivateCorrectionSchema);
        if (validationResult.error !== null) {
            throw 'Invalid Schema: ' + validationResult.error.message;
        }

        let wasteOrder = await this.getWasteOrder(ctx, orderId);
        let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, orderId);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!((wasteOrderPrivate.status === WasteOrderStatus.REJECTED || wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED) && wasteOrder.originatorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be corrected by the Originator and needs to have the Status "Rejected" or "Commissioned".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            ...updatedWasteOrderPrivate,
            rejectionMessage: undefined,
            status: WasteOrderStatus.COMMISSIONED
        }

        await this.saveWasteOrder(ctx, wasteOrder, newWasteOrderPrivate);
        return {
            ...wasteOrder,
            ...newWasteOrderPrivate
        };
    }

    @Transaction(false)
    public async getWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
        const exists = await this.checkIfWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const buffer = await ctx.stub.getState(orderId);
        const wasteOrder = JSON.parse(buffer.toString()) as WasteOrder;

        return wasteOrder;
    }

    @Transaction(false)
    public async getWasteOrderPrivate(ctx: Context, orderId: string): Promise<WasteOrderPrivate> {
        const exists = await this.checkIfWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        let wasteOrder = await this.getWasteOrder(ctx, orderId);

        let wasteOrderPrivateBuffer: Buffer;

        try {
            wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrder.originatorMSPID + '-' + wasteOrder.subcontractorMSPID, wasteOrder.privateDataId);
        } catch {
            wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrder.subcontractorMSPID + '-' + wasteOrder.originatorMSPID, wasteOrder.privateDataId);
        }

        if (!wasteOrderPrivateBuffer) {
            throw "Private Data not found or not accessible.";
        }

        const wasteOrderPrivate = JSON.parse(wasteOrderPrivateBuffer.toString()) as WasteOrderPrivate;
        return wasteOrderPrivate;
    }

    // TODO
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
    public async getWasteOrdersForSubcontractorWithStatus(ctx: Context, MSPID: string, status: string): Promise<(WasteOrder & WasteOrderPrivate)[]> {
        let wasteOrderResults: (WasteOrder & WasteOrderPrivate)[] = [];

        let query = {
            selector: {
                subcontractorMSPID: MSPID
            }
        };

        let iterator: Iterators.StateQueryIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        let wasteOrders = await this.getWasteOrdersFromIterator(iterator);

        for (let wasteOrder of wasteOrders) {
            let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, wasteOrder.id);
            if (wasteOrderPrivate.status === Number(status)) {
                wasteOrderResults.push({
                    ...wasteOrder,
                    ...wasteOrderPrivate
                });
            }
        }

        return wasteOrderResults;
    }

    @Transaction(false)
    public async getWasteOrdersForOriginatorWithStatus(ctx: Context, MSPID: string, status: string): Promise<(WasteOrder & WasteOrderPrivate)[]> {
        let wasteOrderResults: (WasteOrder & WasteOrderPrivate)[] = [];

        let query = {
            selector: {
                originatorMSPID: MSPID
            }
        };

        let iterator: Iterators.StateQueryIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        let wasteOrders = await this.getWasteOrdersFromIterator(iterator);

        for (let wasteOrder of wasteOrders) {
            let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, wasteOrder.id);
            if (wasteOrderPrivate.status === Number(status)) {
                wasteOrderResults.push({
                    ...wasteOrder,
                    ...wasteOrderPrivate
                });
            }
        }

        return wasteOrderResults;
    }

    @Transaction(false)
    public async checkIfWasteOrderExists(ctx: Context, orderId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }

    private async saveWasteOrder(ctx: Context, wasteOrder: WasteOrder, wasteOrderPrivate: WasteOrderPrivate) {
        let wasteOrderPrivateId = wasteOrder.id + '-' + Guid.create().toString();
        wasteOrder.privateDataId = wasteOrderPrivateId;

        const wasteOrderBuffer = Buffer.from(JSON.stringify(wasteOrder));
        await ctx.stub.putState(wasteOrder.id, wasteOrderBuffer);

        wasteOrderPrivate.id = wasteOrderPrivateId;
        wasteOrderPrivate.lastChanged = new Date();
        wasteOrderPrivate.lastChangedByMSPID = ctx.clientIdentity.getMSPID();

        const wasteOrderPrivateBuffer = Buffer.from(JSON.stringify(wasteOrderPrivate));

        try {
            await ctx.stub.putPrivateData(wasteOrder.originatorMSPID + '-' + wasteOrder.subcontractorMSPID, wasteOrderPrivate.id, wasteOrderPrivateBuffer);
        } catch {
            await ctx.stub.putPrivateData(wasteOrder.subcontractorMSPID + '-' + wasteOrder.originatorMSPID, wasteOrderPrivate.id, wasteOrderPrivateBuffer);
        }
    }

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
