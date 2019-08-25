import axios, { AxiosRequestConfig } from 'axios';

let config: AxiosRequestConfig = {
    baseURL: 'http://localhost:3000'
};

async function get(path: string): Promise<any> {
    try {
        let response = await axios.get(path, config);
        console.log(response);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data);
    }
}

async function post(path: string, body: any): Promise<any> {
    try {
        let response = await axios.post(path, body, config);
        console.log(response);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data);
    }
}

export {
    get,
    post
};