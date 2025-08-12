import type { Configuration } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_MSAL_CLIENT_ID || '';
const redirectBase = window.location.origin + (import.meta.env.BASE_URL || '/');

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: redirectBase,
    postLogoutRedirectUri: redirectBase,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level === LogLevel.Error) console.error(message);
      },
      logLevel: LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'Files.ReadWrite.All'],
};