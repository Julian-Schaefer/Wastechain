import * as Joi from '@hapi/joi';
import { getFabricConnection } from "../FabricConnection";
import { WasteOrderCommissionSchema, WasteOrderCorrectionSchema, WasteOrderRejectSchema, WasteOrderCompleteSchema, WasteOrder, WasteOrderStatus, WasteOrderUpdateStatusSchema } from './WasteOrder';
import { WasteOrderTransaction } from './WasteOrderTransaction';
import { TransientMap } from 'fabric-network';
import { WasteOrderPublic } from './WasteOrderPublic';
import { WasteOrderPrivate } from './WasteOrderPrivate';
import * as FabricClient from 'fabric-client';

async function getWasteOrder(wasteOrderId: string): Promise<WasteOrder> {
    const contract = getFabricConnection().wasteOrderContract;
    const wasteOrderBuffer = await contract.evaluateTransaction('getWasteOrder', wasteOrderId);
    const wasteOrder: WasteOrder = JSON.parse(wasteOrderBuffer.toString('utf-8'));
    return wasteOrder;
}

async function getWasteOrderHistory(wasteOrderId: string): Promise<WasteOrderTransaction[]> {
    let contract = await getFabricConnection().wasteOrderContract;
    let result = await contract.evaluateTransaction('getWasteOrderHistory', wasteOrderId);

    let history: WasteOrderTransaction[] = JSON.parse(result.toString('utf-8'));
    return history;
}

async function commissionWasteOrder(wasteOrderId: string, wasteOrderPublic: WasteOrderPublic, wasteOrderPrivate: WasteOrderPrivate): Promise<WasteOrder> {
    delete (wasteOrderPublic.id);
    delete (wasteOrderPublic.originatorMSPID);

    delete (wasteOrderPrivate.id);
    delete (wasteOrderPrivate.status);
    delete (wasteOrderPrivate.rejectionMessage);

    const commissionedWasteOrderBuffer = await submitWasteOrderTransaction("commissionWasteOrder", wasteOrderId, wasteOrderPublic, wasteOrderPrivate);
    const commissionedWasteOrder: WasteOrder = JSON.parse(commissionedWasteOrderBuffer.toString('utf-8'));

    console.log('Commissioned Waste Order with ID: ' + commissionedWasteOrder.id);
    return commissionedWasteOrder;
}

async function updateWasteOrder(wasteOrderId: string, procedure: string, wasteOrderPublic?: WasteOrderPublic, wasteOrderPrivate?: WasteOrderPrivate): Promise<WasteOrder> {
    const contract = await getFabricConnection().wasteOrderContract;

    let transaction = contract.createTransaction(procedure);
    if (wasteOrderPrivate !== undefined) {
        delete wasteOrderPrivate.status;
        const transientData: TransientMap = {
            order: Buffer.from(JSON.stringify(wasteOrderPrivate))
        };
        transaction.setTransient(transientData);
    }

    let submittedWasteOrderBuffer: Buffer;
    if (wasteOrderPublic !== undefined) {
        submittedWasteOrderBuffer = await submitWasteOrderTransaction(procedure, wasteOrderId, wasteOrderPublic);
    } else {
        submittedWasteOrderBuffer = await submitWasteOrderTransaction(procedure, wasteOrderId);
    }

    const submittedWasteOrder: WasteOrder = JSON.parse(submittedWasteOrderBuffer.toString('utf-8'));
    console.log('Updated Contract with ID: ' + wasteOrderId);
    return submittedWasteOrder;
}

async function getWasteOrdersForSubcontractorWithStatus(status: string): Promise<Buffer> {
    let MSPID = getFabricConnection().client.getMspid();
    let contract = await getFabricConnection().wasteOrderContract;
    let wasteOrdersBuffer = await contract.evaluateTransaction('getWasteOrdersForSubcontractorWithStatus', MSPID, status);

    console.log('Retrieved Waste Orders with status ' + status + ' for Subcontractor: ' + MSPID);
    return wasteOrdersBuffer;
}

async function getWasteOrdersForOriginatorWithStatus(status: string): Promise<Buffer> {
    let MSPID = getFabricConnection().client.getMspid();
    let contract = await getFabricConnection().wasteOrderContract;
    let wasteOrdersBuffer = await contract.evaluateTransaction('getWasteOrdersForOriginatorWithStatus', MSPID, status);

    console.log('Retrieved Waste Orders with status ' + status + ' for Originator: ' + MSPID);
    return wasteOrdersBuffer;
}

async function submitWasteOrderTransaction(fcn: string, wasteOrderId: string, wasteOrderPublic?: WasteOrderPublic, wasteOrderPrivate?: WasteOrderPrivate): Promise<Buffer> {
    let originatorMSPID: string;
    let subcontractorMSPID: string;

    if (wasteOrderPublic) {
        originatorMSPID = wasteOrderPublic.originatorMSPID;
        subcontractorMSPID = wasteOrderPublic.subcontractorMSPID;
    } else {
        const wasteOrder = await getWasteOrder(wasteOrderId);
        originatorMSPID = wasteOrder.originatorMSPID;
        subcontractorMSPID = wasteOrder.subcontractorMSPID;
    }

    const channel = getFabricConnection().channel;
    const clientMSPID = getFabricConnection().client.getMspid();

    let targetPeers: FabricClient.Peer[] = [];
    targetPeers = getPeersFromChannelPeers(channel.getPeersForOrg(clientMSPID));

    if (originatorMSPID && originatorMSPID !== clientMSPID) {
        targetPeers = targetPeers.concat(getPeersFromChannelPeers(channel.getPeersForOrg(originatorMSPID)));
    }

    if (subcontractorMSPID && subcontractorMSPID !== clientMSPID) {
        targetPeers = targetPeers.concat(getPeersFromChannelPeers(channel.getPeersForOrg(subcontractorMSPID)));
    }

    let args: string[];
    if (wasteOrderPublic) {
        args = [wasteOrderId, JSON.stringify(wasteOrderPublic)];
    } else {
        args = [wasteOrderId];
    }

    let transientData: TransientMap;
    if (wasteOrderPrivate) {
        transientData = {
            order: Buffer.from(JSON.stringify(wasteOrderPrivate))
        };
    }

    return getFabricConnection().submitTransaction(fcn, args, targetPeers, transientData);
}

function getPeersFromChannelPeers(channelPeers: FabricClient.ChannelPeer[]): FabricClient.Peer[] {
    let peers: FabricClient.Peer[] = [];
    for (let channelPeer of channelPeers) {
        peers.push(channelPeer.getPeer());
    }

    return peers;
}

export {
    getWasteOrder,
    getWasteOrderHistory,
    commissionWasteOrder,
    updateWasteOrder,
    getWasteOrdersForSubcontractorWithStatus,
    getWasteOrdersForOriginatorWithStatus
};