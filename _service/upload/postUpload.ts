// An example of using 'request' function

import { request } from "~/_service/http/request";
import { ApiSuccessResponse } from "~/_service/http/schema";
import { PostReport } from "./interface";

export const postReport = (data: object, submit: boolean): Promise<ApiSuccessResponse<PostReport>> => {
  return request({
    url: `/v1/laporan?auto_submit=${submit}`,
    method: 'POST',
    skipAuthToken: false,
    body: data
  })
}


export const updateReport = (data: object, id: string, submit: boolean): Promise<ApiSuccessResponse<PostReport>> => {
  return request({
    url: `/v1/laporan/${id}?auto_submit=${submit}`,
    method: 'PUT',
    skipAuthToken: false,
    body: data
  })
}

export const revisionReport = (id: string): Promise<ApiSuccessResponse<any>> => {
  return request({
    url: `/v1/laporan/${id}/request-update`,
    method: 'PUT',
    skipAuthToken: false,
  })
}