// An example of using 'request' function

import { request } from "~/_service/http/request";
import { ApiSuccessResponse } from "~/_service/http/schema";

export const getProvince = (): Promise<ApiSuccessResponse<any>> => {
  return request({
    url: `/v1/makro/provinsi`,
    method: 'GET',
    skipAuthToken: true
  })
}

export const getCity = (id_provinsi: string): Promise<ApiSuccessResponse<any>> => {
  return request({
    url: `/v1/makro/kota/${id_provinsi}`,
    method: 'GET',
    skipAuthToken: true
  })
}
