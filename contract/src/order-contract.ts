/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import * as Joi from '@hapi/joi';
import { Order } from './order';
import { WasteOrder, WasteOrderSchema } from './model/WasteOrder';

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
        if(validationResult.error !== null) {
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
    @Returns('Order')
    public async readOrder(ctx: Context, orderId: string): Promise<Order> {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const buffer = await ctx.stub.getState(orderId);
        const order = JSON.parse(buffer.toString()) as Order;
        return order;
    }

    @Transaction()
    public async updateOrder(ctx: Context, orderId: string, newValue: string): Promise<void> {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const order = new Order();
        order.value = newValue;
        const buffer = Buffer.from(JSON.stringify(order));
        await ctx.stub.putState(orderId, buffer);
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
