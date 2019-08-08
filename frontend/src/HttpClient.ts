import axios, { AxiosRequestConfig } from 'axios';
import { WasteOrder } from './model/WasteOrder';

let config: AxiosRequestConfig = {
    baseURL: 'http://wastechain-fabric.westeurope.cloudapp.azure.com:3000'
};

async function get(path: string): Promise<WasteOrder[]> {
    try {
        let response = await axios.get(path, config);
        console.log(response);
        return response.data as WasteOrder[];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {
    get
};