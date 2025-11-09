# CodeLens - Complexity Visualizer

A powerful Chrome extension that provides real-time code complexity analysis with beautiful visualizations for web-based editors. **Now supporting multiple programming languages!**

## 🎨 Version 1.1.0 - Modern Dark Theme!

CodeLens now features a stunning modern dark theme with:
- 🌙 **Sleek Dark Gradient Background** - Professional slate-900/800 gradient
- 💜 **Violet/Purple Accents** - Beautiful color scheme throughout
- ⚡ **Smooth Animations** - Hover effects and transitions
- 🔘 **Rounded Design** - Modern rounded buttons and cards
- ✨ **Glass-morphism Effects** - Backdrop blur for depth
- 🎯 **Enhanced UX** - Better visual hierarchy and readability

[See CHANGELOG.md for full details](CHANGELOG.md)

## 🌟 **New Multi-Language Support**

CodeLens now supports **20+ programming languages** including:

### **Web Technologies**
- **JavaScript** (JS, JSX) - Full AST parsing with Esprima
- **TypeScript** (TS, TSX) - Advanced type-aware analysis
- **HTML** - Structure complexity + embedded script analysis
- **CSS/SCSS/Sass** - Selector and property complexity

### **Programming Languages**
- **Python** - Function and control flow analysis
- **Java** - Method complexity and OOP patterns
- **C++** - Template and function complexity
- **C** - Function and control structure analysis
- **Go** - Function and package complexity
- **Rust** - Function and error handling analysis
- **Swift** - Method and control flow complexity
- **Kotlin** - Function and expression analysis
- **Scala** - Method and functional complexity
- **Ruby** - Method and block complexity
- **PHP** - Function and class analysis

### **Shell & Scripting**
- **Bash/Shell** - Command and control flow analysis
- **Perl** - Function and regex complexity

## ✨ **Features**

### **Real-Time Analysis**
- **Instant Detection**: Automatically detects code blocks on supported platforms
- **Language Recognition**: Intelligent language detection based on file extensions and content
- **Live Updates**: Re-analyzes code when DOM changes are detected

### **Visual Complexity Indicators**
- **Color-Coded Highlights**: Green (low), Yellow (medium), Red (high), Purple (extreme)
- **Inline Annotations**: Hover tooltips showing function complexity details
- **Floating Widget**: Real-time complexity score and function count

### **Comprehensive Metrics**
- **Cyclomatic Complexity**: Measures decision points and control flow
- **Function Analysis**: Individual complexity scores for each function/method
- **Overall Health Score**: Aggregated complexity assessment
- **Language-Specific Metrics**: Tailored analysis for each programming language

### **Multi-Platform Support**
- **GitHub** ⭐ (works best)
- **CodeSandbox** - JavaScript/React playgrounds
- **StackBlitz** - Full-stack development environments
- **Replit** - Multi-language coding platform
- **JSFiddle** - JavaScript testing environment
- **CodePen** - Frontend code playgrounds
- **GitLab** - Git repository hosting
- **Bitbucket** - Git repository hosting
- **SourceForge** - Open source hosting
- **Pastebin** - Code sharing platform
- **Gist** - GitHub code snippets

## 🚀 **Quick Start**

### **1. Install the Extension**
1. Download the extension files
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `extension` folder

### **2. Test on GitHub**
1. Visit any GitHub repository with code files
2. Click on a `.js`, `.py`, `.java`, `.cpp`, `.html`, or `.css` file
3. Wait for the floating widget to appear (3-5 seconds)
4. Click "🔍 Analyze Code" to start analysis

### **3. View Results**
- **Floating Widget**: Shows overall complexity and function count
- **Inline Highlights**: Color-coded function complexity
- **Extension Popup**: Detailed analysis with charts and breakdowns

## 🧪 **Testing**

### **Quick Test**
```bash
npm run test
```
Opens `test-extension.html` for basic functionality testing.

### **Multi-Language Test**
```bash
open multi-language-test.html
```
Comprehensive test page with examples in all supported languages.

### **Expected Results by Language**

| Language | Example File | Expected Functions | Complexity Range |
|----------|--------------|-------------------|------------------|
| JavaScript | `example.js` | 3 functions | 8-12 |
| Python | `example.py` | 2 functions | 6-10 |
| Java | `Example.java` | 3 methods | 8-15 |
| C++ | `example.cpp` | 3 functions | 10-18 |
| HTML | `example.html` | 2 JS functions + structure | 5-12 |
| CSS | `example.css` | 1 stylesheet | 8-15 |

## 🔧 **How It Works**

### **Language Detection**
1. **File Extension**: Primary detection method (`.js`, `.py`, `.java`, etc.)
2. **Content Analysis**: Fallback detection for files without clear extensions
3. **Shebang Detection**: Identifies shell scripts and interpreters

### **Complexity Calculation**
- **JavaScript/TypeScript**: Full AST parsing with Esprima
- **Python**: Function detection with control flow analysis
- **Java/C++**: Method/function parsing with decision point counting
- **HTML**: Structure nesting + embedded script analysis
- **CSS**: Selector, property, and media query complexity

### **Analysis Process**
1. **Code Detection**: Finds code blocks using platform-specific selectors
2. **Language Recognition**: Determines programming language automatically
3. **Parsing**: Uses appropriate parser for each language
4. **Complexity Calculation**: Counts decision points and control structures
5. **Visualization**: Applies color-coded highlights and updates widget

## 🛠 **Technical Stack**

- **Frontend**: React.js + TailwindCSS
- **Extension**: Chrome Manifest V3
- **Parsing**: Esprima (JavaScript), Regex-based (other languages)
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom complexity colors

## 📁 **Project Structure**

```
live-complexity-visualiser/
├── src/                    # React source code
│   ├── components/         # UI components
│   ├── App.jsx            # Landing page
│   └── popup.jsx          # Extension popup
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension configuration
│   ├── content.js         # Content script (multi-language support)
│   ├── background.js      # Service worker
│   └── content.css        # Styling for injected elements
├── multi-language-test.html # Test page for all languages
├── test-extension.html    # Basic functionality test
└── TROUBLESHOOTING.md     # Debugging guide
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"Could not connect to page" Error**
1. **Refresh the page** - Content script might not be loaded
2. **Check platform support** - Ensure you're on a supported site
3. **Reload extension** - Go to `chrome://extensions/` and click reload
4. **Check console logs** - Look for "CodeLens:" messages

#### **No Floating Widget**
1. **Wait 3-5 seconds** - Widget appears after page analysis
2. **Check console** - Look for error messages
3. **Verify platform** - Ensure you're on a supported site
4. **Refresh page** - Try reloading the page

#### **No Code Highlights**
1. **Check for code** - Ensure the page has programming code
2. **Verify language** - Check if your language is supported
3. **Click analyze** - Use the manual analyze button
4. **Check console** - Look for analysis logs

### **Debug Information**
Open browser console (F12) and look for:
```
✅ Good - Extension working:
CodeLens: Setting up content script...
CodeLens: Floating widget created
CodeLens: Found code blocks: X
CodeLens: Analyzing [language] code block
CodeLens: Analysis complete: {...}

❌ Bad - Extension issues:
Could not establish connection
Content script not loaded
No code found to analyze
```

## 🚀 **Development**

### **Build Commands**
```bash
npm run dev          # Start development server
npm run build        # Build React app
npm run build:extension # Build extension
npm run watch:extension # Watch mode for extension
npm run preview      # Preview built app
npm run test         # Open test page
```

### **Adding New Languages**
1. **Update `detectLanguage()`** in `content.js`
2. **Add complexity calculator** for the language
3. **Update language mapping** in the popup
4. **Test with sample code**

### **Customizing Analysis**
- **Complexity thresholds**: Modify `getComplexityLabel()` function
- **Color schemes**: Update CSS variables in `content.css`
- **Detection patterns**: Modify `looksLikeCode()` function

## 📚 **API Reference**

### **Content Script Messages**
```javascript
// Analyze code
chrome.tabs.sendMessage(tabId, { action: 'analyzeCode' })

// Get complexity data
chrome.tabs.sendMessage(tabId, { action: 'getComplexityData' })

// Highlight function
chrome.tabs.sendMessage(tabId, { 
  action: 'highlightFunction', 
  functionName: 'functionName' 
})

// Ping content script
chrome.tabs.sendMessage(tabId, { action: 'ping' })
```

### **Response Format**
```javascript
{
  success: true,
  data: {
    overallScore: 15,
    functions: [...],
    totalFunctions: 5,
    averageComplexity: 3.0,
    language: 'javascript',
    fileType: 'js'
  }
}
```

## 🌟 **Roadmap**

### **Upcoming Features**
- **More Languages**: Rust, Go, Swift, Kotlin support
- **Advanced Metrics**: Cognitive complexity, maintainability index
- **Custom Rules**: User-defined complexity thresholds
- **Team Analytics**: Shared complexity reports
- **IDE Integration**: VS Code, IntelliJ plugins

### **Language Support Expansion**
- **Functional Languages**: Haskell, Clojure, F#
- **Systems Languages**: Assembly, Zig, Nim
- **Domain-Specific**: SQL, YAML, TOML
- **Configuration**: JSON, XML, INI

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**
3. **Add language support** or **fix bugs**
4. **Test thoroughly** with sample code
5. **Submit a pull request**

### **Adding Language Support**
- Implement `calculate[Language]Complexity()` function
- Add language detection patterns
- Update language mapping and display names
- Test with real code examples

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Esprima** - JavaScript parsing library
- **Chrome Extensions API** - Extension framework
- **React & TailwindCSS** - UI framework and styling
- **Open Source Community** - Language specifications and examples

## 🆘 **Support**

### **Getting Help**
1. **Check troubleshooting guide**: `TROUBLESHOOTING.md`
2. **Review test pages**: `test-extension.html`, `multi-language-test.html`
3. **Check console logs** for debugging information
4. **Verify platform support** and language compatibility

### **Reporting Issues**
Include:
- **Platform**: GitHub, CodeSandbox, etc.
- **Language**: JavaScript, Python, Java, etc.
- **Console logs**: Any error messages
- **Steps to reproduce**: Clear reproduction steps

---

**Happy Coding! 🚀**

*CodeLens - Making code complexity visible across all programming languages.*

