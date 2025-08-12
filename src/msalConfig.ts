import type { Configuration } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_MSAL_CLIENT_ID || '';

function computeRedirectBase(): string {
  try {
    const { origin, pathname } = window.location;
    // Remove filename if present and ensure trailing slash
    const directory = pathname.replace(/[^/]*$/, '');
    return origin + directory;
  } catch {
    return window.location.origin + '/';
  }
}

const redirectBase = computeRedirectBase();

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