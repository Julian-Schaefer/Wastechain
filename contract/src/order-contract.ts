/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Order } from './order';

@Info({ title: 'OrderContract', description: 'Contract to exchange Waste Orders' })
export class OrderContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async orderExists(ctx: Context, orderId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createOrder(ctx: Context, orderId: string, value: string): Promise<void> {
        const exists = await this.orderExists(ctx, orderId);
        if (exists) {
            throw new Error(`The order ${orderId} already exists`);
        }
        const order = new Order();
        order.value = value;
        const buffer = Buffer.from(JSON.stringify(order));
        ctx.stub.setEvent("CREATE_ORDER", buffer);
        await ctx.stub.putState(orderId, buffer);
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
