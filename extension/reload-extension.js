// Force reload extension script
// This script helps ensure the extension is properly reloaded

console.log('CodeLens: Extension reload script loaded');

// Add a timestamp to help identify if the extension has been reloaded
const timestamp = new Date().toISOString();
console.log('CodeLens: Extension loaded at:', timestamp);

// Force a page reload if this is a content script
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
  console.log('CodeLens: Running as content script');
} else {
  console.log('CodeLens: Running in regular page context');
}

// Add a unique identifier to help with debugging
window.codelensExtensionVersion = '1.0.1-' + timestamp;
console.log('CodeLens: Extension version:', window.codelensExtensionVersion);
