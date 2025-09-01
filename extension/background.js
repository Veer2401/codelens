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

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
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
    await chrome.tabs.sendMessage(tabId, { action: 'analyzeCode' })
  } catch (error) {
    console.error('Error analyzing tab:', error)
  }
}

// Handle tab updates to auto-analyze when navigating to supported sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedSites = [
      'github.com',
      'codesandbox.io',
      'stackblitz.com',
      'replit.com',
      'jsfiddle.net',
      'codepen.io'
    ]
    
    const isSupported = supportedSites.some(site => tab.url.includes(site))
    
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
    const supportedSites = [
      'github.com',
      'codesandbox.io',
      'stackblitz.com',
      'replit.com',
      'jsfiddle.net',
      'codepen.io'
    ]
    
    const isSupported = supportedSites.some(site => tab.url.includes(site))
    
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
      // Send message to content script to analyze code
      chrome.tabs.sendMessage(tab.id, { action: 'analyzeCode' }).catch(() => {
        // If content script not ready, show notification
        chrome.notifications.create({
          type: 'basic',
          title: 'CodeLens - Complexity Visualizer',
          message: 'Please refresh the page and try again to analyze code.'
        })
      })
      break
      
    case 'codelens-toggle-widget':
      // Toggle widget visibility
      chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' }).catch(() => {
        chrome.notifications.create({
          type: 'basic',
          title: 'CodeLens - Complexity Visualizer',
          message: 'Please refresh the page and try again to toggle widget.'
        })
      })
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
          const supportedSites = [
            'github.com',
            'codesandbox.io',
            'stackblitz.com',
            'replit.com',
            'jsfiddle.net',
            'codepen.io'
          ]
          
          const isSupported = supportedSites.some(site => tab.url.includes(site))
          
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
