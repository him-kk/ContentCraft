// ContentCraft AI Content Script
// Injected into supported social media platforms

(function() {
  'use strict';

  // Platform detection
  const hostname = window.location.hostname;
  const platform = detectPlatform(hostname);

  if (!platform) return;

  // Initialize based on platform
  initializePlatform(platform);

  function detectPlatform(hostname) {
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return 'twitter';
    } else if (hostname.includes('linkedin.com')) {
      return 'linkedin';
    } else if (hostname.includes('instagram.com')) {
      return 'instagram';
    } else if (hostname.includes('facebook.com')) {
      return 'facebook';
    }
    return null;
  }

  function initializePlatform(platform) {
    // Add ContentCraft AI button to compose areas
    observeComposeAreas(platform);
    
    // Add keyboard shortcuts
    addKeyboardShortcuts(platform);
    
    // Add floating action button
    addFloatingButton(platform);
  }

  // Observe for compose areas and add ContentCraft buttons
  function observeComposeAreas(platform) {
    const selectors = getComposeSelectors(platform);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            selectors.forEach(selector => {
              const composeAreas = node.matches?.(selector) 
                ? [node] 
                : node.querySelectorAll?.(selector) || [];
              
              composeAreas.forEach(area => {
                if (!area.dataset.contentcraft) {
                  area.dataset.contentcraft = 'true';
                  addContentCraftButton(area, platform);
                }
              });
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function getComposeSelectors(platform) {
    const selectors = {
      twitter: [
        '[data-testid="tweetTextarea_0"]',
        '[data-testid="tweetTextarea_0 RichTextEditor"]',
        'div[role="textbox"][data-text="true"]'
      ],
      linkedin: [
        '.ql-editor',
        '[data-placeholder="What do you want to talk about?"]',
        '.share-box__text-editor'
      ],
      instagram: [
        'textarea[aria-label="Write a caption..."]',
        'textarea[placeholder="Write a caption..."]'
      ],
      facebook: [
        '[role="textbox"]',
        '[data-testid="status-attachment-mentions-input"]',
        '.notranslate'
      ]
    };
    return selectors[platform] || [];
  }

  function addContentCraftButton(composeArea, platform) {
    const button = document.createElement('button');
    button.className = 'contentcraft-ai-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 3L2 7L12 12L22 7L12 3Z"/>
        <path d="M2 17L12 22L22 17"/>
        <path d="M2 12L12 17L22 12"/>
      </svg>
      <span>AI</span>
    `;
    button.title = 'Generate with ContentCraft AI';
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openContentCraftModal(composeArea, platform);
    });

    // Find the appropriate container to insert the button
    const container = findButtonContainer(composeArea, platform);
    if (container) {
      container.appendChild(button);
    }
  }

  function findButtonContainer(composeArea, platform) {
    // Platform-specific logic to find the toolbar container
    let container = composeArea.closest('form')?.querySelector('[role="toolbar"]');
    if (!container) {
      container = composeArea.parentElement?.querySelector('[role="toolbar"]');
    }
    if (!container) {
      container = composeArea.parentElement?.parentElement?.querySelector('[role="group"]');
    }
    return container;
  }

  function openContentCraftModal(composeArea, platform) {
    // Remove existing modal
    const existingModal = document.querySelector('.contentcraft-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'contentcraft-modal';
    modal.innerHTML = `
      <div class="contentcraft-modal-overlay"></div>
      <div class="contentcraft-modal-content">
        <div class="contentcraft-modal-header">
          <h3>ContentCraft AI</h3>
          <button class="contentcraft-close-btn">&times;</button>
        </div>
        <div class="contentcraft-modal-body">
          <div class="contentcraft-tabs">
            <button class="contentcraft-tab active" data-tab="generate">Generate</button>
            <button class="contentcraft-tab" data-tab="improve">Improve</button>
            <button class="contentcraft-tab" data-tab="hashtags">Hashtags</button>
          </div>
          <div class="contentcraft-tab-content" id="tab-generate">
            <textarea placeholder="What would you like to create? (e.g., 'Write a post about AI technology')" rows="3"></textarea>
            <div class="contentcraft-options">
              <select class="contentcraft-tone">
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="humorous">Humorous</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
            <button class="contentcraft-generate-btn">
              <span class="contentcraft-spinner hidden"></span>
              <span class="contentcraft-btn-text">Generate</span>
            </button>
          </div>
          <div class="contentcraft-tab-content hidden" id="tab-improve">
            <p class="contentcraft-hint">Select text in the compose area and click Improve</p>
            <button class="contentcraft-improve-btn">Improve Selected Text</button>
          </div>
          <div class="contentcraft-tab-content hidden" id="tab-hashtags">
            <p class="contentcraft-hint">Generate relevant hashtags for your content</p>
            <button class="contentcraft-hashtags-btn">Generate Hashtags</button>
          </div>
          <div class="contentcraft-result hidden">
            <textarea readonly rows="4"></textarea>
            <div class="contentcraft-result-actions">
              <button class="contentcraft-copy-btn">Copy</button>
              <button class="contentcraft-insert-btn">Insert</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.contentcraft-close-btn').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.contentcraft-modal-overlay').addEventListener('click', () => {
      modal.remove();
    });

    // Tab switching
    modal.querySelectorAll('.contentcraft-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.contentcraft-tab').forEach(t => t.classList.remove('active'));
        modal.querySelectorAll('.contentcraft-tab-content').forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        modal.querySelector(`#tab-${tab.dataset.tab}`).classList.remove('hidden');
      });
    });

    // Generate button
    modal.querySelector('.contentcraft-generate-btn').addEventListener('click', async () => {
      const prompt = modal.querySelector('#tab-generate textarea').value;
      const tone = modal.querySelector('.contentcraft-tone').value;
      
      if (!prompt.trim()) return;

      setLoading(modal, true);

      try {
        const response = await chrome.runtime.sendMessage({
          action: 'generateContent',
          data: { prompt, platform, tone, type: 'social' }
        });

        if (response.success) {
          showResult(modal, response.data.content || response.data.generatedContent);
        } else {
          showError(modal, response.error);
        }
      } catch (error) {
        showError(modal, 'Failed to generate content');
      } finally {
        setLoading(modal, false);
      }
    });

    // Improve button
    modal.querySelector('.contentcraft-improve-btn').addEventListener('click', async () => {
      const selectedText = window.getSelection().toString();
      
      if (!selectedText) {
        showError(modal, 'Please select some text first');
        return;
      }

      setLoading(modal, true);

      try {
        const response = await chrome.runtime.sendMessage({
          action: 'improveText',
          data: { text: selectedText, platform }
        });

        if (response.success) {
          showResult(modal, response.data.content || response.data.generatedContent);
        } else {
          showError(modal, response.error);
        }
      } catch (error) {
        showError(modal, 'Failed to improve text');
      } finally {
        setLoading(modal, false);
      }
    });

    // Hashtags button
    modal.querySelector('.contentcraft-hashtags-btn').addEventListener('click', async () => {
      const content = composeArea.textContent || composeArea.value || '';
      
      if (!content.trim()) {
        showError(modal, 'Please write some content first');
        return;
      }

      setLoading(modal, true);

      try {
        const response = await chrome.runtime.sendMessage({
          action: 'generateHashtags',
          data: { content }
        });

        if (response.success) {
          const hashtags = response.data.hashtags?.join(' ') || '';
          showResult(modal, hashtags);
        } else {
          showError(modal, response.error);
        }
      } catch (error) {
        showError(modal, 'Failed to generate hashtags');
      } finally {
        setLoading(modal, false);
      }
    });

    // Copy button
    modal.querySelector('.contentcraft-copy-btn').addEventListener('click', () => {
      const text = modal.querySelector('.contentcraft-result textarea').value;
      navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!');
    });

    // Insert button
    modal.querySelector('.contentcraft-insert-btn').addEventListener('click', () => {
      const text = modal.querySelector('.contentcraft-result textarea').value;
      insertText(composeArea, text);
      modal.remove();
    });
  }

  function setLoading(modal, loading) {
    const btn = modal.querySelector('.contentcraft-generate-btn, .contentcraft-improve-btn, .contentcraft-hashtags-btn');
    const spinner = modal.querySelector('.contentcraft-spinner');
    const btnText = modal.querySelector('.contentcraft-btn-text');
    
    if (btn) btn.disabled = loading;
    if (spinner) spinner.classList.toggle('hidden', !loading);
    if (btnText) btnText.textContent = loading ? 'Generating...' : btn.dataset.originalText || 'Generate';
  }

  function showResult(modal, text) {
    const resultSection = modal.querySelector('.contentcraft-result');
    const resultTextarea = resultSection.querySelector('textarea');
    resultTextarea.value = text;
    resultSection.classList.remove('hidden');
  }

  function showError(modal, message) {
    const resultSection = modal.querySelector('.contentcraft-result');
    const resultTextarea = resultSection.querySelector('textarea');
    resultTextarea.value = `Error: ${message}`;
    resultSection.classList.remove('hidden');
  }

  function insertText(element, text) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      const value = element.value;
      element.value = value.substring(0, start) + text + value.substring(end);
      element.selectionStart = element.selectionEnd = start + text.length;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // For contenteditable
      document.execCommand('insertText', false, text);
    }
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'contentcraft-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  // Keyboard shortcuts
  function addKeyboardShortcuts(platform) {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + C - Open ContentCraft
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        const composeArea = document.querySelector(getComposeSelectors(platform)[0]);
        if (composeArea) {
          openContentCraftModal(composeArea, platform);
        }
      }
    });
  }

  // Floating action button
  function addFloatingButton(platform) {
    const existingFab = document.querySelector('.contentcraft-fab');
    if (existingFab) return;

    const fab = document.createElement('button');
    fab.className = 'contentcraft-fab';
    fab.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 3L2 7L12 12L22 7L12 3Z"/>
        <path d="M2 17L12 22L22 17"/>
        <path d="M2 12L12 17L22 12"/>
      </svg>
    `;
    fab.title = 'ContentCraft AI (Ctrl+Shift+C)';
    
    fab.addEventListener('click', () => {
      const composeArea = document.querySelector(getComposeSelectors(platform)[0]);
      if (composeArea) {
        openContentCraftModal(composeArea, platform);
      }
    });

    document.body.appendChild(fab);
  }

  // Listen for messages from background/popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insertText') {
      const composeArea = document.querySelector(getComposeSelectors(platform)[0]);
      if (composeArea) {
        insertText(composeArea, request.text);
        sendResponse({ success: true });
      }
    }
  });

})();