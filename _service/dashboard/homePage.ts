// An example of using 'request' function

import { request } from "~/_service/http/request";
import { ApiSuccessResponse } from "~/_service/http/schema";
import { GetDataPerusahaan, GetDataUser, GetSummaryHome, GetListLaporan } from "./interface";

export const getPerusahaanApi = (): Promise<ApiSuccessResponse<GetDataPerusahaan>> => {
    return request({
        url: '/v1/perusahaan',
        method: 'GET',
        skipAuthToken: false
    })
}

export const getUserApi = (): Promise<ApiSuccessResponse<GetDataUser>> => {
    return request({
        url: '/v1/pengguna/me',
        method: 'GET',
        skipAuthToken: false
    })
}

export const summaryApi = (): Promise<ApiSuccessResponse<GetSummaryHome>> => {
    return request({
        url: '/v1/analisis/summary',
        method: 'GET',
        skipAuthToken: false
    })
}

export const listLaporanApi = (): Promise<ApiSuccessResponse<GetListLaporan>> => {
    return request({
        url: '/v1/laporan?page=1&size=15',
        method: 'GET',
        skipAuthToken: false
    })
}