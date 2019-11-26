import * as shim from "fabric-shim";
import { WasteOrderPrivate } from "./model/WasteOrderPrivate";
import { WasteOrderContract } from "./WasteOrderContractUnclean";
import { WasteOrderPublic } from "./model/WasteOrderPublic";
import winston = require("winston");
import { WasteOrder } from "./model/WasteOrder";

class Wastechain implements shim.ChaincodeInterface {

    private logger: winston.Logger;

    async Init(_: shim.ChaincodeStub): Promise<shim.ChaincodeResponse> {
        this.logger = shim.newLogger("Wastechain");
        return shim.success(Buffer.from('Initialized Successfully!'));
    }

    async Invoke(stub: shim.ChaincodeStub): Promise<shim.ChaincodeResponse> {
        try {
            const wasteOrderContract = new WasteOrderContract(stub, stub.getCreator(), this.logger);

            const transient: any = stub.getTransient();
            let wasteOrderPrivate: WasteOrderPrivate;

            if (transient.size === 1) {
                const transientBuffer = new Buffer(transient.map.order.value.toArrayBuffer());
                this.logger.info("Transient Order: " + transientBuffer.toString('utf-8'));
                wasteOrderPrivate = JSON.parse(transientBuffer.toString('utf-8'));
            }

            const { fcn, params } = stub.getFunctionAndParameters();
            this.logger.info("Invoked Chaincode with Function: " + fcn);

            let orderId = params[0];
            let wasteOrderPublic: WasteOrderPublic;
            if (params.length === 2) {
                let wasteOrderPublicValue = params[1];
                this.logger.info("Public Waste Order: " + wasteOrderPublicValue);
                wasteOrderPublic = JSON.parse(wasteOrderPublicValue);
            }

            let wasteOrder: WasteOrder;

            switch (fcn) {
                case "commissionWasteOrder":
                    wasteOrder = await wasteOrderContract.commissionWasteOrder(orderId, wasteOrderPublic, wasteOrderPrivate);
                    break;
                case "getWasteOrder":
                    wasteOrder = await wasteOrderContract.getWasteOrder(orderId);
                    break;
                case "identity":
                    let value = stub.getCreator().getMspid()
                    return shim.success(Buffer.from(value));
            }

            return shim.success(Buffer.from(JSON.stringify(wasteOrder)));
        } catch (error) {
            console.log(error);
            console.log(JSON.stringify(error));

            let isError = function (e: any) {
                return e && e.stack && e.message;
            }

            if (isError(error)) {
                return shim.error(Buffer.from(error.message));
            } else {
                return shim.error(Buffer.from(error));
            }
        }
    }
};

shim.start(new Wastechain());