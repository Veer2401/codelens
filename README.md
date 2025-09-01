# Live Complexity Visualizer

A powerful Chrome extension that analyzes code complexity in real-time inside web-based editors with beautiful visualizations.

## 🚀 Features

- **Real-time Analysis**: Get instant complexity insights as you code
- **Inline Highlights**: Color-coded backgrounds show complexity levels directly in your code editor
- **Smart Detection**: Automatically detects code blocks in GitHub, CodeSandbox, StackBlitz, and more
- **Beautiful Charts**: Interactive bubble charts and graphs show complexity distribution
- **Floating Widget**: Always-visible complexity score and statistics
- **Privacy First**: All analysis happens locally in your browser
- **Open Source**: Built with transparency and community in mind

## 🛠️ Tech Stack

- **Frontend**: React + TailwindCSS
- **Code Analysis**: JavaScript with Esprima for AST parsing
- **Extension**: Chrome Manifest V3
- **Build Tool**: Vite
- **Charts**: Custom SVG-based visualizations

## 📦 Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live-complexity-visualiser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   # Build for development
   npm run dev
   
   # Build for production
   npm run build
   
   # Build extension files
   npm run build:extension
   ```

4. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

### Production Installation

1. Download the extension from the Chrome Web Store (when available)
2. Click "Add to Chrome"
3. The extension will automatically analyze code on supported sites

## 🎯 Supported Platforms

- **GitHub**: Repository files, Gists, Pull Requests
- **CodeSandbox**: Sandbox projects and files
- **StackBlitz**: Web development projects
- **Replit**: Online IDE projects
- **JSFiddle**: Code playground
- **CodePen**: Frontend code examples

## 🔧 Usage

### Basic Usage

1. **Install the extension** from the Chrome Web Store
2. **Navigate to a supported platform** (e.g., GitHub repository)
3. **View code files** - the extension automatically analyzes complexity
4. **See inline highlights** with color-coded backgrounds:
   - 🟢 Green: Low complexity (1-5)
   - 🟡 Yellow: Medium complexity (6-10)
   - 🔴 Red: High complexity (11-15)
   - 🟤 Brown: Extreme complexity (16+)

### Extension Popup

- Click the extension icon to open the popup
- View overall complexity score and statistics
- Browse individual functions and their complexity
- See visual charts and complexity distribution

### Floating Widget

- Always-visible widget showing current complexity metrics
- Draggable and resizable
- Click to close or minimize

### Context Menu

- Right-click on any page to manually trigger analysis
- Useful for dynamic content or single-page applications

## 📊 Complexity Metrics

The extension calculates complexity using the **Cyclomatic Complexity** algorithm:

- **Base complexity**: 1 for each function
- **Control flow**: +1 for each `if`, `switch`, `for`, `while`, `catch`, etc.
- **Logical operators**: +1 for each `&&`, `||`, `?`, `:`

### Complexity Levels

| Level | Score | Description | Recommendation |
|-------|-------|-------------|----------------|
| Low | 1-5 | Excellent | Keep it up! |
| Medium | 6-10 | Good | Consider some improvements |
| High | 11-15 | Fair | Needs refactoring |
| Extreme | 16+ | Poor | Major refactoring required |

## 🎨 Customization

### Settings

Access settings through the extension popup:

- **Auto-analyze**: Automatically analyze code when navigating
- **Show Widget**: Toggle floating widget visibility
- **Highlight Threshold**: Set minimum complexity for highlights
- **Theme**: Choose between light, dark, or auto

### Styling

The extension uses CSS custom properties for easy theming:

```css
:root {
  --complexity-low: #10b981;
  --complexity-medium: #f59e0b;
  --complexity-high: #ef4444;
  --complexity-extreme: #7c2d12;
}
```

## 🏗️ Architecture

### Project Structure

```
live-complexity-visualiser/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── popup.jsx          # Extension popup entry
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension manifest
│   ├── content.js         # Content script
│   ├── background.js      # Service worker
│   ├── popup.html         # Popup HTML
│   └── content.css        # Content script styles
├── dist/                   # Built files
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # TailwindCSS configuration
```

### Key Components

1. **Content Script** (`content.js`): Analyzes code and injects highlights
2. **Background Service Worker** (`background.js`): Manages extension lifecycle
3. **Popup UI** (`popup.jsx`): Extension popup interface
4. **Landing Page** (`App.jsx`): Marketing website

### Data Flow

1. Content script detects code blocks on the page
2. Uses Esprima to parse JavaScript/TypeScript code
3. Calculates complexity metrics for each function
4. Applies visual highlights and updates widget
5. Popup displays detailed analysis and charts

## 🧪 Development

### Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Build extension files
npm run build:extension

# Watch and rebuild extension
npm run watch:extension

# Preview production build
npm run preview
```

### Building the Extension

1. Run `npm run build:extension`
2. The extension files will be copied to the `extension/` folder
3. Load the extension in Chrome from the `extension/` folder

### Testing

- Test on various supported platforms
- Verify complexity calculations with known code samples
- Check responsive design on different screen sizes
- Test with different code editors and syntax highlighting

## 🚀 Deployment

### Chrome Web Store

1. Build the extension: `npm run build:extension`
2. Create a ZIP file of the `extension/` folder
3. Upload to the Chrome Web Store
4. Submit for review

### Manual Distribution

1. Build the extension: `npm run build:extension`
2. Share the `extension/` folder with users
3. Users can load it as an unpacked extension

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure cross-browser compatibility
- Test on all supported platforms

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Esprima**: JavaScript parser for AST analysis
- **TailwindCSS**: Utility-first CSS framework
- **React**: UI library for building user interfaces
- **Chrome Extensions API**: For browser integration

## 📞 Support

- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions
- **Documentation**: Check the wiki for detailed guides
- **Email**: Contact the maintainers directly

## 🔮 Roadmap

### Upcoming Features

- [ ] Support for more programming languages
- [ ] Advanced complexity metrics (cognitive complexity, maintainability index)
- [ ] Integration with code review tools
- [ ] Team collaboration features
- [ ] Performance optimization suggestions
- [ ] Custom complexity rules and thresholds

### Long-term Goals

- [ ] VS Code extension
- [ ] GitHub Actions integration
- [ ] API for third-party tools
- [ ] Machine learning-based complexity prediction
- [ ] Code quality scoring system

---

**Made with ❤️ by the Live Complexity Visualizer team**

*Help make code better, one function at a time.*

