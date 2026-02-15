// ContentCraft AI Extension Background Script

const API_BASE_URL = 'http://localhost:5000/api';
const WEB_APP_URL = 'http://localhost:5173';

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('ContentCraft AI Extension installed');
    
    // Set default settings
    chrome.storage.local.set({
      settings: {
        autoSuggest: true,
        showNotifications: true,
        defaultPlatform: 'twitter',
        defaultTone: 'professional'
      },
      recentGenerations: []
    });

    // Open welcome page with extension source parameter
    chrome.tabs.create({
      url: `${WEB_APP_URL}?source=extension`
    });
  }
});

// Listen for messages from web app to receive auth token
// Listen for messages from web app to receive auth token
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log('Received external message:', request); // Add this for debugging
  
  if (request.action === 'setAuthToken') {
    chrome.storage.local.set({
      token: request.token,
      refreshToken: request.refreshToken,
      user: request.user,
      isAuthenticated: true // Add this flag
    }, () => {
      console.log('Auth token stored successfully:', {
        hasToken: !!request.token,
        hasRefreshToken: !!request.refreshToken,
        user: request.user
      });
      
      // Notify popup to update UI
      chrome.runtime.sendMessage({ 
        action: 'authUpdated',
        user: request.user 
      }).catch((err) => {
        console.log('Popup not open:', err);
      });
      
      sendResponse({ success: true });
    });
    return true; // Important: keeps the message channel open
  }
});
// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'generateContent':
      handleGenerateContent(request.data, sendResponse);
      return true;
    
    case 'improveText':
      handleImproveText(request.data, sendResponse);
      return true;
    
    case 'generateHashtags':
      handleGenerateHashtags(request.data, sendResponse);
      return true;
    
    case 'predictVirality':
      handlePredictVirality(request.data, sendResponse);
      return true;
    
    case 'getTrendingTopics':
      handleGetTrendingTopics(sendResponse);
      return true;
    
    case 'checkAuth':
      handleCheckAuth(sendResponse);
      return true;
    
    case 'saveToLibrary':
      handleSaveToLibrary(request.data, sendResponse);
      return true;
    
    case 'openWebAppLogin':
      handleOpenWebAppLogin();
      break;
    
    case 'logout':
      handleLogout(sendResponse);
      return true;
  }
});

// Open web app for login
function handleOpenWebAppLogin() {
  chrome.tabs.create({
    url: `${WEB_APP_URL}/login?source=extension&redirect=close`
  });
}

// Handle logout
async function handleLogout(sendResponse) {
  try {
    await chrome.storage.local.remove(['token', 'refreshToken', 'user']);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Refresh token if expired
async function refreshAuthToken() {
  try {
    const storage = await chrome.storage.local.get(['refreshToken']);
    const refreshToken = storage.refreshToken;
    
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const result = await response.json();
      await chrome.storage.local.set({
        token: result.data.accessToken,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

// Handle content generation
async function handleGenerateContent(data, sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated', needsAuth: true });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    // Handle token expiration
    if (response.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        return handleGenerateContent(data, sendResponse);
      } else {
        sendResponse({ success: false, error: 'Session expired', needsAuth: true });
        return;
      }
    }

    const result = await response.json();
    sendResponse({ success: response.ok, data: result.data });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Handle text improvement
async function handleImproveText(data, sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated', needsAuth: true });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt: `Improve this text: ${data.text}`,
        platform: data.platform || 'twitter',
        tone: data.tone || 'professional',
        type: 'social'
      })
    });

    if (response.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) return handleImproveText(data, sendResponse);
      sendResponse({ success: false, error: 'Session expired', needsAuth: true });
      return;
    }

    const result = await response.json();
    sendResponse({ success: response.ok, data: result.data });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Handle hashtag generation
async function handleGenerateHashtags(data, sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated', needsAuth: true });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/ai/hashtags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: data.content })
    });

    if (response.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) return handleGenerateHashtags(data, sendResponse);
      sendResponse({ success: false, error: 'Session expired', needsAuth: true });
      return;
    }

    const result = await response.json();
    sendResponse({ success: response.ok, data: result.data });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Handle virality prediction
async function handlePredictVirality(data, sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated', needsAuth: true });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/ai/predict-virality`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: data.content,
        platform: data.platform
      })
    });

    if (response.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) return handlePredictVirality(data, sendResponse);
      sendResponse({ success: false, error: 'Session expired', needsAuth: true });
      return;
    }

    const result = await response.json();
    sendResponse({ success: response.ok, data: result.data });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Handle trending topics
async function handleGetTrendingTopics(sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated', needsAuth: true });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/trends/live`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) return handleGetTrendingTopics(sendResponse);
      sendResponse({ success: false, error: 'Session expired', needsAuth: true });
      return;
    }

    const result = await response.json();
    sendResponse({ success: response.ok, data: result.data });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Check authentication status
async function handleCheckAuth(sendResponse) {
  try {
    const storage = await chrome.storage.local.get(['token', 'user']);
    
    if (!storage.token) {
      sendResponse({ authenticated: false });
      return;
    }

    // Verify token with API
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${storage.token}`
      }
    });

    if (response.ok) {
      sendResponse({ authenticated: true, user: storage.user });
    } else if (response.status === 401) {
      // Try to refresh token
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        const newStorage = await chrome.storage.local.get(['user']);
        sendResponse({ authenticated: true, user: newStorage.user });
      } else {
        sendResponse({ authenticated: false });
      }
    } else {
      sendResponse({ authenticated: false });
    }
  } catch (error) {
    sendResponse({ authenticated: false });
  }
}

// Save content to library
async function handleSaveToLibrary(data, sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated', needsAuth: true });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        type: data.type || 'social',
        platform: data.platform,
        tone: data.tone,
        status: 'draft'
      })
    });

    if (response.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) return handleSaveToLibrary(data, sendResponse);
      sendResponse({ success: false, error: 'Session expired', needsAuth: true });
      return;
    }

    const result = await response.json();
    sendResponse({ success: response.ok, data: result.data });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Get auth token from storage
async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['token'], (result) => {
      resolve(result.token);
    });
  });
}

// Context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'contentcraft-improve',
    title: 'Improve with ContentCraft AI',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'contentcraft-hashtags',
    title: 'Generate Hashtags',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'contentcraft-predict',
    title: 'Predict Virality',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  
  if (!selectedText) return;

  switch (info.menuItemId) {
    case 'contentcraft-improve':
      chrome.storage.local.set({ 
        quickAction: { type: 'improve', text: selectedText }
      });
      chrome.action.openPopup();
      break;
    
    case 'contentcraft-hashtags':
      chrome.storage.local.set({ 
        quickAction: { type: 'hashtags', text: selectedText }
      });
      chrome.action.openPopup();
      break;
    
    case 'contentcraft-predict':
      chrome.storage.local.set({ 
        quickAction: { type: 'predict', text: selectedText }
      });
      chrome.action.openPopup();
      break;
  }
});

// Periodic trend checking (every 30 minutes)
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkTrends', { periodInMinutes: 30 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkTrends') {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/trends/live?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        const trends = result.data?.trends || [];
        
        // Store trends for quick access
        chrome.storage.local.set({ recentTrends: trends });

        // Check for high-relevance trends
        const highRelevanceTrends = trends.filter(t => t.relevance > 80);
        if (highRelevanceTrends.length > 0) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Trending Now!',
            message: `${highRelevanceTrends[0].keyword} is trending with high relevance to your audience`
          });
        }
      }
    } catch (error) {
      console.error('Error checking trends:', error);
    }
  }
});