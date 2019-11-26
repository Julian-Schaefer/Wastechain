import { Context } from "fabric-contract-api";
import { Iterators } from "fabric-shim";
import { WasteOrder } from "./model/WasteOrder";
import { WasteOrderPublic, WasteOrderPublicSchema } from "./model/WasteOrderPublic";
import { WasteOrderPrivate, WasteOrderPrivateSchema } from "./model/WasteOrderPrivate";
import { Guid } from "guid-typescript";
import * as Joi from '@hapi/joi';

export async function getWasteOrder(ctx: Context, orderId: string): Promise<WasteOrder> {
    const exists = await checkIfWasteOrderExists(ctx, orderId);
    if (!exists) {
        throw new Error(`The order ${orderId} does not exist`);
    }

    let wasteOrder = await getWasteOrderPublic(ctx, orderId);
    let wasteOrderPrivate = await getWasteOrderPrivate(ctx, orderId);

    return {
        ...wasteOrderPrivate,
        ...wasteOrder
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

export async function getWasteOrderPrivate(ctx: Context, orderId: string, orderPrivateId?: string): Promise<WasteOrderPrivate> {
    const exists = await checkIfWasteOrderExists(ctx, orderId);
    if (!exists) {
        throw new Error(`The order ${orderId} does not exist`);
    }

    let wasteOrderPublic: WasteOrderPublic = await getWasteOrderPublic(ctx, orderId);
    let wasteOrderPrivateId = orderPrivateId ? orderPrivateId : wasteOrderPublic.privateDataId;

    let wasteOrderPrivateBuffer: Buffer;

    try {
        wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrderPublic.originatorMSPID + '-' + wasteOrderPublic.subcontractorMSPID, wasteOrderPrivateId);
    } catch {
        wasteOrderPrivateBuffer = await ctx.stub.getPrivateData(wasteOrderPublic.subcontractorMSPID + '-' + wasteOrderPublic.originatorMSPID, wasteOrderPrivateId);
    }

    if (!wasteOrderPrivateBuffer) {
        throw "Private Data not found or not accessible.";
    }

    const wasteOrderPrivate = JSON.parse(wasteOrderPrivateBuffer.toString()) as WasteOrderPrivate;
    return wasteOrderPrivate;
}

export async function checkIfWasteOrderExists(ctx: Context, orderId: string): Promise<boolean> {
    const buffer = await ctx.stub.getState(orderId);
    return (!!buffer && buffer.length > 0);
}

export async function saveWasteOrder(ctx: Context, wasteOrderPublic: WasteOrderPublic, wasteOrderPrivate: WasteOrderPrivate) {
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

export function getWasteOrderPrivateFromTransient(ctx: Context): WasteOrderPrivate {
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

export async function getWasteOrdersFromQuery(ctx: Context, query: any, status: string): Promise<WasteOrder[]> {
    let wasteOrderResults: WasteOrder[] = [];

    let iterator: Iterators.StateQueryIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    let wasteOrdersPublic = await getResultsFromIterator<WasteOrderPublic>(iterator);

    for (let wasteOrderPublic of wasteOrdersPublic) {
        let wasteOrder = await getWasteOrder(ctx, wasteOrderPublic.id);
        if (wasteOrder.status === Number(status)) {
            wasteOrderResults.push(wasteOrder);
        }
    }

    return wasteOrderResults;
}

async function getResultsFromIterator<T>(iterator: Iterators.StateQueryIterator): Promise<T[]> {
    let results: T[] = [];

    while (true) {
        let result = await iterator.next();

        if (result.value && result.value.value.toString()) {
            let resultObject: T;

            try {
                resultObject = JSON.parse(result.value.value.toString('utf8'));
            } catch (err) {
                console.log(err);
                //wasteOrder = result.value.value.toString('utf8');
            }

            results.push(resultObject);
        }

        if (result.done) {
            await iterator.close();
            return results;
        }
    }
}