// src/utils/extensionSync.ts

const EXTENSION_ID = 'dlnlihadjbnccjanmeciijclgnhaknfm'; // Your extension ID

// Declare chrome types for web app
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage: (
          extensionId: string,
          message: any,
          callback: (response: any) => void
        ) => void;
        lastError?: {
          message: string;
        };
      };
    };
  }
}

interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: any;
}

// Promise-based version for better async handling
export const syncAuthWithExtensionPromise = (
  token: string,
  refreshToken: string,
  user: any
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if the extension is installed
    if (
      typeof window === 'undefined' ||
      !window.chrome?.runtime?.sendMessage
    ) {
      console.log('Chrome runtime not available');
      resolve(false);
      return;
    }

    try {
      console.log('Sending auth to extension...', EXTENSION_ID);
      
      window.chrome.runtime.sendMessage(
        EXTENSION_ID,
        {
          action: 'setAuthToken',
          token: token,
          refreshToken: refreshToken,
          user: user,
        },
        (response: { success?: boolean }) => {
          if (window.chrome?.runtime?.lastError) {
            console.log('Extension error:', window.chrome.runtime.lastError.message);
            resolve(false);
          } else if (response?.success) {
            console.log('Successfully synced auth with extension');
            resolve(true);
          } else {
            console.log('Extension responded but without success flag');
            resolve(false);
          }
        }
      );
      
      // Timeout after 3 seconds
      setTimeout(() => {
        console.log('Extension sync timeout');
        resolve(false);
      }, 3000);
      
    } catch (error) {
      console.log('Extension communication error:', error);
      resolve(false);
    }
  });
};

// Original callback-based version (kept for backward compatibility)
export const syncAuthWithExtension = (
  token: string,
  refreshToken: string,
  user: any
): void => {
  syncAuthWithExtensionPromise(token, refreshToken, user);
};

// Call this after successful login
export const onLoginSuccess = (authData: AuthData): void => {
  // Store in localStorage for web app
  localStorage.setItem('token', authData.accessToken);
  localStorage.setItem('refreshToken', authData.refreshToken);
  localStorage.setItem('user', JSON.stringify(authData.user));
  
  // Sync with extension
  syncAuthWithExtension(
    authData.accessToken,
    authData.refreshToken,
    authData.user
  );
};