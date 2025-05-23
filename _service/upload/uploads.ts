// An example of using 'request' function

import { request } from "~/_service/http/request";
import { ApiSuccessResponse } from "~/_service/http/schema";

export const getUploadsList = (): Promise<ApiSuccessResponse<any>> => {
  return request({
    url: `/v1/makro/files`,
    method: 'GET',
    skipAuthToken: true
  })
}

export const postUpload = (formData: any, id_provinsi: string): Promise<ApiSuccessResponse<any>> => {
  return request({
    url: `/v1/makro/files?id_provinsi=${id_provinsi}`,
    method: 'POST',
    skipAuthToken: true,
    contentType: 'multipart/form-data',
    body: formData
  })
}

export const getTemplate = (): Promise<ApiSuccessResponse<any>> => {
  return request({
    url: `/v1/makro/files/template?id_provinsi=dki_jakarta`,
    method: 'GET',
    skipAuthToken: true,
    contentType: 'multipart/form-data'
  })
}
