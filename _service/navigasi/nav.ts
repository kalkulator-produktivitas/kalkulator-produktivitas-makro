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

