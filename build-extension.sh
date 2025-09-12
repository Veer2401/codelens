#!/bin/bash

# Live Complexity Visualizer - Extension Build Script

echo "🚀 Building Live Complexity Visualizer Extension..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the React app
echo "🔨 Building React app..."
npm run build

# Create extension directory if it doesn't exist
if [ ! -d "extension" ]; then
    mkdir -p extension
fi

# Copy built files to extension directory
echo "📁 Copying built files to extension directory..."
cp -r dist/* extension/

# Extension-specific files are already in extension/ directory
echo "📋 Extension files are ready..."

# Create icons directory if it doesn't exist
if [ ! -d "extension/icons" ]; then
    mkdir -p extension/icons
fi

# Create placeholder icons (you should replace these with actual icons)
echo "🎨 Creating placeholder icons..."
cat > extension/icons/icon16.png << 'EOF'
# This is a placeholder. Replace with actual 16x16 PNG icon
EOF

cat > extension/icons/icon32.png << 'EOF'
# This is a placeholder. Replace with actual 32x32 PNG icon
EOF

cat > extension/icons/icon48.png << 'EOF'
# This is a placeholder. Replace with actual 48x48 PNG icon
EOF

cat > extension/icons/icon128.png << 'EOF'
# This is a placeholder. Replace with actual 128x128 PNG icon
EOF

echo "✅ Extension built successfully!"
echo ""
echo "📌 To load the extension in Chrome:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'extension' folder"
echo ""
echo "🎯 The extension will now work on supported platforms:"
echo "   - GitHub, CodeSandbox, StackBlitz, Replit, JSFiddle, CodePen"
echo ""
echo "🔧 To rebuild after changes, run this script again."
