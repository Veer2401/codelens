// Live Complexity Visualizer - Content Script
// Analyzes code complexity using Esprima and injects visual highlights

class ComplexityAnalyzer {
  constructor() {
    this.complexityData = {
      overallScore: 0,
      functions: [],
      totalFunctions: 0,
      averageComplexity: 0
    }
    this.highlightedElements = new Set()
    this.floatingWidget = null
    this.isAnalyzing = false
    
    this.init()
  }

  init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup())
    } else {
      this.setup()
    }
  }

  setup() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'analyzeCode':
          this.analyzePageCode()
          sendResponse({ success: true, data: this.complexityData })
          break
        case 'getComplexityData':
          sendResponse({ success: true, data: this.complexityData })
          break
        case 'highlightFunction':
          this.highlightFunction(request.functionName, request.line)
          sendResponse({ success: true })
          break
      }
    })

    // Create floating widget
    this.createFloatingWidget()
    
    // Start observing DOM changes
    this.observeDOMChanges()
    
    // Initial analysis
    setTimeout(() => this.analyzePageCode(), 2000)
  }

  createFloatingWidget() {
    this.floatingWidget = document.createElement('div')
    this.floatingWidget.id = 'complexity-widget'
    this.floatingWidget.innerHTML = `
      <div class="complexity-widget-header">
        <span>📊</span>
        <span class="complexity-widget-title">Complexity</span>
        <button class="complexity-widget-close">×</button>
      </div>
      <div class="complexity-widget-content">
        <div class="complexity-widget-score">
          <span class="score-number">0</span>
          <span class="score-label">Overall</span>
        </div>
        <div class="complexity-widget-stats">
          <div class="stat">
            <span class="stat-number">0</span>
            <span class="stat-label">Functions</span>
          </div>
          <div class="stat">
            <span class="stat-number">0</span>
            <span class="stat-label">Avg</span>
          </div>
        </div>
      </div>
    `
    
    // Add styles
    this.floatingWidget.className = 'complexity-widget'
    
    // Add close functionality
    const closeBtn = this.floatingWidget.querySelector('.complexity-widget-close')
    closeBtn.addEventListener('click', () => {
      this.floatingWidget.style.display = 'none'
    })
    
    // Make draggable
    this.makeDraggable(this.floatingWidget)
    
    document.body.appendChild(this.floatingWidget)
  }

  makeDraggable(element) {
    let isDragging = false
    let currentX
    let currentY
    let initialX
    let initialY
    let xOffset = 0
    let yOffset = 0

    const dragStart = (e) => {
      if (e.target.closest('.complexity-widget-close')) return
      
      initialX = e.clientX - xOffset
      initialY = e.clientY - yOffset
      
      if (e.target === element || element.contains(e.target)) {
        isDragging = true
      }
    }

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault()
        currentX = e.clientX - initialX
        currentY = e.clientY - initialY
        xOffset = currentX
        yOffset = currentY
        
        element.style.transform = `translate(${currentX}px, ${currentY}px)`
      }
    }

    const dragEnd = () => {
      initialX = currentX
      initialY = currentY
      isDragging = false
    }

    element.addEventListener('mousedown', dragStart)
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', dragEnd)
  }

  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldAnalyze = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new code blocks were added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (this.containsCode(node)) {
                shouldAnalyze = true
              }
            }
          })
        }
      })
      
      if (shouldAnalyze) {
        setTimeout(() => this.analyzePageCode(), 1000)
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  containsCode(element) {
    const codeSelectors = [
      'pre code',
      '.highlight',
      '.blob-code',
      '.CodeMirror-code',
      '.monaco-editor',
      '.ace_editor',
      '[class*="code"]',
      '[class*="Code"]'
    ]
    
    return codeSelectors.some(selector => element.querySelector(selector))
  }

  async analyzePageCode() {
    if (this.isAnalyzing) return
    
    this.isAnalyzing = true
    this.clearHighlights()
    
    try {
      // Find all code blocks
      const codeBlocks = this.findCodeBlocks()
      
      if (codeBlocks.length === 0) {
        this.updateWidget({ overallScore: 0, functions: [], totalFunctions: 0, averageComplexity: 0 })
        return
      }
      
      // Analyze each code block
      const allFunctions = []
      
      for (const block of codeBlocks) {
        const functions = await this.analyzeCodeBlock(block)
        allFunctions.push(...functions)
      }
      
      // Calculate overall metrics
      const overallScore = this.calculateOverallScore(allFunctions)
      const averageComplexity = allFunctions.length > 0 
        ? allFunctions.reduce((sum, f) => sum + f.complexity, 0) / allFunctions.length 
        : 0
      
      this.complexityData = {
        overallScore,
        functions: allFunctions,
        totalFunctions: allFunctions.length,
        averageComplexity
      }
      
      // Apply highlights
      this.applyHighlights()
      
      // Update widget
      this.updateWidget(this.complexityData)
      
    } catch (error) {
      console.error('Error analyzing code complexity:', error)
    } finally {
      this.isAnalyzing = false
    }
  }

  findCodeBlocks() {
    const selectors = [
      'pre code',
      '.highlight pre',
      '.blob-code',
      '.CodeMirror-code',
      '.monaco-editor .view-lines',
      '.ace_editor .ace_content'
    ]
    
    const blocks = []
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => {
        if (el.textContent.trim().length > 10) {
          blocks.push(el)
        }
      })
    })
    
    return blocks
  }

  async analyzeCodeBlock(codeElement) {
    const code = codeElement.textContent
    if (!code || code.length < 20) return []
    
    try {
      // Use Esprima to parse the code
      const ast = esprima.parse(code, { 
        loc: true,
        range: true,
        comment: true,
        tokens: true
      })
      
      const functions = []
      this.traverseAST(ast, functions, codeElement)
      
      return functions
    } catch (error) {
      // If parsing fails, try to extract functions using regex
      return this.extractFunctionsRegex(code, codeElement)
    }
  }

  traverseAST(node, functions, codeElement) {
    if (!node) return
    
    // Check for function declarations
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      const complexity = this.calculateFunctionComplexity(node)
      const functionInfo = {
        name: node.id ? node.id.name : 'Anonymous',
        complexity,
        line: node.loc ? node.loc.start.line : 1,
        params: node.params ? node.params.length : 0,
        element: codeElement
      }
      functions.push(functionInfo)
    }
    
    // Check for arrow functions
    if (node.type === 'ArrowFunctionExpression') {
      const complexity = this.calculateFunctionComplexity(node)
      const functionInfo = {
        name: 'Arrow Function',
        complexity,
        line: node.loc ? node.loc.start.line : 1,
        params: node.params ? node.params.length : 0,
        element: codeElement
      }
      functions.push(functionInfo)
    }
    
    // Recursively traverse child nodes
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        if (Array.isArray(node[key])) {
          node[key].forEach(child => this.traverseAST(child, functions, codeElement))
        } else {
          this.traverseAST(node[key], functions, codeElement)
        }
      }
    }
  }

  calculateFunctionComplexity(node) {
    let complexity = 1 // Base complexity
    
    const traverse = (n) => {
      if (!n) return
      
      // Increment complexity for control flow statements
      if (['IfStatement', 'SwitchStatement', 'ForStatement', 'ForInStatement', 'ForOfStatement', 'WhileStatement', 'DoWhileStatement', 'CatchClause', 'ConditionalExpression'].includes(n.type)) {
        complexity++
      }
      
      // Increment for logical operators
      if (n.type === 'LogicalExpression') {
        complexity++
      }
      
      // Recursively check child nodes
      for (const key in n) {
        if (n[key] && typeof n[key] === 'object') {
          if (Array.isArray(n[key])) {
            n[key].forEach(child => traverse(child))
          } else {
            traverse(n[key])
          }
        }
      }
    }
    
    traverse(node)
    return complexity
  }

  extractFunctionsRegex(code, codeElement) {
    const functions = []
    const lines = code.split('\n')
    
    // Simple regex patterns for function detection
    const patterns = [
      /function\s+(\w+)\s*\(/g,
      /(\w+)\s*[:=]\s*function\s*\(/g,
      /(\w+)\s*[:=]\s*\([^)]*\)\s*=>/g,
      /\([^)]*\)\s*=>/g
    ]
    
    patterns.forEach((pattern, index) => {
      let match
      while ((match = pattern.exec(code)) !== null) {
        const lineNumber = code.substring(0, match.index).split('\n').length
        const name = match[1] || 'Anonymous'
        
        // Estimate complexity based on function length and structure
        const functionStart = match.index
        const functionEnd = this.findFunctionEnd(code, functionStart)
        const functionCode = code.substring(functionStart, functionEnd)
        const complexity = this.estimateComplexity(functionCode)
        
        functions.push({
          name,
          complexity,
          line: lineNumber,
          params: 0,
          element: codeElement
        })
      }
    })
    
    return functions
  }

  findFunctionEnd(code, startIndex) {
    let braceCount = 0
    let inString = false
    let stringChar = null
    let i = startIndex
    
    while (i < code.length) {
      const char = code[i]
      
      if (char === '"' || char === "'" || char === '`') {
        if (!inString) {
          inString = true
          stringChar = char
        } else if (char === stringChar) {
          inString = false
          stringChar = null
        }
      }
      
      if (!inString) {
        if (char === '{') braceCount++
        if (char === '}') {
          braceCount--
          if (braceCount === 0) return i + 1
        }
      }
      
      i++
    }
    
    return code.length
  }

  estimateComplexity(functionCode) {
    let complexity = 1
    
    // Count control flow keywords
    const controlFlowKeywords = ['if', 'else', 'switch', 'case', 'for', 'while', 'do', 'catch', 'finally']
    controlFlowKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      const matches = functionCode.match(regex)
      if (matches) complexity += matches.length
    })
    
    // Count logical operators
    const logicalOperators = ['&&', '||', '?', ':']
    logicalOperators.forEach(operator => {
      const regex = new RegExp(operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      const matches = functionCode.match(regex)
      if (matches) complexity += matches.length
    })
    
    return Math.min(complexity, 20) // Cap at 20
  }

  calculateOverallScore(functions) {
    if (functions.length === 0) return 0
    
    const totalComplexity = functions.reduce((sum, f) => sum + f.complexity, 0)
    const averageComplexity = totalComplexity / functions.length
    
    // Weighted score based on average complexity and number of high-complexity functions
    const highComplexityCount = functions.filter(f => f.complexity > 10).length
    const score = averageComplexity + (highComplexityCount * 2)
    
    return Math.round(score)
  }

  applyHighlights() {
    this.complexityData.functions.forEach(func => {
      if (func.element && func.element.parentElement) {
        this.highlightFunction(func)
      }
    })
  }

  highlightFunction(func) {
    const element = func.element
    if (!element || this.highlightedElements.has(element)) return
    
    // Find the parent container to highlight
    let container = element
    while (container && !container.classList.contains('highlight') && !container.classList.contains('blob-code')) {
      container = container.parentElement
    }
    
    if (!container) container = element
    
    // Add complexity class
    const complexityClass = this.getComplexityClass(func.complexity)
    container.classList.add('complexity-highlight', complexityClass)
    
    // Add tooltip
    const tooltip = document.createElement('div')
    tooltip.className = 'complexity-tooltip'
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <strong>${func.name}</strong>
        <span class="tooltip-complexity ${complexityClass}">${func.complexity}</span>
      </div>
      <div class="tooltip-body">
        <div>Line: ${func.line}</div>
        <div>Params: ${func.params}</div>
        <div>Complexity: ${this.getComplexityLabel(func.complexity)}</div>
      </div>
    `
    
    container.appendChild(tooltip)
    this.highlightedElements.add(element)
  }

  getComplexityClass(complexity) {
    if (complexity <= 5) return 'complexity-low'
    if (complexity <= 10) return 'complexity-medium'
    if (complexity <= 15) return 'complexity-high'
    return 'complexity-extreme'
  }

  getComplexityLabel(complexity) {
    if (complexity <= 5) return 'Low'
    if (complexity <= 10) return 'Medium'
    if (complexity <= 15) return 'High'
    return 'Extreme'
  }

  clearHighlights() {
    this.highlightedElements.forEach(element => {
      if (element.parentElement) {
        element.parentElement.classList.remove('complexity-highlight', 'complexity-low', 'complexity-medium', 'complexity-high', 'complexity-extreme')
        const tooltip = element.parentElement.querySelector('.complexity-tooltip')
        if (tooltip) tooltip.remove()
      }
    })
    this.highlightedElements.clear()
  }

  highlightFunctionByName(functionName, line) {
    const functionData = this.complexityData.functions.find(f => 
      f.name === functionName || f.line === line
    )
    
    if (functionData) {
      // Scroll to function
      if (functionData.element) {
        functionData.element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Flash highlight
        const container = functionData.element.parentElement || functionData.element
        container.style.transition = 'all 0.3s ease'
        container.style.transform = 'scale(1.02)'
        container.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)'
        
        setTimeout(() => {
          container.style.transform = 'scale(1)'
          container.style.boxShadow = 'none'
        }, 1000)
      }
    }
  }

  updateWidget(data) {
    if (!this.floatingWidget) return
    
    const scoreElement = this.floatingWidget.querySelector('.score-number')
    const functionCountElement = this.floatingWidget.querySelector('.stat-number:first-child')
    const avgElement = this.floatingWidget.querySelector('.stat-number:last-child')
    
    if (scoreElement) scoreElement.textContent = data.overallScore
    if (functionCountElement) functionCountElement.textContent = data.totalFunctions
    if (avgElement) avgElement.textContent = data.averageComplexity.toFixed(1)
    
    // Update score color
    const scoreClass = this.getComplexityClass(data.overallScore)
    scoreElement.className = `score-number ${scoreClass}`
  }
}

// Initialize the analyzer when the script loads
let analyzer

// Load Esprima if not already available
if (typeof esprima === 'undefined') {
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/esprima/4.0.1/esprima.min.js'
  script.onload = () => {
    analyzer = new ComplexityAnalyzer()
  }
  document.head.appendChild(script)
} else {
  analyzer = new ComplexityAnalyzer()
}
