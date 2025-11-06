import axios from 'axios';
import AxiosResponse from 'axios';
import {GetTotalCountResponse} from "../models/GetTotalCountResponse.ts";
import {GetTotalCountResponseByDay} from "../models/GetTotalCountByDayResponse.ts";


const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getShortUrl: (x: string) => Promise<AxiosResponse<string>> = (targetUrl: string) => {
    return api.put("/api/urls", { targetUrl });
}

export const getTotalCount: () => Promise<AxiosResponse<GetTotalCountResponse>> = () => api.put("/api/analytics/clicks");

export const getTotalCountByDay: () => Promise<AxiosResponse<GetTotalCountResponseByDay>> = () => api.put("/api/analytics/clicks/day");
