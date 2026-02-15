// @ts-nocheck

const EXTENSION_ID = 'dlnlihadjbnccjanmeciijclgnhaknfm'; // Your extension ID

export const syncAuthWithExtension = (token, refreshToken, user) => {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    try {
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        { action: 'setAuthToken', token, refreshToken, user },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log('Extension not installed or not responding');
          } else if (response && response.success) {
            console.log('Successfully synced auth with extension');
          }
        }
      );
    } catch (error) {
      console.log('Extension communication error:', error);
    }
  }
};
