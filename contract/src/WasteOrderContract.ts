/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Joi from '@hapi/joi';
import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { WasteOrder } from './model/WasteOrder';
import { WasteOrderPrivate, WasteOrderPrivateCommissionSchema, WasteOrderPrivateCompleteSchema, WasteOrderPrivateCorrectionSchema, WasteOrderPrivateRejectSchema, WasteOrderStatus } from './model/WasteOrderPrivate';
import { WasteOrderPublic, WasteOrderPublicCommissionSchema } from './model/WasteOrderPublic';
import { WasteOrderTransaction } from './model/WasteOrderTransaction';
import * as Util from './WasteOrderUtil';

@Info({ title: 'WasteOrderContract', description: 'Contract to commission Waste Orders to Subcontractors' })
export class WasteOrderContract extends Contract {

    @Transaction(false)
    public init(ctx: Context) {
        ctx.logging.getLogger().info('Initialized Wastechain successfully!');
    }

    @Transaction()
    public async commissionWasteOrder(ctx: Context, orderId: string, wasteOrderPublicValue: string): Promise<WasteOrder & WasteOrderPrivate> {
        const wasteOrderId = ctx.clientIdentity.getMSPID() + '-' + orderId;

        const wasteOrderPublic: WasteOrderPublic = JSON.parse(wasteOrderPublicValue);
        const publicValidationResult = Joi.validate(wasteOrderPublic, WasteOrderPublicCommissionSchema);
        if (publicValidationResult.error !== null) {
            throw new Error('Invalid Waste Order Public Schema: ' + publicValidationResult.error.message);
        }
        wasteOrderPublic.id = wasteOrderId;
        wasteOrderPublic.originatorMSPID = ctx.clientIdentity.getMSPID();

        const wasteOrderPrivate = Util.getWasteOrderPrivateFromTransient(ctx);
        const privateValidationResult = Joi.validate(wasteOrderPrivate, WasteOrderPrivateCommissionSchema);
        if (privateValidationResult.error !== null) {
            throw new Error('Invalid Waste Order Private Schema: ' + privateValidationResult.error.message);
        }
        wasteOrderPrivate.id = wasteOrderId;
        wasteOrderPrivate.status = WasteOrderStatus.COMMISSIONED;

        const exists = await Util.checkIfWasteOrderExists(ctx, wasteOrderPublic.id);
        if (exists) {
            throw new Error(`The order ${wasteOrderPublic.id} already exists`);
        }

        if (wasteOrderPublic.subcontractorMSPID === ctx.clientIdentity.getMSPID()) {
            throw new Error('It is not possible to commision a Waste Order to yourself.');
        }

        await Util.saveWasteOrder(ctx, wasteOrderPublic, wasteOrderPrivate);

        return {
            ...wasteOrderPrivate,
            ...wasteOrderPublic,
        };
    }

    @Transaction()
    public async acceptWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
        const wasteOrderPublic = await Util.getWasteOrderPublic(ctx, orderId);
        const wasteOrderPrivate = await Util.getWasteOrderPrivate(ctx, wasteOrderPublic);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!(wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED && wasteOrderPublic.subcontractorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be accepted by the Subcontractor and needs to have the Status "Commissioned".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            status: WasteOrderStatus.ACCEPTED,
        };

        await Util.saveWasteOrder(ctx, wasteOrderPublic, newWasteOrderPrivate);

        return {
            ...newWasteOrderPrivate,
            ...wasteOrderPublic,
        };
    }

    @Transaction()
    public async rejectWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder & WasteOrderPrivate> {
        const updatedWasteOrderPrivate = Util.getWasteOrderPrivateFromTransient(ctx);

        const validationResult = Joi.validate(updatedWasteOrderPrivate, WasteOrderPrivateRejectSchema);
        if (validationResult.error !== null) {
            throw new Error('Invalid Schema: ' + validationResult.error.message);
        }

        const wasteOrderPublic = await Util.getWasteOrderPublic(ctx, orderId);
        const wasteOrderPrivate = await Util.getWasteOrderPrivate(ctx, wasteOrderPublic);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!(wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED && wasteOrderPublic.subcontractorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be rejected by the Subcontractor and needs to have the Status "Commissioned".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            ...updatedWasteOrderPrivate,
            status: WasteOrderStatus.REJECTED,
        };

        await Util.saveWasteOrder(ctx, wasteOrderPublic, newWasteOrderPrivate);

        return {
            ...newWasteOrderPrivate,
            ...wasteOrderPublic,
        };
    }

    @Transaction()
    public async cancelWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder & WasteOrderPrivate> {
        const wasteOrderPublic = await Util.getWasteOrderPublic(ctx, orderId);
        const wasteOrderPrivate = await Util.getWasteOrderPrivate(ctx, wasteOrderPublic);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED) {
            if (!(wasteOrderPublic.originatorMSPID === MSPID)) {
                throw new Error('Waste Orders with Status "Commissioned" can only be cancelled by the Originator.');
            }
        } else if (wasteOrderPrivate.status === WasteOrderStatus.ACCEPTED) {
            if (!(wasteOrderPublic.originatorMSPID === MSPID || wasteOrderPublic.subcontractorMSPID === MSPID)) {
                throw new Error('Waste Orders with Status "Accepted" can only be cancelled by the Subcontractor or the Originator.');
            }
        } else {
            throw new Error('Only Waste Orders with Status "Commissioned" or "Accepted" can be cancelled.');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            status: WasteOrderStatus.CANCELLED,
        };

        await Util.saveWasteOrder(ctx, wasteOrderPublic, newWasteOrderPrivate);

        return {
            ...newWasteOrderPrivate,
            ...wasteOrderPublic,
        };
    }

    @Transaction()
    public async completeWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder & WasteOrderPrivate> {
        const updatedWasteOrderPrivate = Util.getWasteOrderPrivateFromTransient(ctx);

        const validationResult = Joi.validate(updatedWasteOrderPrivate, WasteOrderPrivateCompleteSchema);
        if (validationResult.error !== null) {
            throw new Error('Invalid Schema: ' + validationResult.error.message);
        }

        const wasteOrderPublic = await Util.getWasteOrderPublic(ctx, orderId);
        const wasteOrderPrivate = await Util.getWasteOrderPrivate(ctx, wasteOrderPublic);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!(wasteOrderPrivate.status === WasteOrderStatus.ACCEPTED && wasteOrderPublic.subcontractorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be completed by the Subcontractor and needs to have the Status "Accepted".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            ...updatedWasteOrderPrivate,
            status: WasteOrderStatus.COMPLETED,
        };

        await Util.saveWasteOrder(ctx, wasteOrderPublic, newWasteOrderPrivate);

        return {
            ...newWasteOrderPrivate,
            ...wasteOrderPublic,
        };
    }

    @Transaction()
    public async correctWasteOrder(ctx: Context, orderId: string, wasteOrderPublicValue: string): Promise<WasteOrder & WasteOrderPrivate> {
        const updatedWasteOrderPublic = JSON.parse(wasteOrderPublicValue);

        const publicValidationResult = Joi.validate(updatedWasteOrderPublic, WasteOrderPublicCommissionSchema);
        if (publicValidationResult.error !== null) {
            throw new Error('Invalid Schema: ' + publicValidationResult.error.message);
        }

        const updatedWasteOrderPrivate = Util.getWasteOrderPrivateFromTransient(ctx);

        const privateValidationResult = Joi.validate(updatedWasteOrderPrivate, WasteOrderPrivateCorrectionSchema);
        if (privateValidationResult.error !== null) {
            throw new Error('Invalid Schema: ' + privateValidationResult.error.message);
        }

        const wasteOrderPublic = await Util.getWasteOrderPublic(ctx, orderId);
        const wasteOrderPrivate = await Util.getWasteOrderPrivate(ctx, wasteOrderPublic);
        const MSPID = ctx.clientIdentity.getMSPID();

        if (!((wasteOrderPrivate.status === WasteOrderStatus.REJECTED || wasteOrderPrivate.status === WasteOrderStatus.COMMISSIONED)
            && wasteOrderPublic.originatorMSPID === MSPID)) {
            throw new Error('The Waste Order can only be corrected by the Originator and needs to have the Status "Rejected" or "Commissioned".');
        }

        const newWasteOrderPrivate: WasteOrderPrivate = {
            ...wasteOrderPrivate,
            ...updatedWasteOrderPrivate,
            rejectionMessage: undefined,
            status: WasteOrderStatus.COMMISSIONED,
        };

        const newWasteOrderPublic: WasteOrderPublic = {
            ...wasteOrderPublic,
            ...updatedWasteOrderPublic,
        };

        await Util.saveWasteOrder(ctx, newWasteOrderPublic, newWasteOrderPrivate);

        return {
            ...newWasteOrderPrivate,
            ...newWasteOrderPublic,
        };
    }

    @Transaction(false)
    public async getWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
        return Util.getWasteOrder(ctx, orderId);
    }

    @Transaction(false)
    public async getWasteOrderHistory(ctx: Context, orderId: string): Promise<WasteOrderTransaction[]> {
        const exists = await Util.checkIfWasteOrderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        const iterator = await ctx.stub.getHistoryForKey(orderId);
        const transactionHistory: WasteOrderTransaction[] = [];

        while (true) {
            const result = await iterator.next();

            if (result.value && result.value.value.toString()) {
                let wasteOrderPublic: WasteOrderPublic;

                try {
                    wasteOrderPublic = JSON.parse(result.value.value.toString('utf8'));
                } catch (error) {
                    console.log(error);
                    throw (error);
                }

                const wasteOrderPrivate = await Util.getWasteOrderPrivate(ctx, wasteOrderPublic, wasteOrderPublic.wasteOrderPrivateId);

                const date = new Date(0);
                date.setSeconds(result.value.timestamp.getSeconds(), result.value.timestamp.getNanos() / 1000000);

                const transaction: WasteOrderTransaction = {
                    isDelete: result.value.is_delete.toString(),
                    timestamp: date.toString(),
                    txId: result.value.tx_id,
                    value: {
                        ...wasteOrderPrivate,
                        ...wasteOrderPublic,
                    },
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
        const query = {
            selector: {
                subcontractorMSPID: MSPID,
            },
        };

        const wasteOrderResults = await Util.getWasteOrdersFromQuery(ctx, query, status);
        return wasteOrderResults;
    }

    @Transaction(false)
    public async getWasteOrdersForOriginatorWithStatus(ctx: Context, MSPID: string, status: string): Promise<WasteOrder[]> {
        const query = {
            selector: {
                originatorMSPID: MSPID,
            },
        };

        const wasteOrderResults = await Util.getWasteOrdersFromQuery(ctx, query, status);
        return wasteOrderResults;
    }
}
