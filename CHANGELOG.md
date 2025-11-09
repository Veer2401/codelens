# CodeLens Changelog

All notable changes to CodeLens will be documented in this file.

## [1.1.0] - 2025-11-09

### 🎨 Design Overhaul - Modern Dark Theme

#### Added
- **Modern Dark Theme**: Complete UI redesign with dark gradient background
  - Sleek slate-900/800 gradient background
  - Violet/purple accent colors throughout
  - Glass-morphism effects with backdrop blur
  - Enhanced visual hierarchy

- **Rounded Design Elements**:
  - All buttons now use rounded-2xl for modern look
  - Cards and containers have rounded corners
  - Badges and labels have rounded-full style
  - Smooth border radius transitions

- **Enhanced Header**:
  - Gradient violet/purple header bar
  - Eye icon in rounded container with backdrop blur
  - Refresh button with hover effects
  - Better spacing and typography

- **Improved Buttons**:
  - Large "Analyze Code" button with gradient background
  - Hover effects with scale and shadow animations
  - Active states with proper feedback
  - Disabled states with opacity

- **Better Tab Navigation**:
  - Active tabs now have gradient background
  - Rounded top corners for selected tabs
  - Smooth transitions between states
  - Clear visual distinction

#### Changed
- **Popup Component**:
  - Background from white to dark gradient
  - All text colors optimized for dark theme
  - Platform info bar with semi-transparent background
  - Error displays with dark theme styling

- **ComplexityScore Component**:
  - Card with gradient dark background
  - Progress bar with gradient colors
  - Larger score display with gradient text
  - Enhanced emoji indicators

- **FunctionList Component**:
  - Function cards with dark backgrounds
  - Color-coded complexity badges with borders
  - Improved hover states
  - Better spacing and padding
  - Distribution summary with rounded badges

- **ComplexityChart Component**:
  - All charts adapted to dark theme
  - Gradient bar charts
  - Dark backgrounds for visualizations
  - Enhanced legend styling
  - Statistics cards with gradient backgrounds

#### Improved
- Visual contrast for better readability
- Consistent spacing and padding throughout
- Smooth transitions and animations (duration-200, duration-300)
- Better hover states on all interactive elements
- Enhanced shadow effects for depth
- Improved color palette for accessibility

#### Technical
- Updated version to 1.1.0 in manifest.json
- Updated version to 1.1.0 in package.json
- Maintained backward compatibility
- No breaking changes to functionality

---

## [1.0.0] - 2024

### 🚀 Initial Release

#### Features
- Real-time code complexity analysis
- Support for multiple coding platforms:
  - GitHub, GitLab, Bitbucket
  - CodeSandbox, StackBlitz, Replit
  - CodePen, JSFiddle
  - Pastebin, Gist
- Cyclomatic complexity calculation using Esprima
- Three main views:
  - Overview: Quick stats and tips
  - Functions: Detailed function list
  - Charts: Visual complexity analysis
- Function highlighting in source code
- Live updates when code changes
- Chrome extension with popup interface
- Background service worker
- Content script injection

#### Technical
- Built with React 18
- Vite for building and bundling
- TailwindCSS for styling
- Recharts for visualizations
- Esprima for JavaScript parsing
- Chrome Extension Manifest V3

---

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes

---

## Upgrade Notes

### From 1.0.x to 1.1.0
- **No breaking changes**
- Visual design completely refreshed
- All existing functionality preserved
- No migration needed
- Simply replace extension files and reload

---

## Future Roadmap

### Planned for 1.2.0
- [ ] Settings panel for customization
- [ ] Light/Dark theme toggle
- [ ] Custom complexity thresholds
- [ ] Export complexity reports
- [ ] Additional language support

### Planned for 2.0.0
- [ ] TypeScript support
- [ ] Python complexity analysis
- [ ] Historical trend tracking
- [ ] Team collaboration features
- [ ] API for external integrations

---

## Links
- Chrome Web Store: [Coming Soon]
- GitHub Repository: [Your Repo]
- Documentation: [Your Docs]
- Bug Reports: [Your Issues]
