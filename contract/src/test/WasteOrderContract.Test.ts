/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity, SerializedIdentity } from 'fabric-shim';
import { WasteOrderContract } from '..';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as winston from 'winston';
import { EquipmentType } from '../model/Service';
import { WasteOrderPrivate } from '../model/WasteOrderPrivate';
import { getTransientMapFromWasteOrderPrivate } from './TestUtil';

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

    beforeEach(() => {
        contract = new WasteOrderContract();
        ctx = new TestingContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"order 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"order 1002 value"}'));
        ctx.stub.getTxID.returns('TX1');
        ctx.stub.getTxTimestamp.returns({
            getSeconds() { return new Date().getSeconds(); },
            getNanos() { return new Date().getMilliseconds(); },
        });
        ctx.clientIdentity.getMSPID.returns('OrderingOrgMSP');
    });

    describe('#commissionWasteOrder', () => {

        it('should return true for a order', async () => {
            const wasteOrderPrivate: WasteOrderPrivate = {
                id: '',
                description: 'asd',
                customerName: 'afasd',
                service: {
                    description: 'test',
                    description2: '2',
                    equipmentDescription: 'equip',
                    equipmentType: EquipmentType.CLEARANCE,
                    materialDescription: 'mat',
                },
                taskSite: {
                    address: 'asd',
                    address2: 'asd2',
                    areaCode: 'NRW',
                    city: 'Bochum',
                    countryCode: 'DE',
                    name: 'asd',
                    name2: 'name2',
                    postCode: '44787',
                },
                quantity: 2,
                unitPrice: 33,
                unitOfMeasure: 'MG',
                taskDate: '12/12/2020' as unknown as Date,
                startingTime: '13',
                finishingTime: '12',
                referenceNo: 'ASD123',
                rejectionMessage: '',
                lastChanged: new Date(),
                lastChangedByMSPID: '',
            };

            delete wasteOrderPrivate.id;
            delete wasteOrderPrivate.lastChanged;
            delete wasteOrderPrivate.lastChangedByMSPID;
            delete wasteOrderPrivate.rejectionMessage;

            ctx.stub.getTransient.returns(getTransientMapFromWasteOrderPrivate(wasteOrderPrivate as WasteOrderPrivate));

            const wasteOrderPublic = {
                subcontractorMSPID: 'SubcontractorOrgMSP',
            };

            await contract.commissionWasteOrder(ctx, 'ORDER001', JSON.stringify(wasteOrderPublic)).should.eventually.exist;
        });

        it('should return false for a order that does not exist', async () => {
            // await contract.checkWasteOrderExists(ctx, '1003').should.eventually.be.false;
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
