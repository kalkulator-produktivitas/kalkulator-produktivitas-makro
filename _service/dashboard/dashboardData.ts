// An example of using 'request' function

import { request } from "~/_service/http/request";
import { ApiSuccessResponse } from "~/_service/http/schema";
import { GetDashboard } from "./interface";

export const getDashboardApi = (start: number, end: number, id_provinsi: string): Promise<ApiSuccessResponse<any>> => {
    // console.log(`/v1/makro/data?id_provinsi=${id_provinsi}&tahun_start=${start}&tahun_end=${end}`);
    
    return request({
        url: `/v1/makro/data?id_provinsi=${id_provinsi}&tahun_start=${start}&tahun_end=${end}`,
        method: 'GET',
        skipAuthToken: false
    })
}
