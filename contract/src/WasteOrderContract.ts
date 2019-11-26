/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import * as Joi from '@hapi/joi';
import { WasteOrder } from './model/WasteOrder';
import { WasteOrderPrivate, WasteOrderPrivateCommissionSchema, WasteOrderStatus, getWasteOrderPrivateFromString, WasteOrderPrivateRejectSchema, WasteOrderPrivateCompleteSchema, WasteOrderPrivateCorrectionSchema, WasteOrderPrivateSchema } from './model/WasteOrderPrivate';
import { WasteOrderTransaction } from './model/WasteOrderTransaction';
import { Iterators } from 'fabric-shim';
import { Guid } from 'guid-typescript';
import { WasteOrderPublicCommissionSchema, WasteOrderPublic, WasteOrderPublicSchema } from './model/WasteOrderPublic';

@Info({ title: 'WasteOrderContract', description: 'Contract to commission Waste Orders to Subcontractors' })
export class WasteOrderContract extends Contract {

    @Transaction(false)
    public init(ctx: Context) {
        ctx.logging.getLogger().info("Initialized Wastechain successfully!");
    }

    @Transaction()
    public async commissionWasteOrder(ctx: Context, orderId: string, wasteOrderPublicValue: string): Promise<WasteOrder & WasteOrderPrivate> {
        let wasteOrderId = ctx.clientIdentity.getMSPID() + '-' + orderId;

        let wasteOrderPublic: WasteOrderPublic = JSON.parse(wasteOrderPublicValue);
        let validationResult = Joi.validate(wasteOrderPublic, WasteOrderPublicCommissionSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Public Schema: " + validationResult.error.message;
        }
        wasteOrderPublic.id = wasteOrderId;
        wasteOrderPublic.originatorMSPID = ctx.clientIdentity.getMSPID();

        let wasteOrderPrivate = this.getWasteOrderPrivateFromTransient(ctx);
        let privateValidationResult = Joi.validate(wasteOrderPrivate, WasteOrderPrivateCommissionSchema);
        if (privateValidationResult.error !== null) {
            throw "Invalid Waste Order Private Schema: " + privateValidationResult.error.message;
        }
        wasteOrderPrivate.id = wasteOrderId;
        wasteOrderPrivate.status = WasteOrderStatus.COMMISSIONED;

        const exists = await this.checkIfWasteOrderExists(ctx, wasteOrderPublic.id);
        if (exists) {
            throw new Error(`The order ${wasteOrderPublic.id} already exists`);
        }

        if (wasteOrderPublic.subcontractorMSPID === ctx.clientIdentity.getMSPID()) {
            throw new Error('It is not possible to commision a Waste Order to yourself.');
        }

        await this.saveWasteOrder(ctx, wasteOrderPublic, wasteOrderPrivate);

        return {
            ...wasteOrderPrivate,
            ...wasteOrderPublic
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

        let wasteOrder = await this.getWasteOrderPublic(ctx, orderId);
        let wasteOrderPrivate = await this.getWasteOrderPrivate(ctx, orderId);

        return {
            ...wasteOrderPrivate,
            ...wasteOrder
        };
    }

    private async getWasteOrderPublic(ctx: Context, orderId: string): Promise<WasteOrderPublic> {
        const exists = await this.checkIfWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const buffer = await ctx.stub.getState(orderId);
        const wasteOrder = JSON.parse(buffer.toString()) as WasteOrderPublic;

        return wasteOrder;
    }

    private async getWasteOrderPrivate(ctx: Context, orderId: string): Promise<WasteOrderPrivate> {
        const exists = await this.checkIfWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        let wasteOrderPublic: WasteOrderPublic = await this.getWasteOrderPublic(ctx, orderId);

        let wasteOrderPrivateBuffer: Buffer;

        try {
            wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrderPublic.originatorMSPID + '-' + wasteOrderPublic.subcontractorMSPID, wasteOrderPublic.privateDataId);
        } catch {
            wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrderPublic.subcontractorMSPID + '-' + wasteOrderPublic.originatorMSPID, wasteOrderPublic.privateDataId);
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

    private async saveWasteOrder(ctx: Context, wasteOrderPublic: WasteOrderPublic, wasteOrderPrivate: WasteOrderPrivate) {
        let wasteOrderPrivateId = wasteOrderPublic.id + '-' + Guid.create().toString();
        wasteOrderPublic.privateDataId = wasteOrderPrivateId;

        let validationResult = Joi.validate(wasteOrderPublic, WasteOrderPublicSchema);
        if (validationResult.error !== null) {
            throw "Invalid Waste Order Public Schema: " + validationResult.error.message;
        }

        wasteOrderPrivate.id = wasteOrderPrivateId;
        wasteOrderPrivate.lastChanged = new Date();
        wasteOrderPrivate.lastChangedByMSPID = ctx.clientIdentity.getMSPID();

        let privateValidationResult = Joi.validate(wasteOrderPrivate, WasteOrderPrivateSchema);
        if (privateValidationResult.error !== null) {
            throw "Invalid Waste Order Private Schema: " + privateValidationResult.error.message;
        }

        const wasteOrderPrivateBuffer = Buffer.from(JSON.stringify(wasteOrderPrivate));

        try {
            await ctx.stub.putPrivateData(wasteOrderPublic.originatorMSPID + '-' + wasteOrderPublic.subcontractorMSPID, wasteOrderPrivate.id, wasteOrderPrivateBuffer);
        } catch {
            await ctx.stub.putPrivateData(wasteOrderPublic.subcontractorMSPID + '-' + wasteOrderPublic.originatorMSPID, wasteOrderPrivate.id, wasteOrderPrivateBuffer);
        }

        const wasteOrderPublicBuffer = Buffer.from(JSON.stringify(wasteOrderPublic));
        await ctx.stub.putState(wasteOrderPublic.id, wasteOrderPublicBuffer);
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

    private getWasteOrderPrivateFromTransient(ctx: Context): WasteOrderPrivate {
        const transient: any = ctx.stub.getTransient();

        if (transient.size === 1) {
            const transientBuffer = new Buffer(transient.map.order.value.toArrayBuffer());
            ctx.logging.getLogger().info("Transient Order: " + transientBuffer.toString('utf-8'));
            let wasteOrderPrivate: WasteOrderPrivate = JSON.parse(transientBuffer.toString('utf-8'));
            return wasteOrderPrivate;
        } else {
            throw "No Private Order Details provided.";
        }
    }
}