// An example of using 'request' function

import { request } from "~/_service/http/request";
import { ApiSuccessResponse } from "~/_service/http/schema";
import { GetDashboard } from "./interface";

export const getDashboardApi = (start: number, end: number): Promise<ApiSuccessResponse<GetDashboard>> => {
    return request({
        url: `/v1/analisis?start_year=${start}&end_year=${end}`,
        method: 'GET',
        skipAuthToken: false
    })
}
