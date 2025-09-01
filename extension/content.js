// CodeLens - Complexity Visualizer - Content Script
// Supports multiple programming languages: JavaScript, JSX, C++, C, Java, HTML, CSS

class CodeLensAnalyzer {
  constructor() {
    this.complexityData = {
      overallScore: 0,
      functions: [],
      totalFunctions: 0,
      averageComplexity: 0,
      language: 'unknown',
      fileType: 'unknown'
    }
    this.highlightedElements = new Set()
    this.floatingWidget = null
    this.isAnalyzing = false
    this.esprimaLoaded = false
    
    this.init()
  }

  async init() {
    // Load Esprima first
    await this.loadEsprima()
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup())
    } else {
      this.setup()
    }
  }

  async loadEsprima() {
    if (this.esprimaLoaded) return
    
    try {
      // Load Esprima for JavaScript/JSX parsing
      if (typeof esprima === 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/esprima@4.0.1/dist/esprima.min.js'
        script.onload = () => {
          this.esprimaLoaded = true
          console.log('CodeLens: Esprima loaded successfully')
        }
        script.onerror = () => {
          console.error('CodeLens: Failed to load Esprima')
        }
        document.head.appendChild(script)
      } else {
        this.esprimaLoaded = true
      }
    } catch (error) {
      console.error('CodeLens: Error loading Esprima:', error)
    }
  }

  setup() {
    console.log('CodeLens: Setting up content script...')
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('CodeLens: Content script received message:', request)
      
      switch (request.action) {
        case 'analyzeCode':
          console.log('CodeLens: Starting code analysis...')
          this.analyzePageCode().then(() => {
            console.log('CodeLens: Analysis complete, sending response:', this.complexityData)
            sendResponse({ success: true, data: this.complexityData })
          }).catch(error => {
            console.error('CodeLens: Analysis error:', error)
            sendResponse({ success: false, error: error.message })
          })
          return true // Keep message channel open
          
        case 'getComplexityData':
          console.log('CodeLens: Sending complexity data:', this.complexityData)
          // If no data yet, try to analyze first
          if (this.complexityData.totalFunctions === 0) {
            console.log('CodeLens: No data yet, attempting analysis...')
            this.analyzePageCode().then(() => {
              sendResponse({ success: true, data: this.complexityData })
            }).catch(error => {
              sendResponse({ success: false, error: 'No code found to analyze' })
            })
          } else {
            sendResponse({ success: true, data: this.complexityData })
          }
          return true
          
        case 'highlightFunction':
          console.log('CodeLens: Highlighting function:', request.functionName)
          this.highlightFunctionByName(request.functionName, request.line)
          sendResponse({ success: true })
          return true
          
        case 'ping':
          // Simple ping to check if content script is alive
          console.log('CodeLens: Ping received')
          sendResponse({ success: true, message: 'pong' })
          return true
          
        case 'toggleWidget':
          // Toggle widget visibility
          if (this.floatingWidget && this.floatingWidget.style.display !== 'none') {
            this.hideFloatingWidget()
          } else {
            this.showFloatingWidget()
          }
          sendResponse({ success: true })
          return true
      }
    })

    // Add keyboard shortcut (Ctrl+Shift+L to toggle widget)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault()
        if (this.floatingWidget && this.floatingWidget.style.display !== 'none') {
          this.hideFloatingWidget()
        } else {
          this.showFloatingWidget()
        }
        console.log('CodeLens: Widget toggled via keyboard shortcut')
      }
    })

    // Create floating widget
    this.createFloatingWidget()
    console.log('CodeLens: Floating widget created')
    
    // Start observing DOM changes
    this.observeDOMChanges()
    console.log('CodeLens: DOM observer started')
    
    // Initial analysis after a delay
    setTimeout(() => {
      console.log('CodeLens: Starting initial analysis...')
      this.analyzePageCode()
    }, 3000)
    
    // Also try to analyze immediately if page seems ready
    if (document.readyState === 'complete') {
      console.log('CodeLens: Page already loaded, analyzing immediately...')
      setTimeout(() => this.analyzePageCode(), 1000)
    }
  }

  createFloatingWidget() {
    if (this.floatingWidget) return
    
    const widget = document.createElement('div')
    widget.id = 'codelens-widget'
    widget.className = 'codelens-widget'
    widget.innerHTML = `
      <div class="widget-header">
        <span class="widget-title">CodeLens</span>
        <button class="widget-close" id="codelens-close">×</button>
      </div>
      <div class="widget-content">
        <div class="complexity-score">
          <div class="score-label">Complexity</div>
          <div class="score-number" id="codelens-score">-</div>
        </div>
        <div class="function-count">
          <div class="count-label">Functions</div>
          <div class="count-number" id="codelens-count">-</div>
        </div>
        <button class="analyze-btn" id="codelens-analyze">🔍 Analyze Code</button>
      </div>
    `
    
    document.body.appendChild(widget)
    this.floatingWidget = widget
    
    // Add event listeners
    const analyzeBtn = widget.querySelector('#codelens-analyze')
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        this.analyzePageCode()
      })
    }
    
    // Add close button functionality
    const closeBtn = widget.querySelector('#codelens-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideFloatingWidget()
      })
    }
    
    // Make widget draggable
    this.makeWidgetDraggable(widget)
  }

  makeWidgetDraggable(widget) {
    let isDragging = false
    let startX, startY, startLeft, startTop
    
    const header = widget.querySelector('.widget-header')
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      startLeft = parseInt(widget.style.left) || 0
      startTop = parseInt(widget.style.top) || 0
      
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
    
    const onMouseMove = (e) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      widget.style.left = (startLeft + deltaX) + 'px'
      widget.style.top = (startTop + deltaY) + 'px'
    }
    
    const onMouseUp = () => {
      isDragging = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }

  updateFloatingWidget() {
    if (!this.floatingWidget) return
    
    const scoreElement = this.floatingWidget.querySelector('#codelens-score')
    const countElement = this.floatingWidget.querySelector('#codelens-count')
    
    if (scoreElement) {
      // Round the overall score to 2 decimal places
      const roundedScore = typeof this.complexityData.overallScore === 'number' 
        ? this.complexityData.overallScore.toFixed(2) 
        : this.complexityData.overallScore
      scoreElement.textContent = roundedScore
      scoreElement.className = `score-number ${this.getComplexityColorClass(this.complexityData.overallScore)}`
    }
    
    if (countElement) {
      countElement.textContent = this.complexityData.totalFunctions
    }
  }

  observeDOMChanges() {
    if (this.observer) {
      this.observer.disconnect()
    }
    
    this.observer = new MutationObserver((mutations) => {
      let shouldReanalyze = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new code blocks were added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (this.looksLikeCode(node) || node.querySelector && node.querySelector('code, pre, .CodeMirror-line')) {
                shouldReanalyze = true
              }
            }
          })
        }
      })
      
      if (shouldReanalyze) {
        console.log('CodeLens: DOM changed, reanalyzing...')
        setTimeout(() => this.analyzePageCode(), 1000)
      }
    })
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  async analyzePageCode() {
    console.log('CodeLens: Starting code analysis...')
    
    // Load Esprima if needed
    await this.loadEsprima()
    
    const codeBlocks = this.findCodeBlocks()
    console.log('CodeLens: Found code blocks:', codeBlocks.length)
    
    if (codeBlocks.length === 0) {
      console.log('CodeLens: No code blocks found')
      return
    }
    
    let allFunctions = []
    let totalComplexity = 0
    let detectedLanguage = 'unknown'
    
    for (const block of codeBlocks) {
      const code = block.textContent || block.innerText || ''
      if (code.trim()) {
        // Detect language for this block
        const language = this.detectLanguage(block.dataset.filename || '', code)
        detectedLanguage = language
        
        console.log('CodeLens: Analyzing', language, 'code block')
        
        // Analyze based on language
        const result = this.calculateComplexityForLanguage(code, language)
        
        if (result.functions && result.functions.length > 0) {
          allFunctions.push(...result.functions)
          totalComplexity += result.overallScore
        }
      }
    }
    
    // Update complexity data
    this.complexityData = {
      overallScore: totalComplexity,
      functions: allFunctions,
      totalFunctions: allFunctions.length,
      averageComplexity: allFunctions.length > 0 ? totalComplexity / allFunctions.length : 0,
      language: detectedLanguage,
      fileType: this.getFileExtension() || 'unknown'
    }
    
    console.log('CodeLens: Analysis complete:', this.complexityData)
    
    // Update floating widget
    this.updateFloatingWidget()
    
    // Apply highlights
    this.highlightAllFunctions()
  }

  getFileExtension() {
    // Try to get file extension from URL or page content
    const url = window.location.href
    const pathMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
    if (pathMatch) {
      return pathMatch[1].toLowerCase()
    }
    
    // Check for file extension in page title or content
    const title = document.title.toLowerCase()
    const extensions = ['js', 'jsx', 'ts', 'tsx', 'cpp', 'c', 'java', 'py', 'html', 'css']
    for (const ext of extensions) {
      if (title.includes('.' + ext)) {
        return ext
      }
    }
    
    return 'unknown'
  }

  findCodeBlocks() {
    const selectors = [
      // GitHub
      '.blob-code-inner',
      '.highlight .blob-code',
      '.js-file-line',
      '.CodeMirror-line',
      
      // CodeSandbox
      '.monaco-editor .view-line',
      '.CodeMirror-line',
      
      // StackBlitz
      '.ace_editor .ace_line',
      '.monaco-editor .view-line',
      
      // Replit
      '.ace_editor .ace_line',
      '.CodeMirror-line',
      
      // JSFiddle
      '.CodeMirror-line',
      '.ace_editor .ace_line',
      
      // CodePen
      '.CodeMirror-line',
      '.ace_editor .ace_line',
      
      // Generic
      'code',
      'pre',
      '[class*="code"]',
      '[class*="Code"]',
      '[class*="editor"]',
      '[class*="Editor"]'
    ]
    
    const codeBlocks = []
    
    // Find by selectors
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          if (this.looksLikeCode(element) && !codeBlocks.includes(element)) {
            codeBlocks.push(element)
          }
        })
      } catch (error) {
        console.log('CodeLens: Error with selector:', selector, error)
      }
    })
    
    // Find code in text nodes
    this.findCodeInTextNodes(codeBlocks)
    
    console.log('CodeLens: Total code blocks found:', codeBlocks.length)
    return codeBlocks
  }

  looksLikeCode(element) {
    if (!element || !element.textContent) return false
    
    const text = element.textContent.trim()
    if (text.length < 10) return false
    
    // Check for code-like patterns
    const codePatterns = [
      /function\s+\w+\s*\(/,
      /def\s+\w+\s*\(/,
      /int\s+\w+\s*\(/,
      /void\s+\w+\s*\(/,
      /public\s+class/,
      /import\s+/,
      /#include/,
      /<script/,
      /<style/,
      /{[\s\S]*}/,
      /[\w]+\s*[:=]\s*function/,
      /[\w]+\s*[:=]\s*\([^)]*\)\s*=>/
    ]
    
    return codePatterns.some(pattern => pattern.test(text))
  }

  findCodeInTextNodes(existingBlocks) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (node.textContent && node.textContent.trim().length > 50) {
            const text = node.textContent.trim()
            if (this.looksLikeCode({ textContent: text })) {
              return NodeFilter.FILTER_ACCEPT
            }
          }
          return NodeFilter.FILTER_REJECT
        }
      }
    )
    
    let node
    while (node = walker.nextNode()) {
      const parent = node.parentElement
      if (parent && !existingBlocks.includes(parent)) {
        existingBlocks.push(parent)
      }
    }
  }

  detectLanguage(fileName, content) {
    if (!fileName && !content) return 'unknown'
    
    // File extension detection
    if (fileName) {
      const extension = fileName.toLowerCase().split('.').pop()
      const languageMap = {
        'js': 'javascript',
        'jsx': 'jsx',
        'ts': 'typescript',
        'tsx': 'typescript',
        'cpp': 'cpp',
        'cc': 'cpp',
        'cxx': 'cpp',
        'c': 'c',
        'java': 'java',
        'py': 'python',
        'rb': 'ruby',
        'php': 'php',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'scala': 'scala',
        'html': 'html',
        'htm': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'less': 'less',
        'vue': 'vue',
        'svelte': 'svelte'
      }
      
      if (languageMap[extension]) {
        return languageMap[extension]
      }
    }
    
    // Content-based detection for languages without clear extensions
    if (content) {
      const firstLine = content.trim().split('\n')[0].toLowerCase()
      
      // Shebang detection
      if (firstLine.startsWith('#!')) {
        if (firstLine.includes('python')) return 'python'
        if (firstLine.includes('ruby')) return 'ruby'
        if (firstLine.includes('bash')) return 'bash'
        if (firstLine.includes('sh')) return 'bash'
        if (firstLine.includes('perl')) return 'perl'
      }
      
      // HTML detection
      if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
        return 'html'
      }
      
      // CSS detection
      if (content.includes('{') && content.includes('}') && 
          (content.includes('color:') || content.includes('background:') || content.includes('margin:'))) {
        return 'css'
      }
      
      // Python detection
      if (content.includes('def ') && content.includes(':') && content.includes('import ')) {
        return 'python'
      }
      
      // Java detection
      if (content.includes('public class') || content.includes('private class') || content.includes('import java.')) {
        return 'java'
      }
      
      // C/C++ detection
      if (content.includes('#include') && (content.includes('int main') || content.includes('void main'))) {
        return content.includes('iostream') || content.includes('namespace') ? 'cpp' : 'c'
      }
    }
    
    return 'unknown'
  }

  calculateComplexityForLanguage(code, language) {
    switch (language) {
      case 'javascript':
      case 'jsx':
      case 'typescript':
      case 'tsx':
        return this.calculateJavaScriptComplexity(code)
      case 'cpp':
      case 'c':
        return this.calculateCppComplexity(code)
      case 'java':
        return this.calculateJavaComplexity(code)
      case 'python':
        return this.calculatePythonComplexity(code)
      case 'html':
        return this.calculateHtmlComplexity(code)
      case 'css':
        return this.calculateCssComplexity(code)
      default:
        return this.calculateGenericComplexity(code)
    }
  }

  calculateJavaScriptComplexity(code) {
    if (!this.esprimaLoaded) {
      console.log('CodeLens: Esprima not loaded yet, waiting...')
      return { functions: [], overallScore: 0 }
    }

    try {
      const ast = esprima.parseModule(code, { range: true, loc: true })
      const functions = []
      let totalComplexity = 0

      const traverse = (node) => {
        if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || 
            node.type === 'ArrowFunctionExpression' || node.type === 'MethodDefinition') {
          let complexity = 1 // Base complexity
          
          // Count decision points
          const countDecisions = (n) => {
            if (n.type === 'IfStatement' || n.type === 'SwitchCase' || 
                n.type === 'CatchClause' || n.type === 'ForStatement' || 
                n.type === 'ForInStatement' || n.type === 'ForOfStatement' || 
                n.type === 'WhileStatement' || n.type === 'DoWhileStatement' || 
                n.type === 'ConditionalExpression' || n.type === 'LogicalExpression') {
              complexity++
            }
            if (n.body) {
              if (Array.isArray(n.body)) {
                n.body.forEach(countDecisions)
              } else {
                countDecisions(n.body)
              }
            }
            if (n.test) countDecisions(n.test)
            if (n.consequent) countDecisions(n.consequent)
            if (n.alternate) countDecisions(n.alternate)
            if (n.left) countDecisions(n.left)
            if (n.right) countDecisions(n.right)
          }
          
          countDecisions(node)
          
          const functionName = node.id ? node.id.name : 
                             (node.key ? node.key.name : 'anonymous')
          
          functions.push({
            name: functionName,
            complexity: complexity,
            line: node.loc.start.line,
            type: node.type,
            label: this.getComplexityLabel(complexity),
            colorClass: this.getComplexityColorClass(complexity)
          })
          
          totalComplexity += complexity
        }
        
        // Traverse child nodes
        Object.keys(node).forEach(key => {
          if (node[key] && typeof node[key] === 'object') {
            if (Array.isArray(node[key])) {
              node[key].forEach(traverse)
            } else {
              traverse(node[key])
            }
          }
        })
      }
      
      traverse(ast)
      
      return {
        functions: functions,
        overallScore: totalComplexity,
        totalFunctions: functions.length,
        averageComplexity: functions.length > 0 ? totalComplexity / functions.length : 0
      }
    } catch (error) {
      console.error('CodeLens: Error parsing JavaScript:', error)
      return { functions: [], overallScore: 0, totalFunctions: 0, averageComplexity: 0 }
    }
  }

  calculateCppComplexity(code) {
    const functions = []
    let totalComplexity = 0
    
    // Simple regex-based parsing for C/C++
    const functionRegex = /(?:int|void|char|float|double|bool|auto|template\s*<[^>]*>\s*)?\s*(\w+)\s*\([^)]*\)\s*\{/g
    const ifRegex = /if\s*\(/g
    const forRegex = /for\s*\(/g
    const whileRegex = /while\s*\(/g
    const switchRegex = /switch\s*\(/g
    const caseRegex = /case\s+/g
    const catchRegex = /catch\s*\(/g
    
    let match
    let lineNumber = 1
    
    // Count lines for approximate line numbers
    const lines = code.split('\n')
    
    while ((match = functionRegex.exec(code)) !== null) {
      const functionName = match[1]
      const functionStart = match.index
      
      // Find function end (simplified)
      let braceCount = 0
      let functionEnd = functionStart
      let inFunction = false
      
      for (let i = functionStart; i < code.length; i++) {
        if (code[i] === '{') {
          if (!inFunction) inFunction = true
          braceCount++
        } else if (code[i] === '}') {
          braceCount--
          if (inFunction && braceCount === 0) {
            functionEnd = i
            break
          }
        }
      }
      
      if (functionEnd > functionStart) {
        const functionCode = code.substring(functionStart, functionEnd)
        let complexity = 1
        
        // Count decision points
        complexity += (functionCode.match(ifRegex) || []).length
        complexity += (functionCode.match(forRegex) || []).length
        complexity += (functionCode.match(whileRegex) || []).length
        complexity += (functionCode.match(switchRegex) || []).length
        complexity += (functionCode.match(caseRegex) || []).length
        complexity += (functionCode.match(catchRegex) || []).length
        
        // Estimate line number
        const beforeFunction = code.substring(0, functionStart)
        const estimatedLine = beforeFunction.split('\n').length
        
        functions.push({
          name: functionName,
          complexity: complexity,
          line: estimatedLine,
          type: 'function',
          label: this.getComplexityLabel(complexity),
          colorClass: this.getComplexityColorClass(complexity)
        })
        
        totalComplexity += complexity
      }
    }
    
    return {
      functions: functions,
      overallScore: totalComplexity,
      totalFunctions: functions.length,
      averageComplexity: functions.length > 0 ? totalComplexity / functions.length : 0
    }
  }

  calculateJavaComplexity(code) {
    const functions = []
    let totalComplexity = 0
    
    // Java method detection
    const methodRegex = /(?:public|private|protected|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\) *\{?[^\{]*\{/g
    const ifRegex = /if\s*\(/g
    const forRegex = /for\s*\(/g
    const whileRegex = /while\s*\(/g
    const switchRegex = /switch\s*\(/g
    const caseRegex = /case\s+/g
    const catchRegex = /catch\s*\(/g
    
    let match
    
    while ((match = methodRegex.exec(code)) !== null) {
      const methodName = match[1]
      const methodStart = match.index
      
      // Find method end (simplified)
      let braceCount = 0
      let methodEnd = methodStart
      let inMethod = false
      
      for (let i = methodStart; i < code.length; i++) {
        if (code[i] === '{') {
          if (!inMethod) inMethod = true
          braceCount++
        } else if (code[i] === '}') {
          braceCount--
          if (inMethod && braceCount === 0) {
            methodEnd = i
            break
          }
        }
      }
      
      if (methodEnd > methodStart) {
        const methodCode = code.substring(methodStart, methodEnd)
        let complexity = 1
        
        // Count decision points
        complexity += (methodCode.match(ifRegex) || []).length
        complexity += (methodCode.match(forRegex) || []).length
        complexity += (methodCode.match(whileRegex) || []).length
        complexity += (methodCode.match(switchRegex) || []).length
        complexity += (methodCode.match(caseRegex) || []).length
        complexity += (methodCode.match(catchRegex) || []).length
        
        // Estimate line number
        const beforeMethod = code.substring(0, methodStart)
        const estimatedLine = beforeMethod.split('\n').length
        
        functions.push({
          name: methodName,
          complexity: complexity,
          line: estimatedLine,
          type: 'method',
          label: this.getComplexityLabel(complexity),
          colorClass: this.getComplexityColorClass(complexity)
        })
        
        totalComplexity += complexity
      }
    }
    
    return {
      functions: functions,
      overallScore: totalComplexity,
      totalFunctions: functions.length,
      averageComplexity: functions.length > 0 ? totalComplexity / functions.length : 0
    }
  }

  calculatePythonComplexity(code) {
    const functions = []
    let totalComplexity = 0
    
    // Python function detection
    const functionRegex = /def\s+(\w+)\s*\([^)]*\)\s*:/g
    const ifRegex = /if\s+/g
    const forRegex = /for\s+/g
    const whileRegex = /while\s+/g
    const exceptRegex = /except\s+/g
    const elifRegex = /elif\s+/g
    
    let match
    
    while ((match = functionRegex.exec(code)) !== null) {
      const functionName = match[1]
      const functionStart = match.index
      
      // Find function end (simplified - look for next function or end of indentation)
      let functionEnd = code.length
      const lines = code.split('\n')
      const functionLineIndex = code.substring(0, functionStart).split('\n').length - 1
      
      for (let i = functionLineIndex + 1; i < lines.length; i++) {
        const line = lines[i]
        if (line.trim() === '' || line.match(/^def\s+/) || 
            (line.match(/^\S/) && !line.startsWith(' '))) {
          functionEnd = code.indexOf('\n', code.indexOf('\n', functionStart) + 1)
          break
        }
      }
      
      if (functionEnd > functionStart) {
        const functionCode = code.substring(functionStart, functionEnd)
        let complexity = 1
        
        // Count decision points
        complexity += (functionCode.match(ifRegex) || []).length
        complexity += (functionCode.match(forRegex) || []).length
        complexity += (functionCode.match(whileRegex) || []).length
        complexity += (functionCode.match(exceptRegex) || []).length
        complexity += (functionCode.match(elifRegex) || []).length
        
        functions.push({
          name: functionName,
          complexity: complexity,
          line: functionLineIndex + 1,
          type: 'function',
          label: this.getComplexityLabel(complexity),
          colorClass: this.getComplexityColorClass(complexity)
        })
        
        totalComplexity += complexity
      }
    }
    
    return {
      functions: functions,
      overallScore: totalComplexity,
      totalFunctions: functions.length,
      averageComplexity: functions.length > 0 ? totalComplexity / functions.length : 0
    }
  }

  calculateHtmlComplexity(code) {
    const functions = []
    let totalComplexity = 0
    
    // HTML complexity is based on nesting depth and script tags
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
    const divRegex = /<div[^>]*>/gi
    const spanRegex = /<span[^>]*>/gi
    const pRegex = /<p[^>]*>/gi
    
    let match
    let maxNesting = 0
    let currentNesting = 0
    
    // Count script complexity
    while ((match = scriptRegex.exec(code)) !== null) {
      const scriptContent = match[1]
      if (scriptContent.trim()) {
        // Analyze JavaScript within HTML
        const jsResult = this.calculateJavaScriptComplexity(scriptContent)
        functions.push(...jsResult.functions)
        totalComplexity += jsResult.overallScore
      }
    }
    
    // Count HTML nesting complexity
    const lines = code.split('\n')
    for (const line of lines) {
      if (line.includes('<div') || line.includes('<section') || line.includes('<article')) {
        currentNesting++
        maxNesting = Math.max(maxNesting, currentNesting)
      } else if (line.includes('</div') || line.includes('</section') || line.includes('</article')) {
        currentNesting = Math.max(0, currentNesting - 1)
      }
    }
    
    // Add HTML structure complexity
    if (maxNesting > 0) {
      functions.push({
        name: 'HTML Structure',
        complexity: Math.min(maxNesting, 10),
        line: 1,
        type: 'structure',
        label: this.getComplexityLabel(Math.min(maxNesting, 10)),
        colorClass: this.getComplexityColorClass(Math.min(maxNesting, 10))
      })
      totalComplexity += Math.min(maxNesting, 10)
    }
    
    return {
      functions: functions,
      overallScore: totalComplexity,
      totalFunctions: functions.length,
      averageComplexity: functions.length > 0 ? totalComplexity / functions.length : 0
    }
  }

  calculateCssComplexity(code) {
    const functions = []
    let totalComplexity = 0
    
    // CSS complexity is based on selectors, properties, and nesting
    const selectorRegex = /([.#]?\w+(?:\[[^\]]*\])?(?:\:[^\s]*)?(?:\.[^\s]*)?)/g
    const propertyRegex = /[a-zA-Z\-]+\s*:/g
    const mediaQueryRegex = /@media[^{]+{/g
    const keyframeRegex = /@keyframes[^{]+{/g
    
    const selectors = (code.match(selectorRegex) || []).length
    const properties = (code.match(propertyRegex) || []).length
    const mediaQueries = (code.match(mediaQueryRegex) || []).length
    const keyframes = (code.match(keyframeRegex) || []).length
    
    // Calculate complexity based on CSS features
    let complexity = 1
    complexity += Math.min(selectors / 10, 5) // Selector complexity
    complexity += Math.min(properties / 20, 5) // Property complexity
    complexity += mediaQueries * 2 // Media query complexity
    complexity += keyframes * 2 // Animation complexity
    
    functions.push({
      name: 'CSS Stylesheet',
      complexity: Math.round(complexity),
      line: 1,
      type: 'stylesheet',
      label: this.getComplexityLabel(Math.round(complexity)),
      colorClass: this.getComplexityColorClass(Math.round(complexity))
    })
    
    totalComplexity = complexity
    
    return {
      functions: functions,
      overallScore: totalComplexity,
      totalFunctions: functions.length,
      averageComplexity: totalComplexity
    }
  }

  calculateGenericComplexity(code) {
    // Generic complexity calculation for unknown languages
    const functions = []
    let totalComplexity = 0
    
    // Look for common patterns
    const functionPatterns = [
      /function\s+(\w+)/g,
      /def\s+(\w+)/g,
      /(\w+)\s*\([^)]*\)\s*\{/g,
      /(\w+)\s*\([^)]*\)\s*:/g
    ]
    
    let foundFunctions = new Set()
    
    for (const pattern of functionPatterns) {
      let match
      while ((match = pattern.exec(code)) !== null) {
        const functionName = match[1]
        if (!foundFunctions.has(functionName)) {
          foundFunctions.add(functionName)
          
          // Estimate complexity based on code length and structure
          const functionStart = match.index
          let complexity = 1
          
          // Count basic complexity indicators
          const lines = code.substring(functionStart).split('\n')
          complexity += Math.min(lines.length / 10, 5)
          
          // Count decision points
          const decisionKeywords = ['if', 'for', 'while', 'switch', 'case', 'catch', 'except']
          for (const keyword of decisionKeywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g')
            complexity += (code.substring(functionStart).match(regex) || []).length
          }
          
          functions.push({
            name: functionName,
            complexity: Math.min(complexity, 15),
            line: code.substring(0, functionStart).split('\n').length,
            type: 'function',
            label: this.getComplexityLabel(Math.min(complexity, 15)),
            colorClass: this.getComplexityColorClass(Math.min(complexity, 15))
          })
          
          totalComplexity += Math.min(complexity, 15)
        }
      }
    }
    
    return {
      functions: functions,
      overallScore: totalComplexity,
      totalFunctions: functions.length,
      averageComplexity: functions.length > 0 ? totalComplexity / functions.length : 0
    }
  }

  getComplexityLabel(complexity) {
    if (complexity <= 5) return 'Low'
    if (complexity <= 10) return 'Medium'
    if (complexity <= 15) return 'High'
    return 'Extreme'
  }

  getComplexityColorClass(complexity) {
    if (complexity <= 5) return 'complexity-low'
    if (complexity <= 10) return 'complexity-medium'
    if (complexity <= 15) return 'complexity-high'
    return 'complexity-extreme'
  }

  highlightAllFunctions() {
    this.clearHighlights()
    
    this.complexityData.functions.forEach(func => {
      this.highlightFunction(func)
    })
  }

  highlightFunction(func) {
    const codeBlocks = this.findCodeBlocks()
    
    for (const block of codeBlocks) {
      const text = block.textContent || block.innerText || ''
      if (text.includes(func.name)) {
        const container = this.findHighlightContainer(block)
        
        // Add complexity class
        const complexityClass = this.getComplexityColorClass(func.complexity)
        container.classList.add('complexity-highlight', complexityClass)
        
        // Add tooltip
        container.title = `${func.name}: ${func.complexity} complexity (${func.label})`
        
        this.highlightedElements.add(container)
        break
      }
    }
  }

  findHighlightContainer(element) {
    // Try to find the best container for highlighting
    let container = element
    
    // Look for common code containers
    const codeContainers = [
      '.blob-code',
      '.js-file-line',
      '.CodeMirror-line',
      '.monaco-editor .view-line',
      '.ace_editor .ace_line',
      'code',
      'pre'
    ]
    
    for (const selector of codeContainers) {
      const found = element.closest(selector)
      if (found) {
        container = found
        break
      }
    }
    
    // If no specific container found, use the element itself
    return container
  }

  clearHighlights() {
    this.highlightedElements.forEach(element => {
      element.classList.remove('complexity-highlight', 'complexity-low', 'complexity-medium', 'complexity-high', 'complexity-extreme')
      element.title = ''
    })
    this.highlightedElements.clear()
  }

  highlightFunctionByName(functionName, lineNumber) {
    const func = this.complexityData.functions.find(f => 
      f.name === functionName || f.line === lineNumber
    )
    
    if (func) {
      this.highlightFunction(func)
      
      // Scroll to function
      const codeBlocks = this.findCodeBlocks()
      for (const block of codeBlocks) {
        const text = block.textContent || block.innerText || ''
        if (text.includes(func.name)) {
          block.scrollIntoView({ behavior: 'smooth', block: 'center' })
          break
        }
      }
    }
  }

  hideFloatingWidget() {
    if (this.floatingWidget) {
      this.floatingWidget.style.display = 'none'
      console.log('CodeLens: Floating widget hidden')
      
      // Create a small show widget button
      this.createShowWidgetButton()
    }
  }

  showFloatingWidget() {
    if (this.floatingWidget) {
      this.floatingWidget.style.display = 'block'
      console.log('CodeLens: Floating widget shown')
      
      // Remove the show widget button if it exists
      this.removeShowWidgetButton()
    }
  }

  createShowWidgetButton() {
    // Remove any existing show button
    this.removeShowWidgetButton()
    
    const showBtn = document.createElement('div')
    showBtn.id = 'codelens-show-widget'
    showBtn.className = 'codelens-show-widget'
    showBtn.innerHTML = '🔍'
    showBtn.title = 'Show CodeLens Widget'
    
    // Position it where the widget was
    if (this.floatingWidget) {
      const rect = this.floatingWidget.getBoundingClientRect()
      showBtn.style.left = (rect.right - 40) + 'px'
      showBtn.style.top = rect.top + 'px'
    }
    
    showBtn.addEventListener('click', () => {
      this.showFloatingWidget()
    })
    
    document.body.appendChild(showBtn)
    this.showWidgetButton = showBtn
  }

  removeShowWidgetButton() {
    if (this.showWidgetButton) {
      this.showWidgetButton.remove()
      this.showWidgetButton = null
    }
  }
}

// Initialize the analyzer
let analyzer

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    analyzer = new CodeLensAnalyzer()
    analyzer.setup()
  })
} else {
  analyzer = new CodeLensAnalyzer()
  analyzer.setup()
}
