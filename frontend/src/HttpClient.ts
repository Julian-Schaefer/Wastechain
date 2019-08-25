import axios, { AxiosRequestConfig } from 'axios';
import { WasteOrder } from './waste-order/WasteOrder';

let config: AxiosRequestConfig = {
    baseURL: 'http://localhost:3000'
};

async function get(path: string): Promise<any> {
    try {
        let response = await axios.get(path, config);
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function post(path: string, body: any): Promise<any> {
    try {
        let response = await axios.post(path, body, config);
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {
    get,
    post
};