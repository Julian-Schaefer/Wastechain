import * as Joi from '@hapi/joi';
import { Context } from 'fabric-contract-api';
import { Iterators } from 'fabric-shim';
import { Guid } from 'guid-typescript';
import { WasteOrder } from './model/WasteOrder';
import { WasteOrderPrivate, WasteOrderPrivateSchema } from './model/WasteOrderPrivate';
import { WasteOrderPublic, WasteOrderPublicSchema } from './model/WasteOrderPublic';

export async function getWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
    const exists = await checkIfWasteOrderExists(ctx, orderId);
    if (!exists) {
        throw new Error(`The order ${orderId} does not exist`);
    }

    const wasteOrderPublic = await getWasteOrderPublic(ctx, orderId);
    const wasteOrderPrivate = await getWasteOrderPrivate(ctx, wasteOrderPublic);

    return {
        ...wasteOrderPrivate,
        ...wasteOrderPublic,
    };
}

export async function getWasteOrderPublic(ctx: Context, orderId: string): Promise<WasteOrderPublic> {
    const exists = await checkIfWasteOrderExists(ctx, orderId);
    if (!exists) {
        throw new Error(`The order ${orderId} does not exist`);
    }
    const buffer = await ctx.stub.getState(orderId);
    const wasteOrder = JSON.parse(buffer.toString()) as WasteOrderPublic;

    return wasteOrder;
}

export async function getWasteOrderPrivate(ctx: Context, wasteOrderPublic: WasteOrderPublic, orderPrivateId?: string): Promise<WasteOrderPrivate> {
    const exists = await checkIfWasteOrderExists(ctx, wasteOrderPublic.id);
    if (!exists) {
        throw new Error(`The order ${wasteOrderPublic.id} does not exist`);
    }

    const wasteOrderPrivateId = orderPrivateId ? orderPrivateId : wasteOrderPublic.wasteOrderPrivateId;
    let wasteOrderPrivateBuffer: Buffer;

    try {
        wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrderPublic.originatorMSPID + '-' + wasteOrderPublic.subcontractorMSPID, wasteOrderPrivateId);
    } catch {
        wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrderPublic.subcontractorMSPID + '-' + wasteOrderPublic.originatorMSPID, wasteOrderPrivateId);
    }

    if (!wasteOrderPrivateBuffer) {
        throw new Error('Private Data not found or not accessible.');
    }

    const wasteOrderPrivate = JSON.parse(wasteOrderPrivateBuffer.toString()) as WasteOrderPrivate;
    return wasteOrderPrivate;
}

export async function checkIfWasteOrderExists(ctx: Context, orderId: string): Promise<boolean> {
    const buffer = await ctx.stub.getState(orderId);
    return (!!buffer && buffer.length > 0);
}

export async function saveWasteOrder(ctx: Context, wasteOrderPublic: WasteOrderPublic, wasteOrderPrivate: WasteOrderPrivate) {
    const wasteOrderPrivateId = wasteOrderPublic.id + '-' + Guid.create().toString();
    wasteOrderPublic.wasteOrderPrivateId = wasteOrderPrivateId;

    const validationResult = Joi.validate(wasteOrderPublic, WasteOrderPublicSchema);
    if (validationResult.error !== null) {
        throw new Error('Invalid Waste Order Public Schema: ' + validationResult.error.message);
    }

    wasteOrderPrivate.id = wasteOrderPrivateId;
    wasteOrderPrivate.lastChanged = new Date();
    wasteOrderPrivate.lastChangedByMSPID = ctx.clientIdentity.getMSPID();

    const privateValidationResult = Joi.validate(wasteOrderPrivate, WasteOrderPrivateSchema);
    if (privateValidationResult.error !== null) {
        throw new Error('Invalid Waste Order Private Schema: ' + privateValidationResult.error.message);
    }

    const wasteOrderPrivateBuffer = Buffer.from(JSON.stringify(wasteOrderPrivate));

    try {
        await ctx.stub.putPrivateData(wasteOrderPublic.originatorMSPID + '-' + wasteOrderPublic.subcontractorMSPID,
            wasteOrderPrivate.id, wasteOrderPrivateBuffer);
    } catch {
        await ctx.stub.putPrivateData(wasteOrderPublic.subcontractorMSPID + '-' + wasteOrderPublic.originatorMSPID,
            wasteOrderPrivate.id, wasteOrderPrivateBuffer);
    }

    const wasteOrderPublicBuffer = Buffer.from(JSON.stringify(wasteOrderPublic));
    await ctx.stub.putState(wasteOrderPublic.id, wasteOrderPublicBuffer);
}

export function getWasteOrderPrivateFromTransient(ctx: Context): WasteOrderPrivate {
    const transient: any = ctx.stub.getTransient();

    if (transient.size === 1) {
        const transientBuffer = new Buffer(transient.map.order.value.toArrayBuffer());
        ctx.logging.getLogger().info('Transient Order: ' + transientBuffer.toString('utf-8'));
        const wasteOrderPrivate: WasteOrderPrivate = JSON.parse(transientBuffer.toString('utf-8'));
        return wasteOrderPrivate;
    } else {
        throw new Error('No Private Order Details provided.');
    }
}

export async function getWasteOrdersFromQuery(ctx: Context, query: any, status: string): Promise<WasteOrder[]> {
    const wasteOrderResults: WasteOrder[] = [];

    const iterator: Iterators.StateQueryIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const wasteOrdersPublic = await getResultsFromIterator<WasteOrderPublic>(iterator);

    for (const wasteOrderPublic of wasteOrdersPublic) {
        const wasteOrder = await getWasteOrder(ctx, wasteOrderPublic.id);
        if (wasteOrder.status === Number(status)) {
            wasteOrderResults.push(wasteOrder);
        }
    }

    return wasteOrderResults;
}

async function getResultsFromIterator<T>(iterator: Iterators.StateQueryIterator): Promise<T[]> {
    const results: T[] = [];

    while (true) {
        const result = await iterator.next();

        if (result.value && result.value.value.toString()) {
            let resultObject: T;

            try {
                resultObject = JSON.parse(result.value.value.toString('utf8'));
            } catch (err) {
                console.log(err);
                // wasteOrder = result.value.value.toString('utf8');
            }

            results.push(resultObject);
        }

        if (result.done) {
            await iterator.close();
            return results;
        }
    }
}