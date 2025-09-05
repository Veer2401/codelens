// CodeLens - Complexity Visualizer - Background Service Worker

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('CodeLens - Complexity Visualizer installed successfully!')
    
    // Set default settings
    chrome.storage.local.set({
      enabled: true,
      autoAnalyze: true,
      showWidget: true,
      highlightThreshold: 10,
      theme: 'auto'
    })
  }
})

// Supported sites (must match manifest host_permissions)
const SUPPORTED_SITES = [
  'github.com',
  'codesandbox.io',
  'stackblitz.com',
  'replit.com',
  'jsfiddle.net',
  'codepen.io',
  'gitlab.com',
  'bitbucket.org',
  'sourceforge.net',
  'pastebin.com',
  'gist.github.com'
]

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'openPopup':
      // Try to open the browser action popup in-place (no new tab)
      if (chrome.action && chrome.action.openPopup) {
        chrome.action.openPopup(() => {
          const err = chrome.runtime.lastError
          if (err) {
            // Fallback: open a small popup window to mimic the action popup
            chrome.windows.create({
              url: chrome.runtime.getURL('popup.html'),
              type: 'popup',
              width: 420,
              height: 680
            }, () => {
              sendResponse({ success: true, fallback: true, error: err.message })
            })
          } else {
            sendResponse({ success: true })
          }
        })
        return true
      }
      // Fallback if openPopup is not available
      chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: 420,
        height: 680
      }, () => {
        sendResponse({ success: true, fallback: true })
      })
      return true
    case 'getSettings':
      chrome.storage.local.get(null, (settings) => {
        sendResponse({ success: true, settings })
      })
      return true // Keep message channel open for async response
      
    case 'updateSettings':
      chrome.storage.local.set(request.settings, () => {
        sendResponse({ success: true })
      })
      return true
      
    case 'analyzeTab':
      analyzeTab(request.tabId)
      sendResponse({ success: true })
      break
      
    case 'getTabInfo':
      chrome.tabs.get(request.tabId, (tab) => {
        sendResponse({ success: true, tab })
      })
      return true
  }
})

// Analyze a specific tab
async function analyzeTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId)
    const url = tab && tab.url ? tab.url : ''
    const isSupported = url && SUPPORTED_SITES.some(site => url.includes(site))
    if (!isSupported) return

    await ensureContentScript(tabId)
    await sendMessageWithRetry(tabId, { action: 'analyzeCode' }, 1)
  } catch (error) {
    console.error('Error analyzing tab:', error)
  }
}

// Ensure content script is present; if not, inject it
async function ensureContentScript(tabId) {
  // Try a lightweight ping first
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'ping' })
    return
  } catch (e) {
    // proceed to inject
  }

  try {
    // Inject CSS first
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ['content.css']
    }).catch(() => {})

    // Inject dependencies then content script
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['assets/esprima.js']
    })
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    })

    // Give the content script a brief moment to initialize, then verify with ping
    await new Promise(r => setTimeout(r, 200))
    await chrome.tabs.sendMessage(tabId, { action: 'ping' })
  } catch (err) {
    console.warn('Failed to inject content scripts:', err)
  }
}

// Send a message and, on missing receiver, ensure injection and retry once
async function sendMessageWithRetry(tabId, message, retries = 1) {
  try {
    await chrome.tabs.sendMessage(tabId, message)
  } catch (err) {
    const msg = (err && err.message) || ''
    const missingReceiver = msg.includes('Receiving end does not exist') || msg.includes('Could not establish connection')
    if (missingReceiver && retries > 0) {
      await ensureContentScript(tabId)
      // small wait to allow listeners to attach
      await new Promise(r => setTimeout(r, 100))
      return sendMessageWithRetry(tabId, message, retries - 1)
    }
    throw err
  }
}

// Handle tab updates to auto-analyze when navigating to supported sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isSupported = SUPPORTED_SITES.some(site => tab.url.includes(site))
    
    if (isSupported) {
      // Check if auto-analyze is enabled
      chrome.storage.local.get(['autoAnalyze'], (result) => {
        if (result.autoAnalyze) {
          // Wait a bit for the page to fully load
          setTimeout(() => {
            analyzeTab(tabId)
          }, 2000)
        }
      })
    }
  }
})

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will only trigger if no popup is set
  // For now, we'll just analyze the current tab
  if (tab.url) {
    const isSupported = SUPPORTED_SITES.some(site => tab.url.includes(site))
    
    if (isSupported) {
      analyzeTab(tab.id)
    } else {
      // Show a notification for unsupported sites
      chrome.notifications.create({
        type: 'basic',
        title: 'CodeLens - Complexity Visualizer',
        message: 'This page is not supported. Please navigate to a supported code editor.'
      })
    }
  }
})

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CodeLens - Complexity Visualizer: Extension installed')
  
  // Create context menu items
  chrome.contextMenus.create({
    id: 'codelens-analyze',
    title: '🔍 Analyze Code with CodeLens',
    contexts: ['page', 'selection']
  })
  
  chrome.contextMenus.create({
    id: 'codelens-toggle-widget',
    title: '📊 Toggle CodeLens Widget',
    contexts: ['page']
  })
  
  chrome.contextMenus.create({
    id: 'codelens-separator',
    type: 'separator',
    contexts: ['page']
  })
  
  chrome.contextMenus.create({
    id: 'codelens-about',
    title: 'ℹ️ About CodeLens',
    contexts: ['page']
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'codelens-analyze':
      analyzeTab(tab.id)
      break
      
    case 'codelens-toggle-widget':
      sendMessageWithRetry(tab.id, { action: 'toggleWidget' }, 1).catch(() => {})
      break
      
    case 'codelens-about':
      // Show about information
      chrome.notifications.create({
        type: 'basic',
        title: 'CodeLens - Complexity Visualizer',
        message: 'Multi-language code complexity analyzer. Use Ctrl+Shift+L to toggle widget.'
      })
      break
  }
})

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    // Notify all content scripts of setting changes
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url) {
          const isSupported = SUPPORTED_SITES.some(site => tab.url.includes(site))
          
          if (isSupported) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'settingsChanged',
              changes
            }).catch(() => {
              // Ignore errors for tabs that don't have content scripts
            })
          }
        }
      })
    })
  }
})

// Periodic cleanup and maintenance
setInterval(() => {
  // Clean up any orphaned data or perform maintenance tasks
  chrome.storage.local.get(['lastCleanup'], (result) => {
    const now = Date.now()
    const lastCleanup = result.lastCleanup || 0
    
    // Clean up every 24 hours
    if (now - lastCleanup > 24 * 60 * 60 * 1000) {
      chrome.storage.local.set({ lastCleanup: now })
      
      // You could add cleanup logic here if needed
      console.log('Performing periodic cleanup...')
    }
  })
}, 60 * 60 * 1000) // Check every hour

// Handle errors gracefully
chrome.runtime.onSuspend.addListener(() => {
  console.log('CodeLens - Complexity Visualizer background service worker suspended')
})

// Keep the service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('CodeLens - Complexity Visualizer background service worker started')
})
