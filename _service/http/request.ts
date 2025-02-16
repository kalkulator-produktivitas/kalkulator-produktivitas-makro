const global = useRuntimeConfig();
import { ErrorApiResponse, ErrorUnauthorized } from "./schema";

export const API_BASE_URL: string = global.public.goURL || 'http://localhost:8000';
export const USER_AUTH_LOCAL_KEY: string = 'auth';
export const ADMIN_AUTH_LOCAL_KEY: string = 'admin';

const route = useRoute()

export const getAuthToken = (): string => {
  try {
    const local = localStorage.getItem(USER_AUTH_LOCAL_KEY);
    if (!local) return '';

    // TODO: should be changed to only storing JWT token
    return (JSON.parse(local).token as string).replace("Bearer ", "");
  } catch (e) {
    return '';
  }
}

export const getAdminToken = (): string => {
  try {
    const local = localStorage.getItem(ADMIN_AUTH_LOCAL_KEY);
    if (!local) return '';

    // TODO: should be changed to only storing JWT token
    return (JSON.parse(local).token as string).replace("Bearer ", "");
  } catch (e) {
    return '';
  }
}

export interface RequestOptions {
  url: string; // no need to include API_BASE_URL
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any; // body, if present, should be an object in methods other than GET
  additionalHeaders?: { [key: string]: string };
  skipAuthToken?: boolean;
  adminAuth?: boolean;
  contentType?: string;
}

export const request = async (options: RequestOptions) => {
  let fullUrl: string = API_BASE_URL;
  if (!fullUrl.endsWith('/')) {
    fullUrl += '/'
  }
  let path = options.url;
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  fullUrl = API_BASE_URL + options.url;

  if (options.url.includes('http') || options.url.includes('https')) {
    fullUrl = options.url;
  }
  let withAuth: boolean = !options.skipAuthToken;

  // Preparing HTTP request with auth
  let token = getAuthToken();
  if (options.adminAuth) token = getAdminToken()

  let myHeaders = {
    'Content-Type': '',
    'Authorization': ''
  }

  if (options.contentType) {
    // Don't set Content-Type for multipart/form-data
    if (options.contentType !== 'multipart/form-data') {
      myHeaders['Content-Type'] = options.contentType
    }
  } else {
    myHeaders['Content-Type'] = 'application/json'
  }

  if (withAuth && token) {
    myHeaders['Authorization'] = `Bearer ${token}`
  }
  let opts: HeadersInit = {
    method: options.method ?? 'GET',
    ...options.additionalHeaders,
    headers: myHeaders
  };

  console.log(options.body);
  

  if (options.body) {
    if (options.contentType === 'multipart/form-data' || options.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      opts.body = options.body; // Don't stringify for multipart/form-data
      // Remove Content-Type header for FormData
      delete myHeaders['Content-Type'];
    } else {
      opts.body = JSON.stringify(options.body);
    }
  }

  const httpResponse = await fetch(fullUrl, opts);




  // Always throw error whenever HTTP response status >= 400
  if (httpResponse.status >= 400) {
    // Special case loging out user
    if (httpResponse.status === 401) {
      let mainPath = route.path.split("/")[1]
      if (mainPath === "app") {
        localStorage.removeItem("auth")
        reloadNuxtApp({
          path: "/app/login",
          ttl: 100,
        });
      }
      else if (mainPath === "admin") {
        localStorage.removeItem("admin")
        reloadNuxtApp({
          path: "/admin/login",
          ttl: 100,
        });
      }
    }
    const errorBody = await httpResponse.json();
    throw new ErrorApiResponse(errorBody);
  }

  // Return JSON body
  const body = await httpResponse.json();
  return body;
}