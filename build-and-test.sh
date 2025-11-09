#!/bin/bash

# CodeLens v1.1.0 - Quick Build & Test Script
# This script builds the extension and prepares it for testing

echo "🚀 CodeLens v1.1.0 - Build & Test Setup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build the project
echo -e "${BLUE}📦 Step 1: Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Build failed. Please check for errors.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""

# Step 2: Copy files to extension directory
echo -e "${BLUE}📋 Step 2: Copying files to extension directory...${NC}"
cp -r dist/* extension/

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Failed to copy files.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Files copied successfully!${NC}"
echo ""

# Step 3: Verify extension files
echo -e "${BLUE}🔍 Step 3: Verifying extension files...${NC}"

if [ -f "extension/manifest.json" ]; then
    VERSION=$(grep -o '"version": "[^"]*' extension/manifest.json | cut -d'"' -f4)
    echo -e "${GREEN}✅ manifest.json found (Version: $VERSION)${NC}"
else
    echo -e "${YELLOW}⚠️  manifest.json not found!${NC}"
    exit 1
fi

if [ -f "extension/popup.html" ]; then
    echo -e "${GREEN}✅ popup.html found${NC}"
else
    echo -e "${YELLOW}⚠️  popup.html not found!${NC}"
    exit 1
fi

if [ -f "extension/content.js" ]; then
    echo -e "${GREEN}✅ content.js found${NC}"
else
    echo -e "${YELLOW}⚠️  content.js not found!${NC}"
    exit 1
fi

if [ -f "extension/background.js" ]; then
    echo -e "${GREEN}✅ background.js found${NC}"
else
    echo -e "${YELLOW}⚠️  background.js not found!${NC}"
    exit 1
fi

echo ""

# Step 4: Show next steps
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "========================================"
echo ""
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top-right)"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'extension' folder from this directory"
echo ""
echo -e "${GREEN}5. Test the extension:${NC}"
echo "   - Navigate to GitHub (e.g., https://github.com/facebook/react)"
echo "   - Open any JavaScript file"
echo "   - Click the CodeLens icon in Chrome toolbar"
echo "   - Click 'Analyze Code' button"
echo ""
echo -e "${BLUE}📖 For detailed testing instructions, see:${NC}"
echo "   TESTING-GUIDE.md"
echo ""
echo -e "${GREEN}🎉 Extension is ready to test!${NC}"
echo ""

# Optional: Create a ZIP file for distribution
read -p "Do you want to create a ZIP file for Chrome Web Store? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${BLUE}📦 Creating ZIP file...${NC}"
    cd extension
    zip -r ../codelens-v1.1.0.zip . -x "*.DS_Store"
    cd ..
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ ZIP file created: codelens-v1.1.0.zip${NC}"
        echo "   You can upload this file to Chrome Web Store"
    else
        echo -e "${YELLOW}⚠️  Failed to create ZIP file${NC}"
    fi
fi

echo ""
echo -e "${GREEN}Done! 🚀${NC}"
