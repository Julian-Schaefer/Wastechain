import { getFabricConnection } from "../FabricConnection";
import { Information } from './Information';

async function getInformation(): Promise<Information> {
    const MSPID = getFabricConnection().client.getMspid();
    const user = await getFabricConnection().client.getUserContext(null);

    return {
        organisationMSPID: MSPID,
        username: user.getName()
    };
}

export {
    getInformation
};