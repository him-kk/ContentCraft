// popup.js – FULL Auth + AI + Utilities (NO FEATURE LEFT)

const API_BASE_URL = 'http://localhost:5000/api';
const WEB_APP_URL = 'http://localhost:5173';

/* -------------------- STATE -------------------- */
let recentGenerations = [];

document.addEventListener('DOMContentLoaded', async () => {
  console.log('ContentCraft AI: Popup loaded');

  /* -------------------- DOM ELEMENTS -------------------- */

  // States
  const loadingState = document.getElementById('loadingState');
  const loginState = document.getElementById('loginState');
  const dashboardState = document.getElementById('dashboardState');

  // Auth UI
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const openDashboardBtn = document.getElementById('openDashboardBtn');
  const checkAuthBtn = document.getElementById('checkAuthBtn');

  // User info
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userAvatar = document.getElementById('userAvatar');

  // AI UI
  const promptInput = document.getElementById('prompt-input');
  const platformSelect = document.getElementById('platform-select');
  const toneSelect = document.getElementById('tone-select');
  const generateBtn = document.getElementById('generate-btn');
  const resultSection = document.getElementById('result-section');
  const resultText = document.getElementById('result-text');
  const copyBtn = document.getElementById('copy-btn');
  const insertBtn = document.getElementById('insert-btn');
  const recentList = document.getElementById('recent-list');

  /* -------------------- INIT -------------------- */
  const criticalElements = {
    loadingState,
    loginState,
    dashboardState,
    loginBtn
  };

  for (const [name, element] of Object.entries(criticalElements)) {
    if (!element) {
      console.error(`ContentCraft AI: Missing element: ${name}`);
    }
  }

  try {
    await checkAuth();
    await loadRecentGenerations();
    setupEventListeners();
  } catch (error) {
    console.error('ContentCraft AI: Initialization error:', error);
    showState('login');
  }

  /* -------------------- EVENT LISTENERS -------------------- */
  function setupEventListeners() {
    // Login button
    if (loginBtn) {
      loginBtn.addEventListener('click', () =>
        chrome.runtime.sendMessage({ action: 'openWebAppLogin' })
      );
    }

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        showState('loading');
        await chrome.runtime.sendMessage({ action: 'logout' });
        showState('login');
      });
    }

    // Dashboard button
    if (openDashboardBtn) {
      openDashboardBtn.addEventListener('click', () =>
        chrome.tabs.create({ url: WEB_APP_URL })
      );
    }

    // Check auth button
    if (checkAuthBtn) {
      checkAuthBtn.addEventListener('click', checkAuth);
    }

    // Generate button
    if (generateBtn) {
      generateBtn.addEventListener('click', generateContent);
    }

    // Copy button
    if (copyBtn) {
      copyBtn.addEventListener('click', copyToClipboard);
    }

    // Insert button
    if (insertBtn) {
      insertBtn.addEventListener('click', insertIntoPage);
    }

    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    if (actionButtons.length > 0) {
      actionButtons.forEach(btn =>
        btn.addEventListener('click', handleQuickAction)
      );
    }
  }

  /* -------------------- AUTH -------------------- */
  // async function checkAuth() {
  //   showState('loading');
  //   try {
  //     await attemptTokenSyncFromWebApp();
  //     const res = await chrome.runtime.sendMessage({ action: 'checkAuth' });

  //     if (res?.authenticated && res.user) {
  //       displayUserInfo(res.user);
  //       showState('dashboard');
  //     } else {
  //       showState('login');
  //     }
  //   } catch {
  //     showState('login');
  //   }
  // }

  // async function attemptTokenSyncFromWebApp() {
  //   const tabs = await chrome.tabs.query({ url: `${WEB_APP_URL}/*` });
  //   for (const tab of tabs) {
  //     try {
  //       const [{ result }] = await chrome.scripting.executeScript({
  //         target: { tabId: tab.id },
  //         func: () => ({
  //           token: localStorage.getItem('token'),
  //           refreshToken: localStorage.getItem('refreshToken'),
  //           user: localStorage.getItem('user')
  //         })
  //       });

  //       if (result?.token) {
  //         await chrome.storage.local.set({
  //           token: result.token,
  //           refreshToken: result.refreshToken,
  //           user: result.user ? JSON.parse(result.user) : null
  //         });
  //         return true;
  //       }
  //     } catch {}
  //   }
  //   return false;
  // }
  /* -------------------- AUTH -------------------- */
async function checkAuth() {
  showState('loading');
  try {
    // First check if we already have auth in extension storage
    const storage = await chrome.storage.local.get(['token', 'user', 'isAuthenticated']);
    
    console.log('Checking auth status:', {
      hasToken: !!storage.token,
      hasUser: !!storage.user,
      isAuthenticated: storage.isAuthenticated
    });
    
    // If we have auth data, verify it's still valid
    if (storage.isAuthenticated && storage.token && storage.user) {
      const res = await chrome.runtime.sendMessage({ action: 'checkAuth' });
      
      if (res?.authenticated && res.user) {
        displayUserInfo(res.user);
        showState('dashboard');
        return;
      }
    }
    
    // If not authenticated, try to sync from web app (if tab is open)
    const synced = await attemptTokenSyncFromWebApp();
    
    if (synced) {
      // Recheck after sync
      const res = await chrome.runtime.sendMessage({ action: 'checkAuth' });
      
      if (res?.authenticated && res.user) {
        displayUserInfo(res.user);
        showState('dashboard');
        return;
      }
    }
    
    // Not authenticated
    showState('login');
  } catch (error) {
    console.error('Auth check error:', error);
    showState('login');
  }
}

async function attemptTokenSyncFromWebApp() {
  try {
    const tabs = await chrome.tabs.query({ url: `${WEB_APP_URL}/*` });
    
    console.log('Found web app tabs:', tabs.length);
    
    for (const tab of tabs) {
      try {
        const [{ result }] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => ({
            token: localStorage.getItem('token'),
            refreshToken: localStorage.getItem('refreshToken'),
            user: localStorage.getItem('user')
          })
        });

        console.log('Got data from web app:', {
          hasToken: !!result?.token,
          hasRefreshToken: !!result?.refreshToken,
          hasUser: !!result?.user
        });

        if (result?.token && result?.refreshToken) {
          const user = result.user ? JSON.parse(result.user) : null;
          
          await chrome.storage.local.set({
            token: result.token,
            refreshToken: result.refreshToken,
            user: user,
            isAuthenticated: true
          });
          
          console.log('Successfully synced auth from web app');
          return true;
        }
      } catch (error) {
        console.log('Error syncing from tab:', error);
      }
    }
    
    console.log('No valid auth data found in web app tabs');
    return false;
  } catch (error) {
    console.error('Error in attemptTokenSyncFromWebApp:', error);
    return false;
  }
}
  function displayUserInfo(user) {
    userName.textContent = user.name || 'User';
    userEmail.textContent = user.email || '';
    userAvatar.textContent = (user.name || 'U')[0].toUpperCase();
  }

  function showState(state) {
    [loadingState, loginState, dashboardState].forEach(s => s.classList.add('hidden'));
    if (state === 'loading') loadingState.classList.remove('hidden');
    if (state === 'login') loginState.classList.remove('hidden');
    if (state === 'dashboard') dashboardState.classList.remove('hidden');
  }

  /* -------------------- QUICK ACTIONS -------------------- */
  async function handleQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (action === 'generate') promptInput.focus();
    if (action === 'improve') improveSelectedText(tab);
    if (action === 'hashtags') generateHashtags(tab);
    if (action === 'predict') predictVirality(tab);
  }

  /* -------------------- AI CORE -------------------- */
  async function generateContent() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    setLoading(true);
    try {
      const { token } = await chrome.storage.local.get(['token']);

      const res = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt,
          platform: platformSelect.value,
          tone: toneSelect.value,
          type: 'social'
        })
      });

      const data = await res.json();
      const content = data.data?.content;

      if (content) {
        showResult(content);
        addToRecent({ prompt, content, platform: platformSelect.value });
      }
    } catch {
      showError('Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function getSelectedText(tab) {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });
    return result;
  }

  async function improveSelectedText(tab) {
    const text = await getSelectedText(tab);
    if (!text) return showError('Select some text first');
    promptInput.value = `Improve this text: ${text}`;
    generateContent();
  }

  async function generateHashtags(tab) {
    const text = (await getSelectedText(tab)) || promptInput.value;
    if (!text) return showError('Enter or select text');

    setLoading(true);
    try {
      const { token } = await chrome.storage.local.get(['token']);
      const res = await fetch(`${API_BASE_URL}/ai/hashtags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: text })
      });

      const data = await res.json();
      showResult(data.data.hashtags.join(' '));
    } catch {
      showError('Hashtag generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function predictVirality(tab) {
    const text = (await getSelectedText(tab)) || promptInput.value;
    if (!text) return showError('Enter or select text');

    setLoading(true);
    try {
      const { token } = await chrome.storage.local.get(['token']);
      const res = await fetch(`${API_BASE_URL}/ai/predict-virality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: text, platform: platformSelect.value })
      });

      const { data } = await res.json();
      showResult(
        `Virality Score: ${data.score}/100\nReach: ${data.predictedReach}\n\n${data.suggestions.join('\n')}`
      );
    } catch {
      showError('Virality prediction failed');
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- INSERT / COPY -------------------- */
  async function insertIntoPage() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: text => {
        const el = document.activeElement;
        if (!el || el.selectionStart == null) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value = el.value.slice(0, start) + text + el.value.slice(end);
        el.selectionStart = el.selectionEnd = start + text.length;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      },
      args: [resultText.value]
    });

    showNotification('Inserted!');
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(resultText.value);
    showNotification('Copied!');
  }

  /* -------------------- RECENTS -------------------- */
  function addToRecent(item) {
    recentGenerations.unshift({ ...item, time: Date.now() });
    recentGenerations = recentGenerations.slice(0, 5);
    chrome.storage.local.set({ recentGenerations });
    renderRecentList();
  }

  async function loadRecentGenerations() {
    const { recentGenerations: r } = await chrome.storage.local.get(['recentGenerations']);
    recentGenerations = r || [];
    renderRecentList();
  }

  function renderRecentList() {
    if (!recentList) return;

    if (recentGenerations.length === 0) {
      recentList.innerHTML = '<p class="empty-state">No recent generations</p>';
      return;
    }

    recentList.innerHTML = recentGenerations
      .map(
        i => `<div class="recent-item" data-content="${escapeHtml(i.content)}">
          ${escapeHtml(i.content.slice(0, 80))}...
        </div>`
      )
      .join('');

    recentList.querySelectorAll('.recent-item').forEach(el =>
      el.addEventListener('click', () => {
        if (resultText && resultSection) {
          resultText.value = el.dataset.content;
          resultSection.classList.remove('hidden');
        }
      })
    );
  }

  /* -------------------- UI HELPERS -------------------- */
  function showResult(content) {
    if (resultText && resultSection) {
      resultText.value = content;
      resultSection.classList.remove('hidden');
    }
  }

  function setLoading(l) {
    if (generateBtn) {
      generateBtn.disabled = l;
      generateBtn.textContent = l ? 'Generating...' : 'Generate Content';
    }
  }

  function showNotification(msg) {
    toast(msg, '#10b981');
  }

  function showError(msg) {
    toast(msg, '#ef4444');
  }

  function toast(msg, color) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
      position:fixed;bottom:60px;left:50%;transform:translateX(-50%);
      background:${color};color:#fff;padding:8px 14px;border-radius:6px;
      font-size:13px;z-index:9999`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* -------------------- BG LISTENER -------------------- */
  chrome.runtime.onMessage.addListener(req => {
    if (req.action === 'authUpdated') checkAuth();
  });
});
