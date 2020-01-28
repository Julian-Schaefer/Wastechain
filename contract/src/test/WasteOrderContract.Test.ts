/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { WasteOrderContract } from '..';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Guid } from 'guid-typescript';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as winston from 'winston';
import { getWasteOrderPrivateFromWasteOrder, WasteOrderPrivate } from '../model/WasteOrderPrivate';
import { WasteOrderPublic } from '../model/WasteOrderPublic';
import { getTestWasteOrder, getTransientMapFromWasteOrderPrivate } from './TestUtil';

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestingContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);

    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
    };

    constructor() {
        this.stub.getCreator.returns({
            getMspid() { return 'OrderingOrgMSP'; },
        });
    }
}

describe('WasteOrderContract', () => {

    let contract: WasteOrderContract;
    let ctx: TestingContext;

    describe('#commissionWasteOrder', () => {

        beforeEach(() => {
            contract = new WasteOrderContract();
            ctx = new TestingContext();
            ctx.stub.getTxID.returns(Guid.create());
            ctx.stub.getTxTimestamp.returns({
                getSeconds() { return new Date().getSeconds(); },
                getNanos() { return new Date().getMilliseconds(); },
            });
            ctx.clientIdentity.getMSPID.returns('OrderingOrgMSP');
        });

        it('Should return the correct WasteOrder when commissioning a new Waste Order', async () => {
            const wasteOrder = getTestWasteOrder();

            const wasteOrderPrivate: WasteOrderPrivate = getWasteOrderPrivateFromWasteOrder(wasteOrder);

            delete wasteOrderPrivate.id;
            delete wasteOrderPrivate.lastChanged;
            delete wasteOrderPrivate.lastChangedByMSPID;
            delete wasteOrderPrivate.rejectionMessage;

            ctx.stub.getTransient.returns(getTransientMapFromWasteOrderPrivate(wasteOrderPrivate as WasteOrderPrivate));

            const wasteOrderPublic = {
                subcontractorMSPID: wasteOrder.subcontractorMSPID,
            };

            const expectedWasteOrder = { ...wasteOrder };
            expectedWasteOrder.id = ctx.stub.getCreator().getMspid() + '-' + wasteOrder.id;
            expectedWasteOrder.originatorMSPID = ctx.stub.getCreator().getMspid();
            const date = new Date(0);
            date.setSeconds(ctx.stub.getTxTimestamp().getSeconds(), ctx.stub.getTxTimestamp().getNanos() / 1000000);
            expectedWasteOrder.lastChanged = date;
            expectedWasteOrder.lastChangedByMSPID = ctx.stub.getCreator().getMspid();
            expectedWasteOrder.wasteOrderPrivateId = expectedWasteOrder.id + '-' + ctx.stub.getTxID();
            delete expectedWasteOrder.rejectionMessage;

            await contract.commissionWasteOrder(ctx, wasteOrder.id, JSON.stringify(wasteOrderPublic as WasteOrderPublic)).should.eventually.deep.equal(expectedWasteOrder);
        });

        it('Should throw an error when Waste Order Public Schema is violated', async () => {
            const wasteOrder = getTestWasteOrder();

            const wasteOrderPrivate: WasteOrderPrivate = getWasteOrderPrivateFromWasteOrder(wasteOrder);

            delete wasteOrderPrivate.id;
            delete wasteOrderPrivate.lastChanged;
            delete wasteOrderPrivate.lastChangedByMSPID;
            delete wasteOrderPrivate.rejectionMessage;

            ctx.stub.getTransient.returns(getTransientMapFromWasteOrderPrivate(wasteOrderPrivate as WasteOrderPrivate));

            const wasteOrderPublic = {
                id: wasteOrder.id,
                subcontractorMSPID: wasteOrder.subcontractorMSPID,
            };

            const expectedWasteOrder = { ...wasteOrder };
            expectedWasteOrder.id = ctx.stub.getCreator().getMspid() + '-' + wasteOrder.id;
            expectedWasteOrder.originatorMSPID = ctx.stub.getCreator().getMspid();
            const date = new Date(0);
            date.setSeconds(ctx.stub.getTxTimestamp().getSeconds(), ctx.stub.getTxTimestamp().getNanos() / 1000000);
            expectedWasteOrder.lastChanged = date;
            expectedWasteOrder.lastChangedByMSPID = ctx.stub.getCreator().getMspid();
            expectedWasteOrder.wasteOrderPrivateId = expectedWasteOrder.id + '-' + ctx.stub.getTxID();
            delete expectedWasteOrder.rejectionMessage;

            await contract.commissionWasteOrder(ctx, wasteOrder.id, JSON.stringify(wasteOrderPublic as WasteOrderPublic)).should.eventually.rejectedWith(/is not allowed/);
        });

        it('Should throw an error when Waste Order Public Schema is violated', async () => {
            const wasteOrder = getTestWasteOrder();

            const wasteOrderPrivate: WasteOrderPrivate = getWasteOrderPrivateFromWasteOrder(wasteOrder);

            delete wasteOrderPrivate.id;
            delete wasteOrderPrivate.lastChanged;
            delete wasteOrderPrivate.lastChangedByMSPID;
            delete wasteOrderPrivate.rejectionMessage;
            delete wasteOrderPrivate.customerName;

            ctx.stub.getTransient.returns(getTransientMapFromWasteOrderPrivate(wasteOrderPrivate as WasteOrderPrivate));

            const wasteOrderPublic = {
                subcontractorMSPID: wasteOrder.subcontractorMSPID,
            };

            const expectedWasteOrder = { ...wasteOrder };
            expectedWasteOrder.id = ctx.stub.getCreator().getMspid() + '-' + wasteOrder.id;
            expectedWasteOrder.originatorMSPID = ctx.stub.getCreator().getMspid();
            const date = new Date(0);
            date.setSeconds(ctx.stub.getTxTimestamp().getSeconds(), ctx.stub.getTxTimestamp().getNanos() / 1000000);
            expectedWasteOrder.lastChanged = date;
            expectedWasteOrder.lastChangedByMSPID = ctx.stub.getCreator().getMspid();
            expectedWasteOrder.wasteOrderPrivateId = expectedWasteOrder.id + '-' + ctx.stub.getTxID();
            delete expectedWasteOrder.rejectionMessage;

            await contract.commissionWasteOrder(ctx, wasteOrder.id, JSON.stringify(wasteOrderPublic as WasteOrderPublic)).should.eventually.rejectedWith(/is required/);
        });

        it('Should throw an error when commissioning Waste Order to yourself', async () => {
            const wasteOrder = getTestWasteOrder();
            wasteOrder.subcontractorMSPID = ctx.stub.getCreator().getMspid();

            const wasteOrderPrivate: WasteOrderPrivate = getWasteOrderPrivateFromWasteOrder(wasteOrder);

            delete wasteOrderPrivate.id;
            delete wasteOrderPrivate.lastChanged;
            delete wasteOrderPrivate.lastChangedByMSPID;
            delete wasteOrderPrivate.rejectionMessage;

            ctx.stub.getTransient.returns(getTransientMapFromWasteOrderPrivate(wasteOrderPrivate as WasteOrderPrivate));

            const wasteOrderPublic = {
                subcontractorMSPID: wasteOrder.subcontractorMSPID,
            };

            await contract.commissionWasteOrder(ctx, wasteOrder.id, JSON.stringify(wasteOrderPublic as WasteOrderPublic)).should.eventually.be.rejectedWith('It is not possible to commision a Waste Order to yourself.');
        });

        it('Should throw an error if Waste Order already exists', async () => {
            const wasteOrder = getTestWasteOrder();

            const expectedWasteOrder = { ...wasteOrder };
            expectedWasteOrder.id = ctx.stub.getCreator().getMspid() + '-' + wasteOrder.id;

            ctx.stub.getState.withArgs(expectedWasteOrder.id).resolves(Buffer.from(JSON.stringify(expectedWasteOrder)));

            const wasteOrderPrivate: WasteOrderPrivate = getWasteOrderPrivateFromWasteOrder(wasteOrder);

            delete wasteOrderPrivate.id;
            delete wasteOrderPrivate.lastChanged;
            delete wasteOrderPrivate.lastChangedByMSPID;
            delete wasteOrderPrivate.rejectionMessage;

            ctx.stub.getTransient.returns(getTransientMapFromWasteOrderPrivate(wasteOrderPrivate as WasteOrderPrivate));

            const wasteOrderPublic = {
                subcontractorMSPID: wasteOrder.subcontractorMSPID,
            };

            await contract.commissionWasteOrder(ctx, wasteOrder.id, JSON.stringify(wasteOrderPublic as WasteOrderPublic)).should.eventually.be.rejectedWith(`The order ${expectedWasteOrder.id} already exists`);
        });

    });

    /* describe('#createWasteOrder', () => {

         it('should create a order', async () => {
             await contract.createWasteOrder(ctx, '1003', 'order 1003 value');
             ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"order 1003 value"}'));
         });

         it('should throw an error for a order that already exists', async () => {
             await contract.createWasteOrder(ctx, '1001', 'myvalue').should.be.rejectedWith(/The order 1001 already exists/);
         });

     });

     describe('#getWasteOrder', () => {

         it('should return a order', async () => {
             await contract.getWasteOrder(ctx, '1001').should.eventually.deep.equal({ value: 'order 1001 value' });
         });

         it('should throw an error for a order that does not exist', async () => {
             await contract.getWasteOrder(ctx, '1003').should.be.rejectedWith(/The order 1003 does not exist/);
         });

     });

     describe('#updateWasteOrder', () => {

         it('should update a order', async () => {
             await contract.updateWasteOrder(ctx, '1001', 'order 1001 new value');
             ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"order 1001 new value"}'));
         });

         it('should throw an error for a order that does not exist', async () => {
             await contract.updateWasteOrder(ctx, '1003', 'order 1003 new value').should.be.rejectedWith(/The order 1003 does not exist/);
         });

     });

     describe('#deleteWasteOrder', () => {

         it('should delete a order', async () => {
             await contract.deleteWasteOrder(ctx, '1001');
             ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
         });

         it('should throw an error for a order that does not exist', async () => {
             await contract.deleteWasteOrder(ctx, '1003').should.be.rejectedWith(/The order 1003 does not exist/);
         });

     });
    */

});
