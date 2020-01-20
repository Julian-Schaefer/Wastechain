import axios, { AxiosRequestConfig } from 'axios';

let config: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_API_URL
};

async function get(path: string): Promise<any> {
    try {
        let response = await axios.get(path, config);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }

        throw error;
    }
}

async function post(path: string, body: any): Promise<any> {
    try {
        let response = await axios.post(path, body, config);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }

        throw error;
    }
}

async function put(path: string, body: any): Promise<any> {
    try {
        let response = await axios.put(path, body, config);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }

        throw error;
    }
}

export {
    get,
    post,
    put
};