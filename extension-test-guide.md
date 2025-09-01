# 🧪 CodeLens Extension Testing Guide

This guide will help you test the CodeLens Chrome extension to ensure it's working properly on all supported platforms.

## 🚀 **Quick Test Setup**

1. **Build the extension**:
   ```bash
   npm run build:extension
   ```

2. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Verify extension loaded**:
   - You should see "CodeLens - Complexity Visualizer" in your extensions list
   - The extension icon should appear in your toolbar

## 🎯 **Testing on Different Platforms**

### **GitHub**
1. Go to any GitHub repository with JavaScript files
2. Click on a `.js` file (e.g., `index.js`, `app.js`)
3. Wait for the floating widget to appear (top-right corner)
4. Click the "🔍 Analyze Code" button in the widget
5. Look for color-coded highlights in the code
6. Click the extension icon to open the popup
7. Check the Overview, Functions, and Charts tabs

**Expected Results**:
- ✅ Floating widget appears with complexity score
- ✅ Code functions are highlighted with colors
- ✅ Popup shows detailed analysis
- ✅ Hover over highlights shows tooltips

### **CodeSandbox**
1. Go to [codesandbox.io](https://codesandbox.io)
2. Create a new JavaScript sandbox or open an existing one
3. Add some JavaScript code with functions
4. Wait for the floating widget to appear
5. Click "🔍 Analyze Code" button
6. Check for highlights and open the popup

### **StackBlitz**
1. Go to [stackblitz.com](https://stackblitz.com)
2. Create a new JavaScript project
3. Add code with multiple functions
4. Test the extension functionality

### **Replit**
1. Go to [replit.com](https://replit.com)
2. Create a JavaScript project
3. Add code and test the extension

### **JSFiddle**
1. Go to [jsfiddle.net](https://jsfiddle.net)
2. Add JavaScript code in the JS panel
3. Test the extension

### **CodePen**
1. Go to [codepen.io](https://codepen.io)
2. Create a new pen with JavaScript
3. Test the extension

## 🔍 **What to Look For**

### **Floating Widget**
- Should appear in the top-right corner
- Shows overall complexity score
- Displays function count and average complexity
- Has an "🔍 Analyze Code" button
- Should be draggable

### **Code Highlights**
- **Green**: Low complexity (1-5)
- **Yellow**: Medium complexity (6-10)
- **Red**: High complexity (11-15)
- **Brown**: Extreme complexity (16+)

### **Popup Interface**
- **Overview Tab**: Overall score, function count, average complexity
- **Functions Tab**: List of all functions with complexity scores
- **Charts Tab**: Visual representation of complexity distribution

### **Tooltips**
- Hover over highlighted code should show tooltips
- Tooltips display function name, complexity, line number, and parameters

## 🐛 **Troubleshooting**

### **Extension Not Loading**
- Check Chrome extensions page for errors
- Ensure all files are in the `extension` folder
- Try reloading the extension

### **No Widget Appearing**
- Check browser console for errors
- Ensure you're on a supported platform
- Wait a few seconds for the widget to appear
- Check if the page has JavaScript code

### **No Highlights**
- Click the "🔍 Analyze Code" button manually
- Check browser console for analysis logs
- Ensure the page contains JavaScript code
- Try refreshing the page

### **Analysis Not Working**
- Check browser console for "CodeLens:" logs
- Ensure Esprima library loaded successfully
- Check if the page has code blocks
- Try the manual analyze button

## 📊 **Test Code Examples**

### **Simple Function (Low Complexity)**
```javascript
function add(a, b) {
  return a + b;
}
```

### **Medium Complexity Function**
```javascript
function processArray(items) {
  let result = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i] > 0) {
      result += items[i];
    }
  }
  return result;
}
```

### **High Complexity Function**
```javascript
function complexCalculation(data, options) {
  let total = 0;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.type === 'valid') {
        if (options.includeHigh && item.value > 100) {
          total += item.value * 2;
        } else if (item.value > 50) {
          total += item.value;
        }
        if (item.category === 'premium') {
          total *= 1.5;
        }
      }
    }
  }
  return Math.min(total, 1000);
}
```

## 🔧 **Debug Information**

### **Console Logs to Look For**
```
CodeLens: Setting up content script...
CodeLens: Floating widget created
CodeLens: DOM observer started
CodeLens: Starting initial analysis...
CodeLens: Starting code analysis...
CodeLens: Found code blocks: X
CodeLens: Total functions found: X
CodeLens: Complexity data: {...}
CodeLens: Analysis complete, sending response: {...}
```

### **Common Issues**
1. **Esprima not loading**: Check network tab for CDN errors
2. **No code blocks found**: Verify selectors match the platform
3. **Message passing errors**: Check popup and content script communication
4. **Highlighting issues**: Verify CSS classes are applied correctly

## ✅ **Success Criteria**

The extension is working correctly when:
- ✅ Floating widget appears on supported platforms
- ✅ Manual analyze button works
- ✅ Code complexity is calculated correctly
- ✅ Highlights appear with proper colors
- ✅ Popup shows detailed analysis
- ✅ Function highlighting works
- ✅ Tooltips display correctly
- ✅ Charts render properly

## 🚀 **Next Steps**

Once testing is complete:
1. **Report any bugs** found during testing
2. **Suggest improvements** for specific platforms
3. **Test edge cases** with complex code structures
4. **Verify performance** with large codebases

---

**Happy Testing! 🎉**

If you encounter any issues, check the browser console for detailed logs and refer to the troubleshooting section above.
