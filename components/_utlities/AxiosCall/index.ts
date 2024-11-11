import { getAuthData } from "@/redux/actions/auth-action";
import Axios from "axios";

interface IAxiosCall {
    method?: string;
    url: string;
    data?: any;
}

const BASE_URL = process.env.BASE_URL;

const API = Axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Get Auth Data
const authData = getAuthData();

const AxiosCall = ({ method = 'get', url, data = null }: IAxiosCall) => {
    const headers = authData ? { ...API.defaults.headers, Authorization: `Bearer ${authData.accessToken}` } : API.defaults.headers;

    return API({method, url, data, headers})
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export default AxiosCall;