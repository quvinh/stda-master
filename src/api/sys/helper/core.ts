import { ContentTypeEnum } from '@/enums/httpEnum';
import { AxiosHeaders } from 'axios';
import { loadEnv } from 'vite';

/**
 * @description: enum api handshake
 */
// enum Api {
//   Handshake = '/auth/handshake',
// }

export function getHandshakeToken(): string {
  // const config = getAppEnvConfig();
  // let token = `${config.APP_SECRET}${config.APP_IDENTIFIER}`;
  // token = await hash(token, 10);
  // token = token.replace('$2b', '$2y');
  return `IAP $2y$10$9PNd26xGrS7L5OTwziVe.ec8b455mH5qMuuJHTAcP3swwmr9ctTE`;
}

export function getDefaultAxiosOption(token: string | undefined) {
  const headers = new AxiosHeaders();
  headers.set('Accept', 'application/vnd.api+json');
  headers.set('Content-Type', 'application/vnd.api+json');
  if (token !== undefined) {
    headers.set('Authorization', token);
  }
  return headers;
}

export function getMultipartAxiosOption(token: string | undefined) {
  const headers = new AxiosHeaders();
  headers.set('Content-Type', ContentTypeEnum.FORM_DATA);
  if (token !== undefined) {
    headers.set('Authorization', token);
  }
  return headers;
}

// export function getDefaultAxiosOptionUpload(token: string | undefined = undefined) {
//   const headers: AxiosRequestHeaders = {};
//   headers.Accept = 'application/vnd.api+json';
//   headers['Content-Type'] = ContentTypeEnum.FORM_DATA;
//   headers['X-LANG'] = 'vi';
//   headers['X-IDENTIFIER'] = 'demo';
//   // @ts-ignore
//   headers.ignoreCancelToken = true;
//   if (token !== undefined) {
//     headers.Authorization = token;
//   }
//   return headers;
// }

// export async function getApiCoreToken(tkType: TokenTypes): Promise<any | undefined> {
//   // let retToken: string | undefined = '';
//   let hsk: string | undefined = '';
//   switch (tkType) {
//     case TokenTypes.HANDSHAKE_TOKEN:
//       return getHandshakeToken();
//     case TokenTypes.LOGIN_TOKEN:
//       hsk = getHandshakeToken();
//       const config: AxiosRequestConfig<any> = {
//         headers: getDefaultAxiosOption(hsk),
//         url: Api.Handshake,
//       };
//       return defHttp.get<any>(config, { errorMessageMode: 'none' });
//     default:
//       return undefined;
//   }
// }
