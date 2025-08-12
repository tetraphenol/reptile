import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import type { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { loginRequest } from './msalConfig';

export function createGraphClient(msalInstance: IPublicClientApplication, account: AccountInfo) {
  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account,
        });
        return response.accessToken;
      },
    },
  });
}