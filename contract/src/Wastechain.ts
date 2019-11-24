import * as shim from "fabric-shim";
import { WasteOrderPrivate } from "./model/WasteOrderPrivate";
import { WasteOrderContract } from "./WasteOrderContract";
import { func } from "@hapi/joi";
import { WasteOrderPublic } from "./model/WasteOrderPublic";

class Wastechain implements shim.ChaincodeInterface {
    async Init(stub: shim.ChaincodeStub): Promise<shim.ChaincodeResponse> {
        // use the instantiate input arguments to decide initial chaincode state values

        // save the initial states
        await stub.putState("test", Buffer.from("hallo test"));

        return shim.success(Buffer.from('Initialized Successfully!'));
    }

    async Invoke(stub: shim.ChaincodeStub): Promise<shim.ChaincodeResponse> {
        const wasteOrderContract = new WasteOrderContract(stub, stub.getCreator());

        const transient: any = stub.getTransient();
        let wasteOrderPrivate: WasteOrderPrivate;

        if (transient.size === 1) {
            const transientBuffer = new Buffer(transient.map.order.value.toArrayBuffer());
            wasteOrderPrivate = JSON.parse(transientBuffer.toString('utf-8'));
        }

        const { fcn, params } = stub.getFunctionAndParameters();

        let orderId = params[0];
        let wasteOrderPublic: WasteOrderPublic;
        if (params.length === 2) {
            let wasteOrderPublicValue = params[1];
            wasteOrderPublic = JSON.parse(wasteOrderPublicValue);
            return shim.success(Buffer.from(JSON.stringify(wasteOrderPublic)));
        }

        switch (fcn) {
            case "commissionWasteOrder":
                const wasteOrder = await wasteOrderContract.commissionWasteOrder(orderId, wasteOrderPublic, wasteOrderPrivate);
                return shim.success(Buffer.from(JSON.stringify(wasteOrder)));
            case "identity":
                let value = stub.getCreator().getMspid()
                return shim.success(Buffer.from(value));
        }
        // if (functionName === "read") {
        //     let publicBuffer = await stub.getState("wasteorder1");
        //     let privateBuffer = await stub.getPrivateData("OrderingOrgMSP-SubcontractorOrgMSP", "wasteorder1");

        //     return shim.success(Buffer.from(publicBuffer.toString() + "; " + privateBuffer.toString()));
        // } else if (functionName === "identity") {
        // } else {
        //     const wasteOrderBuffer = Buffer.from("hallo ich bin Public");
        //     await stub.putState("wasteorder1", wasteOrderBuffer);

        //     const wasteOrderPrivateBuffer = Buffer.from("{Hallo ich bin Private");
        //     await stub.putPrivateData("OrderingOrgMSP-SubcontractorOrgMSP", "wasteorder1", wasteOrderPrivateBuffer);

        //     console.log(stub.getCreator().getMspid());

        //     return shim.success(Buffer.from("Es hat geklappt"));
        // }
    }
};

shim.start(new Wastechain());