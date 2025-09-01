# 🚀 Quick Start Guide

Get the Live Complexity Visualizer Chrome extension running in under 5 minutes!

## Prerequisites

- Node.js 16+ and npm
- Google Chrome browser
- Git (optional)

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Extension
```bash
npm run build:extension
```

### 3. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension icon should appear in your toolbar

### 4. Test It Out
1. Go to any GitHub repository with JavaScript files
2. Click on a `.js` file
3. The extension will automatically analyze the code
4. Look for color-coded highlights and the floating widget

## 🔧 Development

### Start Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` to see the landing page.

### Watch Mode (Auto-rebuild)
```bash
npm run watch:extension
```
This will automatically rebuild the extension when you make changes.

### View Demo
```bash
npm run demo
```
Opens the demo page in your browser.

## 📁 Project Structure

```
live-complexity-visualiser/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── App.jsx            # Landing page
│   └── popup.jsx          # Extension popup
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension configuration
│   ├── content.js         # Content script (analyzes code)
│   ├── background.js      # Service worker
│   └── content.css        # Styling for highlights
├── dist/                   # Built files (after npm run build)
└── demo.html              # Demo page
```

## 🎯 How It Works

1. **Content Script** (`content.js`) runs on supported websites
2. **Detects code blocks** using CSS selectors
3. **Parses JavaScript** using Esprima library
4. **Calculates complexity** using cyclomatic complexity algorithm
5. **Applies highlights** with color-coded backgrounds
6. **Updates widget** with real-time metrics

## 🐛 Troubleshooting

### Extension Not Loading?
- Check the console in `chrome://extensions/`
- Ensure all files are in the `extension/` folder
- Try reloading the extension

### No Highlights Appearing?
- Check if you're on a supported platform
- Look for JavaScript errors in the browser console
- Verify the content script is running

### Build Errors?
- Make sure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 16+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 🚀 Next Steps

- **Customize colors** in `tailwind.config.js`
- **Add new platforms** in `content.js` and `manifest.json`
- **Enhance analysis** by modifying complexity calculation in `content.js`
- **Improve UI** by editing React components in `src/components/`

## 📚 Learn More

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Esprima Parser](https://esprima.org/)

---

**Need help?** Check the main [README.md](README.md) or open an issue on GitHub!
