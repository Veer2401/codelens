# 🔧 CodeLens Extension Troubleshooting Guide

This guide helps you resolve common issues with the CodeLens Chrome extension.

## 🚨 **"Could not connect to page" Error**

This is the most common error and usually means the content script isn't running on the current page.

### **Quick Fixes (Try in Order)**

1. **Refresh the page** - The content script might not have loaded yet
2. **Click "Analyze" button** - This can trigger the content script to initialize
3. **Check if you're on a supported platform** - The extension only works on specific sites
4. **Reload the extension** - Go to `chrome://extensions/` and click the reload button

### **Step-by-Step Resolution**

#### **Step 1: Verify Platform Support**
Make sure you're on one of these supported platforms:
- ✅ **GitHub**: `github.com` (works best)
- ✅ **CodeSandbox**: `codesandbox.io`
- ✅ **StackBlitz**: `stackblitz.com`
- ✅ **Replit**: `replit.com`
- ✅ **JSFiddle**: `jsfiddle.net`
- ✅ **CodePen**: `codepen.io`

#### **Step 2: Check Extension Status**
1. Go to `chrome://extensions/`
2. Find "CodeLens - Complexity Visualizer"
3. Make sure it's **enabled** and **loaded**
4. If there are errors, click the **reload** button

#### **Step 3: Verify Content Script**
1. Open the browser console (F12 → Console)
2. Look for messages starting with "CodeLens:"
3. You should see:
   ```
   CodeLens: Setting up content script...
   CodeLens: Floating widget created
   CodeLens: DOM observer started
   ```

#### **Step 4: Check for JavaScript Code**
The extension only works on pages with JavaScript code:
- **GitHub**: Look for `.js` files
- **CodeSandbox**: Make sure there's JavaScript in the editor
- **StackBlitz**: Ensure the project has JavaScript files
- **Other platforms**: Check that JavaScript code is visible

## 🐛 **Other Common Issues**

### **No Floating Widget Appearing**
**Symptoms**: No widget in the top-right corner
**Solutions**:
1. Wait 3-5 seconds for the widget to appear
2. Check browser console for errors
3. Refresh the page
4. Ensure you're on a supported platform

### **Widget Appears But No Analysis**
**Symptoms**: Widget shows but "Analyze" button doesn't work
**Solutions**:
1. Click the "🔍 Analyze Code" button in the widget
2. Check browser console for analysis logs
3. Make sure the page has JavaScript code
4. Try refreshing the page

### **No Code Highlights**
**Symptoms**: Analysis runs but no colored highlights appear
**Solutions**:
1. Check if the page has JavaScript functions
2. Look for code blocks (pre, code, or editor elements)
3. Check browser console for highlighting logs
4. Try different code files or sections

### **Popup Shows No Data**
**Symptoms**: Popup opens but shows 0 functions
**Solutions**:
1. Click "Analyze" button in the popup
2. Check if the page has JavaScript code
3. Look for console logs about code detection
4. Try a different page with more JavaScript

## 🔍 **Debug Information**

### **Console Logs to Look For**
```
✅ Good - Extension is working:
CodeLens: Setting up content script...
CodeLens: Floating widget created
CodeLens: DOM observer started
CodeLens: Starting initial analysis...
CodeLens: Starting code analysis...
CodeLens: Found code blocks: X
CodeLens: Total functions found: X
CodeLens: Analysis complete, sending response: {...}

❌ Bad - Extension has issues:
Could not establish connection
Content script not loaded
No code found to analyze
```

### **Network Tab Check**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Look for `esprima.min.js` - this should load from CDN
4. If it fails, there might be a network issue

## 🛠️ **Advanced Troubleshooting**

### **Reset Extension Completely**
1. Go to `chrome://extensions/`
2. Remove the CodeLens extension
3. Clear browser cache and cookies
4. Reload the extension folder

### **Check Manifest Permissions**
Ensure the extension has these permissions:
```json
{
  "permissions": ["activeTab", "storage"],
  "host_permissions": [
    "https://github.com/*",
    "https://codesandbox.io/*",
    "https://stackblitz.com/*"
  ]
}
```

### **Test on Different Pages**
Try these test scenarios:
1. **GitHub**: Visit any repository with `.js` files
2. **CodeSandbox**: Create a new JavaScript sandbox
3. **StackBlitz**: Start a new JavaScript project
4. **Test page**: Use the included `test-extension.html`

## 📱 **Platform-Specific Issues**

### **GitHub**
- **Best platform** for testing
- Works with repository files, gists, and pull requests
- Look for `.js`, `.ts`, `.jsx` files
- Widget appears in top-right corner

### **CodeSandbox**
- May take longer to load
- Ensure JavaScript panel is visible
- Try refreshing if widget doesn't appear

### **StackBlitz**
- Similar to CodeSandbox
- Check that JavaScript files are open
- Widget should appear after page loads

### **Other Platforms**
- May have different loading times
- Check browser console for errors
- Ensure JavaScript code is visible

## ✅ **Success Indicators**

The extension is working correctly when you see:
- ✅ Floating widget in top-right corner
- ✅ "CodeLens" title in widget header
- ✅ Complexity score and function count
- ✅ "🔍 Analyze Code" button works
- ✅ Popup opens with data
- ✅ Code highlights appear with colors
- ✅ Console shows "CodeLens:" logs

## 🆘 **Still Having Issues?**

If none of the above solutions work:

1. **Check the test guide**: See `extension-test-guide.md`
2. **Verify your setup**: Ensure all files are in the `extension` folder
3. **Check Chrome version**: Make sure you're using Chrome 88+
4. **Try a different browser**: Test with Edge or Brave
5. **Report the issue**: Include console logs and error messages

## 🔄 **Quick Recovery Steps**

When in doubt, try this sequence:
1. **Refresh the page** (F5)
2. **Click "Analyze"** in the popup
3. **Check console** for error messages
4. **Reload extension** in `chrome://extensions/`
5. **Try a different page** on the same platform

---

**Remember**: The extension needs JavaScript code to analyze. If you're on a blank page or a page without JavaScript, it won't work!

**Happy Coding! 🚀**
