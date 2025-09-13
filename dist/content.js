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
    this.selectionActive = false
    this.analysisMode = 'full'
    this.selectionTimer = null
    this.lastSelectedText = ''
    this.lastSelectedAt = 0
    this.analysisQueued = false
    this.reanalyzeTimer = null
    this.lastPrimaryHash = ''
    this.lastAnalyzeAt = 0
    this.lastGoodComplexityData = null
    this.userMinimized = false
    this.showWidgetPos = null
    try {
      const saved = localStorage.getItem('codelens_show_pos')
      if (saved) this.showWidgetPos = JSON.parse(saved)
    } catch (_) {}
    
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
      // If preloaded by manifest, esprima should already be present
      if (typeof window.esprima !== 'undefined') {
        this.esprimaLoaded = true
        return
      }
      // Fallback: load bundled esprima from extension package to satisfy CSP
      const url = chrome.runtime.getURL('assets/esprima.js')
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.onload = () => {
          this.esprimaLoaded = true
          console.log('CodeLens: Esprima loaded successfully (bundled)')
          resolve()
        }
        script.onerror = () => {
          console.error('CodeLens: Failed to load bundled Esprima')
          reject(new Error('Failed to load Esprima'))
        }
        document.head.appendChild(script)
      })
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
          try {
            this.highlightFunctionByName(request.functionName, request.line)
            sendResponse({ success: true })
          } catch (error) {
            console.error('CodeLens: Error highlighting function:', error)
            sendResponse({ success: false, error: error.message })
          }
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

    // Create floating widget (start hidden)
    this.createFloatingWidget()
    this.hideFloatingWidget()
    console.log('CodeLens: Floating widget created and hidden')
    
    // Start observing DOM changes
    this.observeDOMChanges()
    console.log('CodeLens: DOM observer started')
    
    // Only analyze on actual code pages
    const tryAnalyze = () => {
      if (this.isCodePage()) {
        console.log('CodeLens: Code page detected, analyzing...')
        this.analyzePageCode()
        this.showFloatingWidget()
      } else {
        console.log('CodeLens: Not a code page, keeping widget hidden')
        this.hideFloatingWidget()
      }
    }
    setTimeout(tryAnalyze, 1500)
    if (document.readyState === 'complete') {
      setTimeout(tryAnalyze, 500)
    }

    // Listen for text selection changes for selection-based analysis
    document.addEventListener('selectionchange', () => this.handleSelectionChange())
    
    // Listen for window resize to ensure widget stays visible
    window.addEventListener('resize', () => {
      if (this.floatingWidget) {
        this.ensureWidgetVisibility()
      }
      if (this.showWidgetButton) {
        this.positionShowButtonResponsively(this.showWidgetButton)
      }
    })
    
    // Listen for orientation change on mobile devices
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (this.floatingWidget) {
          this.ensureWidgetVisibility()
        }
        if (this.showWidgetButton) {
          this.positionShowButtonResponsively(this.showWidgetButton)
        }
      }, 100)
    })
    
    // Periodic visibility check for robustness
    setInterval(() => {
      if (this.floatingWidget && this.floatingWidget.style.display !== 'none') {
        this.ensureWidgetVisibility()
      }
      if (this.showWidgetButton && this.showWidgetButton.style.display !== 'none') {
        this.positionShowButtonResponsively(this.showWidgetButton)
      }
    }, 5000)
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
        <div class="function-count">
          <div class="count-label">Functions</div>
          <div class="count-number" id="codelens-count">-</div>
        </div>
        <button class="analyze-btn" id="codelens-analyze">🔍 Analyze Code</button>
      </div>
    `
    
    document.body.appendChild(widget)
    this.floatingWidget = widget
    
    // Ensure widget is positioned correctly on all screen sizes
    this.ensureWidgetVisibility()
    
    // Force initial visibility check after a short delay
    setTimeout(() => {
      this.ensureWidgetVisibility()
    }, 100)
    
    // Add event listeners
    const analyzeBtn = widget.querySelector('#codelens-analyze')
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        try {
          // Request the background to open the extension popup (or fallback popup window)
          chrome.runtime.sendMessage({ action: 'openPopup' })
        } catch (e) {
          // Fallback: run analysis inline if messaging fails
          this.analyzePageCode()
        }
      })
    }
    
    // Add close button functionality
    const closeBtn = widget.querySelector('#codelens-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideFloatingWidget()
      })
    }
    
    // Keep widget fixed in place (no dragging)
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
    
    const countElement = this.floatingWidget.querySelector('#codelens-count')
    
    if (countElement) {
      countElement.textContent = this.complexityData.totalFunctions
    }
  }

  notifyPopupUpdate() {
    try {
      chrome.runtime.sendMessage({ type: 'complexityDataUpdated', data: this.complexityData })
    } catch (e) {
      // Ignore if popup not open
    }
  }

  isCodePage() {
    // Detect presence of common code containers or known file extensions
    const knownSelectors = [
      '.blob-code-inner',
      '.blob-code',
      '.highlight .blob-code',
      '.js-file-line',
      '.CodeMirror-line',
      '.monaco-editor .view-line',
      '.ace_editor .ace_line',
      'pre code'
    ]
    for (const selector of knownSelectors) {
      const el = document.querySelector(selector)
      if (el) return true
    }
    const ext = this.getFileExtension()
    return ['js','jsx','ts','tsx','c','cpp','java','py','html','css'].includes(ext)
  }

  observeDOMChanges() {
    if (this.observer) {
      this.observer.disconnect()
    }
    
    this.observer = new MutationObserver((mutations) => {
      let shouldReanalyze = false
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) shouldReanalyze = true
          if (mutation.removedNodes && mutation.removedNodes.length > 0) shouldReanalyze = true
        }
        if (shouldReanalyze) break
      }
      if (shouldReanalyze) {
        this.scheduleReanalyze()
      }
    })
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  scheduleReanalyze() {
    if (this.reanalyzeTimer) clearTimeout(this.reanalyzeTimer)
    this.reanalyzeTimer = setTimeout(() => {
      // Skip if selection mode is active; selection handler will re-run
      if (this.selectionActive) return
      const { code } = this.getPrimaryCodeText()
      const text = code || ''
      // Require a reasonable amount of code to avoid transient empty states
      if (text.trim().length < 30) return
      // Rate-limit frequent re-analysis during scroll
      if (Date.now() - this.lastAnalyzeAt < 1200) return
      const hash = this.computeHash(text)
      if (hash && hash === this.lastPrimaryHash) {
        return
      }
      this.analyzePageCode()
    }, 750)
  }

  computeHash(text) {
    try {
      let h = 0
      for (let i = 0; i < text.length; i++) {
        h = ((h << 5) - h) + text.charCodeAt(i)
        h |= 0
      }
      return String(h)
    } catch (_) {
      return ''
    }
  }

  async analyzePageCode() {
    console.log('CodeLens: Starting code analysis...')
    if (this.isAnalyzing) {
      this.analysisQueued = true
      return
    }
    this.isAnalyzing = true
    
    // Load Esprima if needed
    await this.loadEsprima()
    
    // If selection is active, prioritize analyzing only the selection
    const selectionText = this.getSelectedCodeText()
    if (selectionText) {
      console.log('CodeLens: Selection detected, analyzing selected code only')
      this.analysisMode = 'selection'
      await this.analyzeCodeFromText(selectionText)
      this.showFloatingWidget()
      return
    }

    // Fallback: recently cached selection (e.g., user clicked popup and selection lost)
    if (this.lastSelectedText && (Date.now() - this.lastSelectedAt) < 5000) {
      console.log('CodeLens: Using recent cached selection for analysis')
      this.analysisMode = 'selection'
      await this.analyzeCodeFromText(this.lastSelectedText)
      this.showFloatingWidget()
      return
    }

    // Otherwise analyze the primary code content once
    const { code: primaryCode, languageHint } = this.getPrimaryCodeText()
    if (!primaryCode || !primaryCode.trim()) {
      console.log('CodeLens: No primary code detected')
      this.isAnalyzing = false
      return
    }

    this.analysisMode = 'full'
    // Avoid re-analyzing if content unchanged
    const currentHash = this.computeHash(primaryCode)
    if (this.lastPrimaryHash && currentHash === this.lastPrimaryHash && this.complexityData.totalFunctions > 0) {
      this.updateFloatingWidget()
      this.isAnalyzing = false
      return
    }
    await this.analyzeCodeFromText(primaryCode, languageHint)
    this.lastPrimaryHash = currentHash
    this.showFloatingWidget()
    
    console.log('CodeLens: Analysis complete:', this.complexityData)
    
    // Update floating widget
    this.updateFloatingWidget()
    
    // Apply highlights
    this.highlightAllFunctions()

    // Notify popup (if open)
    this.notifyPopupUpdate()
    this.isAnalyzing = false
    this.lastAnalyzeAt = Date.now()
    if (this.analysisQueued) {
      this.analysisQueued = false
      this.scheduleReanalyze()
    }
  }

  analyzeCodeFromText(code, languageHint) {
    return new Promise((resolve) => {
      try {
        // Guard: preserve last good data if incoming text is too small or empty
        if (!code || code.trim().length < 10) {
          if (this.lastGoodComplexityData) {
            this.complexityData = { ...this.lastGoodComplexityData }
            this.updateFloatingWidget()
            this.notifyPopupUpdate()
          }
          return resolve()
        }
        const ext = this.getFileExtension()
        const detected = this.detectLanguage(ext ? `file.${ext}` : '', code)
        let language = languageHint || detected
        // Force JSX/TSX to JSX fallback and TS to fallback when annotations present
        if (ext === 'jsx' || ext === 'tsx' || this.isProbablyJSX(code)) {
          language = 'jsx'
        } else if (ext === 'ts' || this.isProbablyTypeScript(code)) {
          language = 'typescript'
        }
        const result = this.calculateComplexityForLanguage(code, language)
        const uniqueFunctions = this.dedupeFunctions(result.functions)
        const totalComplexity = uniqueFunctions.reduce((sum, f) => sum + (f.complexity || 0), 0)
        this.complexityData = {
          overallScore: totalComplexity,
          functions: uniqueFunctions,
          totalFunctions: uniqueFunctions.length,
          averageComplexity: uniqueFunctions.length > 0 ? totalComplexity / uniqueFunctions.length : 0,
          language: language,
          fileType: ext || 'unknown'
        }
        if (this.complexityData.totalFunctions > 0) {
          this.lastGoodComplexityData = { ...this.complexityData }
        }
        console.log('CodeLens: Analysis (mode=' + this.analysisMode + ') complete:', this.complexityData)
        this.notifyPopupUpdate()
        resolve()
      } catch (e) {
        console.error('CodeLens: analyzeCodeFromText error', e)
        resolve()
      }
    })
  }

  getPrimaryCodeText() {
    // Try GitHub file view lines
    let ghLines = document.querySelectorAll('.blob-code-inner')
    if (ghLines && ghLines.length > 0) {
      const code = Array.from(ghLines).map(n => n.textContent || '').join('\n')
      return { code, languageHint: this.detectLanguage(`file.${this.getFileExtension()}`, code) }
    }
    // Fallback: older/new GitHub markup
    const ghLinesAlt = document.querySelectorAll('.blob-code')
    if (ghLinesAlt && ghLinesAlt.length > 0) {
      const code = Array.from(ghLinesAlt).map(n => n.textContent || '').join('\n')
      return { code, languageHint: this.detectLanguage(`file.${this.getFileExtension()}`, code) }
    }
    // Monaco-based editors
    const monacoLines = document.querySelectorAll('.monaco-editor .view-line')
    if (monacoLines && monacoLines.length > 0) {
      const code = Array.from(monacoLines).map(n => n.textContent || '').join('\n')
      return { code, languageHint: this.detectLanguage(`file.${this.getFileExtension()}`, code) }
    }
    // Ace editors
    const aceLines = document.querySelectorAll('.ace_editor .ace_line')
    if (aceLines && aceLines.length > 0) {
      const code = Array.from(aceLines).map(n => n.textContent || '').join('\n')
      return { code, languageHint: this.detectLanguage(`file.${this.getFileExtension()}`, code) }
    }
    // Pre/code blocks
    const preCode = document.querySelector('pre code')
    if (preCode) {
      const code = preCode.textContent || ''
      return { code, languageHint: this.detectLanguage(`file.${this.getFileExtension()}`, code) }
    }
    // Fallback: first generic code-like block
    const blocks = this.findCodeBlocks()
    if (blocks.length > 0) {
      const code = blocks[0].textContent || blocks[0].innerText || ''
      return { code, languageHint: this.detectLanguage(`file.${this.getFileExtension()}`, code) }
    }
    return { code: '', languageHint: 'unknown' }
  }

  getSelectedCodeText() {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return ''
    const text = selection.toString()
    if (!text || text.trim().length < 1) return ''
    // Ensure selection is within a code container
    const anchorNode = selection.anchorNode && selection.anchorNode.parentElement
    if (!anchorNode) return ''
    const codeAncestor = anchorNode.closest(
      '.blob-code-inner, .highlight .blob-code, .js-file-line, .CodeMirror-line, .monaco-editor .view-line, .ace_editor .ace_line, pre, code'
    )
    if (!codeAncestor) return ''
    // Looks like code
    if (!this.looksLikeCode({ textContent: text })) return ''
    return text
  }

  handleSelectionChange() {
    if (this.selectionTimer) clearTimeout(this.selectionTimer)
    this.selectionTimer = setTimeout(() => {
      const text = this.getSelectedCodeText()
      if (text) {
        if (!this.selectionActive) {
          console.log('CodeLens: Entering selection analysis mode')
        }
        this.selectionActive = true
        this.analysisMode = 'selection'
        this.lastSelectedText = text
        this.lastSelectedAt = Date.now()
        this.analyzeCodeFromText(text).then(() => {
          this.updateFloatingWidget()
          this.showFloatingWidget()
        })
      } else {
        if (this.selectionActive) {
          console.log('CodeLens: Exiting selection mode, reverting to full analysis')
          this.selectionActive = false
          if (this.isCodePage()) {
            this.analysisMode = 'full'
            this.analyzePageCode()
          } else {
            this.hideFloatingWidget()
          }
        }
      }
    }, 250)
  }

  dedupeFunctions(functions) {
    const map = new Map()
    functions.forEach(f => {
      const name = (f.name || 'anonymous').trim()
      const key = name.toLowerCase()
      if (!map.has(key)) {
        map.set(key, { ...f, name, count: f.count ? f.count : 1 })
      } else {
        const existing = map.get(key)
        existing.count = (existing.count || 1) + (f.count ? f.count : 1)
      }
    })
    return Array.from(map.values())
  }

  getFileExtension() {
    // Prefer pathname segment after the last '/'
    try {
      const { pathname } = new URL(window.location.href)
      const filename = pathname.split('/').pop() || ''
      const m = filename.match(/\.([a-zA-Z0-9]+)$/)
      if (m) return m[1].toLowerCase()
    } catch (_) {}

    // Fallback: look in common data attributes (GitHub etc.)
    const candidates = [
      '[data-path]',
      '[data-filename]',
      '.final-path',
      'title'
    ]
    for (const sel of candidates) {
      const el = document.querySelector(sel)
      if (el) {
        const text = (el.getAttribute('data-path') || el.getAttribute('data-filename') || el.textContent || '').trim().toLowerCase()
        const m2 = text.match(/\.([a-z0-9]+)$/)
        if (m2) return m2[1]
      }
    }

    // Last resort: page title scan
    const title = document.title.toLowerCase()
    const known = ['js','jsx','ts','tsx','cpp','c','java','py','pyw','html','css']
    for (const ext of known) {
      if (title.includes('.' + ext)) return ext
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
        'tsx': 'jsx',
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
      
      // Python detection (relaxed)
      if (/\bdef\s+[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)\s*:/m.test(content)) return 'python'
      if (/\bclass\s+[A-Za-z_][A-Za-z0-9_]*\s*:\s*/m.test(content)) return 'python'
      
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
        // If the source looks like JSX or TypeScript, avoid Esprima and fallback
        if (this.isProbablyJSX(code) || this.isProbablyTypeScript(code)) {
          const fns = this.extractFunctionsBestEffort(code, 'javascript')
          const totalComplexity = fns.reduce((sum, f) => sum + f.complexity, 0)
          return { functions: fns, overallScore: totalComplexity, totalFunctions: fns.length, averageComplexity: fns.length > 0 ? totalComplexity / fns.length : 0 }
        }
        return this.calculateJavaScriptComplexity(code)
      case 'jsx':
      case 'typescript':
      case 'tsx':
        // Use best-effort parsing for JSX/TS/TSX to avoid Esprima parse errors
        const fns = this.extractFunctionsBestEffort(code, 'javascript')
        const totalComplexity = fns.reduce((sum, f) => sum + f.complexity, 0)
        return { functions: fns, overallScore: totalComplexity, totalFunctions: fns.length, averageComplexity: fns.length > 0 ? totalComplexity / fns.length : 0 }
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

  isProbablyJSX(code) {
    try {
      // Heuristic: angle-bracket tags that are not part of comparisons
      if ((/<[A-Za-z][A-Za-z0-9]*\s[^>]*>/).test(code) || (/<[A-Za-z][A-Za-z0-9]*>/).test(code)) {
        if ((/<\/[A-Za-z]/).test(code)) return true
      }
      if (/return\s*\(\s*<\w+/m.test(code)) return true
    } catch (_) {}
    return false
  }

  isProbablyTypeScript(code) {
    try {
      if (/\binterface\s+\w+/.test(code)) return true
      if (/\btype\s+\w+\s*=/.test(code)) return true
      if (/\benum\s+\w+/.test(code)) return true
      if (/\bimport\s+type\b/.test(code)) return true
      // Parameter or variable type annotations
      if (/[),\w]\s*:\s*[A-Za-z][A-Za-z0-9_<>{}\[\]\|&?, ]+/.test(code)) return true
    } catch (_) {}
    return false
  }

  calculateJavaScriptComplexity(code) {
    // Guard: if this looks like JSX or TypeScript, avoid Esprima and fallback
    if (this.isProbablyJSX(code) || this.isProbablyTypeScript(code)) {
      const fns = this.extractFunctionsBestEffort(code, 'javascript')
      const totalComplexity = fns.reduce((sum, f) => sum + f.complexity, 0)
      return { functions: fns, overallScore: totalComplexity, totalFunctions: fns.length, averageComplexity: fns.length > 0 ? totalComplexity / fns.length : 0 }
    }
    if (!this.esprimaLoaded) {
      console.log('CodeLens: Esprima not loaded yet, waiting...')
      return { functions: [], overallScore: 0, totalFunctions: 0, averageComplexity: 0 }
    }

    try {
      const ast = esprima.parseModule(code, { range: true, loc: true })
      const functions = []
      let totalComplexity = 0

      const traverse = (node, parent) => {
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
          
          let functionName = 'anonymous'
          try {
            if (node.id && node.id.name) {
              functionName = node.id.name
            } else if (node.key && typeof node.key === 'object') {
              if (node.key.name) functionName = node.key.name
              else if (Object.prototype.hasOwnProperty.call(node.key, 'value')) functionName = String(node.key.value)
            } else if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && parent) {
              if (parent.type === 'VariableDeclarator' && parent.id && parent.id.name) {
                functionName = parent.id.name
              } else if (parent.type === 'AssignmentExpression') {
                const left = parent.left
                if (left && left.type === 'Identifier' && left.name) functionName = left.name
                else if (left && left.type === 'MemberExpression' && left.property) {
                  if (left.property.name) functionName = left.property.name
                  else if (typeof left.property.value !== 'undefined') functionName = String(left.property.value)
                }
              } else if (parent.type === 'Property' && parent.key) {
                if (parent.key.name) functionName = parent.key.name
                else if (Object.prototype.hasOwnProperty.call(parent.key, 'value')) functionName = String(parent.key.value)
              }
            }
          } catch (_) {
            // keep anonymous
          }
          
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
              node[key].forEach(child => traverse(child, node))
            } else {
              traverse(node[key], node)
            }
          }
        })
      }
      
      traverse(ast, null)
      
      return {
        functions: functions,
        overallScore: totalComplexity,
        totalFunctions: functions.length,
        averageComplexity: functions.length > 0 ? totalComplexity / functions.length : 0
      }
    } catch (error) {
      console.warn('CodeLens: JavaScript parsing failed, using fallback.', error)
      // Fallback: best-effort regex extraction so Functions tab still shows entries
      try {
        const fallbackFunctions = this.extractFunctionsBestEffort(code, 'javascript') || []
        const fallbackTotalComplexity = fallbackFunctions.reduce((sum, f) => sum + (f.complexity || 0), 0)
        return {
          functions: fallbackFunctions,
          overallScore: fallbackTotalComplexity,
          totalFunctions: fallbackFunctions.length,
          averageComplexity: fallbackFunctions.length > 0 ? fallbackTotalComplexity / fallbackFunctions.length : 0
        }
      } catch (fallbackError) {
        console.error('CodeLens: Fallback parsing also failed', fallbackError)
        return {
          functions: [],
          overallScore: 0,
          totalFunctions: 0,
          averageComplexity: 0
        }
      }
    }
  }

  extractFunctionsBestEffort(code, language) {
    try {
      const results = []
    const computeJSHeuristicComplexity = (source, fromIndex) => {
      try {
        const slice = source.substring(fromIndex)
        // Find the first '{' after the function signature
        const braceIdx = slice.indexOf('{')
        let body = ''
        if (braceIdx !== -1) {
          // Balanced brace scan
          let depth = 0
          let started = false
          for (let i = braceIdx; i < slice.length; i++) {
            const ch = slice[i]
            if (ch === '{') { depth++; started = true }
            if (ch === '}') depth--
            body += ch
            if (started && depth === 0) break
          }
        } else {
          // Arrow one-liner: find end of line or semicolon
          const arrowIdx = slice.indexOf('=>')
          if (arrowIdx !== -1) {
            const after = slice.substring(arrowIdx + 2)
            const nl = after.indexOf('\n')
            const semi = after.indexOf(';')
            const end = [nl === -1 ? Infinity : nl, semi === -1 ? Infinity : semi].reduce((a,b)=>Math.min(a,b), Infinity)
            body = end === Infinity ? after : after.substring(0, end)
          } else {
            // Fallback limited window
            body = slice.substring(0, 300)
          }
        }
        let complexity = 1
        const add = (re) => { const m = body.match(re); if (m) complexity += m.length }
        add(/\bif\s*\(/g)
        add(/\bfor\s*\(/g)
        add(/\bwhile\s*\(/g)
        add(/\bswitch\s*\(/g)
        add(/\bcase\b/g)
        add(/\bcatch\s*\(/g)
        add(/&&/g)
        add(/\|\|/g)
        return complexity
      } catch (_) { return 1 }
    }
    const pushFn = (name, index, count = 1, opts = {}) => {
      let complexity = 0
      if (language === 'javascript' && !opts.isLoopAggregate) {
        complexity = computeJSHeuristicComplexity(code, index)
      }
      const line = code.substring(0, index).split('\n').length
      results.push({
        name: name ? name.trim() : 'anonymous',
        complexity: complexity,
        line: line,
        type: 'function',
        label: this.getComplexityLabel(complexity),
        colorClass: this.getComplexityColorClass(complexity),
        count
      })
    }
    try {
      if (language === 'javascript') {
        // function declarations
        const fnDecl = /function\s+([A-Za-z_$][\w$]*)\s*\(/g
        let m
        while ((m = fnDecl.exec(code)) !== null) pushFn(m[1], m.index)

        // named function expressions: const foo = function( ... ) or var foo = function
        const namedFnExpr = /(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*function\s*\(/g
        while ((m = namedFnExpr.exec(code)) !== null) pushFn(m[2], m.index)

        // arrow functions assigned to identifiers: const foo = (...) => { ... }
        const arrowAssigned = /(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\([^)]*\)\s*=>/g
        while ((m = arrowAssigned.exec(code)) !== null) pushFn(m[2], m.index)

        // class/object methods: capture preceding newline or start
        const classMethod = /(^|\n)\s*([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g
        while ((m = classMethod.exec(code)) !== null) pushFn(m[2], m.index)

        // loops (report once as "For loop as a whole" etc., no duplicates)
        const loopCounts = new Map()
        const loops = [
          { regex: /for\s*\(/g, label: 'For loop as a whole' },
          { regex: /while\s*\(/g, label: 'While loop as a whole' },
          { regex: /do\s*\{/g, label: 'Do-while loop as a whole' }
        ]
        for (const l of loops) {
          let lm
          let firstIndex = -1
          let count = 0
          while ((lm = l.regex.exec(code)) !== null) {
            if (firstIndex === -1) firstIndex = lm.index
            count++
          }
          if (firstIndex !== -1) {
            loopCounts.set(l.label, (loopCounts.get(l.label) || 0) + count)
            pushFn(l.label, firstIndex, count, { isLoopAggregate: true })
          }
        }
      }
    } catch (e) {
      // ignore
    }
    // Deduplicate by name:line
      const unique = new Map()
      results.forEach(f => {
        const key = `${f.name}:${f.line}`
        if (!unique.has(key)) unique.set(key, f)
      })
      return Array.from(unique.values())
    } catch (error) {
      console.error('CodeLens: extractFunctionsBestEffort failed', error)
      return []
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
    
    // Python function detection (support decorators and indentation blocks)
    const functionRegex = /(?:^|\n)\s*(?:@[A-Za-z_][\w.]*\s*\n\s*)*def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*:\s*(?:#.*)?/g
    const ifRegex = /\bif\b/g
    const forRegex = /\bfor\b/g
    const whileRegex = /\bwhile\b/g
    const exceptRegex = /\bexcept\b/g
    const elifRegex = /\belif\b/g
    const andOrRegex = /\b(and|or)\b/g
    const tryRegex = /\btry\b/g
    const withRegex = /\bwith\b/g
    
    let match
    
    while ((match = functionRegex.exec(code)) !== null) {
      const functionName = match[1]
      const functionStart = match.index
      const before = code.substring(0, functionStart)
      const functionLineIndex = before.split('\n').length - 1
      // Determine indentation level of the def line
      const defLine = code.substring(functionStart, code.indexOf('\n', functionStart) === -1 ? code.length : code.indexOf('\n', functionStart))
      const indentMatch = defLine.match(/^(\s*)/)
      const baseIndent = indentMatch ? indentMatch[1] : ''
      const baseIndentLen = baseIndent.length
      // Scan forward until a line with indentation <= baseIndent (new block) or EOF
      const lines = code.split('\n')
      let functionEnd = code.length
      for (let i = functionLineIndex + 1; i < lines.length; i++) {
        const line = lines[i]
        // Blank/comment-only lines are part of the function
        if (line.trim() === '' || /^\s*#/.test(line)) continue
        const indentLen = (line.match(/^(\s*)/) || ['',''])[1].length
        if (indentLen <= baseIndentLen && !/^\s*(elif|else|except|finally)\b/.test(line)) {
          // Block ended; stop before this line
          functionEnd = before.length + lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0)
          break
        }
      }
      
      if (functionEnd > functionStart) {
        const functionCode = code.substring(functionStart, functionEnd)
        let complexity = 1
        
        // Count decision points
        complexity += (functionCode.match(ifRegex) || []).length
        complexity += (functionCode.match(elifRegex) || []).length
        complexity += (functionCode.match(forRegex) || []).length
        complexity += (functionCode.match(whileRegex) || []).length
        complexity += (functionCode.match(exceptRegex) || []).length
        complexity += (functionCode.match(tryRegex) || []).length
        complexity += (functionCode.match(withRegex) || []).length
        complexity += (functionCode.match(andOrRegex) || []).length
        
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
    
    const uniqueFunctions = this.dedupeFunctions(functions)
    return {
      functions: uniqueFunctions,
      overallScore: totalComplexity,
      totalFunctions: uniqueFunctions.length,
      averageComplexity: uniqueFunctions.length > 0 ? totalComplexity / uniqueFunctions.length : 0
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
    console.log('CodeLens: Highlighting all functions...')
    this.clearHighlights()
    
    this.complexityData.functions.forEach(func => {
      this.highlightFunction(func)
    })
    
    console.log('CodeLens: Highlighted', this.highlightedElements.size, 'function elements')
  }

  highlightFunction(func) {
    try {
      console.log('CodeLens: Highlighting function:', func.name, 'with complexity:', func.complexity)
      
      if (!func || !func.name) {
        console.warn('CodeLens: Invalid function object provided to highlightFunction');
        return;
      }
      
      const codeBlocks = this.findCodeBlocks()
      let highlighted = false
      
      for (const block of codeBlocks) {
        if (!block) continue;
        const text = block.textContent || block.innerText || '';
        const functionName = func.name ? func.name.trim() : '';
        if (functionName && this.findFunctionInText(text, functionName)) {
          console.log('CodeLens: Found function in code block, highlighting...');
          const container = this.findHighlightContainer(block);
          if (container && container.classList) {
            const complexityClass = this.getComplexityColorClass(func.complexity);
            container.classList.add('complexity-highlight', complexityClass);
            container.setAttribute('data-language', this.complexityData.language || 'unknown');
            container.title = `${func.name}: ${func.complexity} complexity (${func.label})`;
            this.highlightedElements.add(container);
            highlighted = true;
            break;
          } else {
            console.warn('CodeLens: No valid container found for highlighting:', func.name);
          }
        }
      }
      if (!highlighted) {
        console.warn('CodeLens: Could not find function in any code blocks:', func.name);
      }
    } catch (error) {
      console.error('CodeLens: Error in highlightFunction:', error);
    }
  }
  
  findFunctionInText(text, functionName) {
    try {
      if (!text || !functionName) return false;
      // Create more precise regex patterns for different function types
      const patterns = [
        // Function declarations: function functionName(
        new RegExp(`\\bfunction\\s+${this.escapeRegex(functionName)}\\s*\\(`, 'i'),
        // Arrow functions: const functionName = ( or let functionName = (
        new RegExp(`\\b(const|let|var)\\s+${this.escapeRegex(functionName)}\\s*=\\s*\\(`, 'i'),
        // Method definitions: functionName( or functionName: function
        new RegExp(`\\b${this.escapeRegex(functionName)}\\s*\\(`, 'i'),
        // Class methods: functionName( or functionName: function
        new RegExp(`\\b${this.escapeRegex(functionName)}\\s*[:=]\\s*function`, 'i'),
        // Arrow function assignments: functionName = (params) =>
        new RegExp(`\\b${this.escapeRegex(functionName)}\\s*=\\s*\\([^)]*\\)\\s*=>`, 'i'),
        // Direct name match (fallback)
        new RegExp(`\\b${this.escapeRegex(functionName)}\\b`, 'i')
      ];
      // Check if any pattern matches
      return patterns.some(pattern => pattern.test(text));
    } catch (error) {
      console.error('CodeLens: Error in findFunctionInText:', error);
      return false;
    }
  }
  
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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
    console.log('CodeLens: Attempting to highlight function:', functionName, 'at line:', lineNumber)
    
    // Clear any existing highlights first
    this.clearHighlights()
    
    const func = this.complexityData.functions.find(f => 
      f.name === functionName || f.line === lineNumber
    )
    
    if (func) {
      console.log('CodeLens: Found function to highlight:', func)
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
    } else {
      console.warn('CodeLens: Function not found for highlighting:', functionName, 'Available functions:', this.complexityData.functions.map(f => f.name))
    }
  }

  hideFloatingWidget() {
    if (this.floatingWidget) {
      this.userMinimized = true
      this.floatingWidget.style.display = 'none'
      console.log('CodeLens: Floating widget hidden')
      
      // Create a small show widget button
      this.createShowWidgetButton()
    }
  }

  showFloatingWidget() {
    if (this.floatingWidget) {
      if (this.userMinimized) {
        // Keep minimized; ensure the show button is visible
        this.createShowWidgetButton()
        return
      }
      this.floatingWidget.style.display = 'block'
      console.log('CodeLens: Floating widget shown')
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
    
    // Positioning: use saved position if available, else default top-right with responsive positioning
    if (this.showWidgetPos && typeof this.showWidgetPos.top === 'number' && typeof this.showWidgetPos.left === 'number') {
      showBtn.style.top = this.showWidgetPos.top + 'px'
      showBtn.style.left = this.showWidgetPos.left + 'px'
      showBtn.style.right = ''
    } else {
      // Responsive positioning for show button
      this.positionShowButtonResponsively(showBtn)
    }
    
    showBtn.addEventListener('click', () => {
      this.userMinimized = false
      this.showFloatingWidget()
    })

    // Make the circle draggable
    let dragging = false
    let startX = 0
    let startY = 0
    let startLeft = 0
    let startTop = 0
    const onMouseDown = (e) => {
      // Begin drag only for primary click and when not on a link
      if (e.button !== 0) return
      dragging = true
      const rect = showBtn.getBoundingClientRect()
      // Ensure left-based positioning during drag
      showBtn.style.left = rect.left + 'px'
      showBtn.style.top = rect.top + 'px'
      showBtn.style.right = ''
      startX = e.clientX
      startY = e.clientY
      startLeft = rect.left
      startTop = rect.top
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      e.preventDefault()
      e.stopPropagation()
    }
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
    const onMouseMove = (e) => {
      if (!dragging) return
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      // Match the .codelens-show-widget size (56px) and 4px margin
      const newLeft = clamp(startLeft + deltaX, 0, window.innerWidth - 56 - 4)
      const newTop = clamp(startTop + deltaY, 0, window.innerHeight - 56 - 4)
      showBtn.style.left = newLeft + 'px'
      showBtn.style.top = newTop + 'px'
    }
    const onMouseUp = () => {
      if (!dragging) return
      dragging = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      // Persist position for this session and future pages
      const rect = showBtn.getBoundingClientRect()
      this.showWidgetPos = { top: rect.top, left: rect.left }
      try { localStorage.setItem('codelens_show_pos', JSON.stringify(this.showWidgetPos)) } catch (_) {}
    }
    showBtn.addEventListener('mousedown', onMouseDown)
    
    document.body.appendChild(showBtn)
    this.showWidgetButton = showBtn
  }

  removeShowWidgetButton() {
    if (this.showWidgetButton) {
      this.showWidgetButton.remove()
      this.showWidgetButton = null
    }
  }

  ensureWidgetVisibility() {
    if (!this.floatingWidget) return
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Force responsive positioning based on screen size with maximum z-index
    if (viewportWidth <= 320) {
      // Extra small screens
      this.floatingWidget.style.width = 'calc(100vw - 16px)'
      this.floatingWidget.style.maxWidth = 'calc(100vw - 16px)'
      this.floatingWidget.style.minWidth = '260px'
      this.floatingWidget.style.right = '8px'
      this.floatingWidget.style.top = '8px'
      this.floatingWidget.style.left = '8px'
      this.floatingWidget.style.position = 'fixed'
      this.floatingWidget.style.zIndex = '2147483647'
      this.floatingWidget.style.transform = 'translateZ(0)'
    } else if (viewportWidth <= 480) {
      // Mobile: Full width with proper margins
      this.floatingWidget.style.width = 'calc(100vw - 20px)'
      this.floatingWidget.style.maxWidth = 'calc(100vw - 20px)'
      this.floatingWidget.style.minWidth = '280px'
      this.floatingWidget.style.right = '10px'
      this.floatingWidget.style.top = '10px'
      this.floatingWidget.style.left = '10px'
      this.floatingWidget.style.position = 'fixed'
      this.floatingWidget.style.zIndex = '2147483647'
      this.floatingWidget.style.transform = 'translateZ(0)'
    } else if (viewportWidth <= 768) {
      // Tablet: Medium width
      this.floatingWidget.style.width = '240px'
      this.floatingWidget.style.maxWidth = '240px'
      this.floatingWidget.style.right = '15px'
      this.floatingWidget.style.top = '15px'
      this.floatingWidget.style.left = 'auto'
      this.floatingWidget.style.position = 'fixed'
      this.floatingWidget.style.zIndex = '2147483647'
      this.floatingWidget.style.transform = 'translateZ(0)'
    } else if (viewportWidth <= 1024) {
      // Small desktop
      this.floatingWidget.style.width = '250px'
      this.floatingWidget.style.maxWidth = '250px'
      this.floatingWidget.style.right = '18px'
      this.floatingWidget.style.top = '18px'
      this.floatingWidget.style.left = 'auto'
      this.floatingWidget.style.position = 'fixed'
      this.floatingWidget.style.zIndex = '2147483647'
      this.floatingWidget.style.transform = 'translateZ(0)'
    } else {
      // Desktop: Full width
      this.floatingWidget.style.width = '260px'
      this.floatingWidget.style.maxWidth = '260px'
      this.floatingWidget.style.right = '20px'
      this.floatingWidget.style.top = '20px'
      this.floatingWidget.style.left = 'auto'
      this.floatingWidget.style.position = 'fixed'
      this.floatingWidget.style.zIndex = '2147483647'
      this.floatingWidget.style.transform = 'translateZ(0)'
    }
    
    // Ensure widget doesn't go below viewport
    const widgetRect = this.floatingWidget.getBoundingClientRect()
    if (widgetRect.bottom > viewportHeight - 10) {
      this.floatingWidget.style.top = Math.max(10, viewportHeight - widgetRect.height - 10) + 'px'
    }
    
    // Force visibility
    this.floatingWidget.style.visibility = 'visible'
    this.floatingWidget.style.opacity = '1'
    this.floatingWidget.style.display = 'block'
  }

  positionShowButtonResponsively(showBtn) {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    if (viewportWidth <= 320) {
      // Extra small screens
      showBtn.style.top = '8px'
      showBtn.style.right = '8px'
      showBtn.style.left = 'auto'
      showBtn.style.width = '44px'
      showBtn.style.height = '44px'
      showBtn.style.fontSize = '18px'
    } else if (viewportWidth <= 480) {
      // Mobile: Position at top-right with smaller size
      showBtn.style.top = '10px'
      showBtn.style.right = '10px'
      showBtn.style.left = 'auto'
      showBtn.style.width = '48px'
      showBtn.style.height = '48px'
      showBtn.style.fontSize = '20px'
    } else if (viewportWidth <= 768) {
      // Tablet: Medium size
      showBtn.style.top = '15px'
      showBtn.style.right = '15px'
      showBtn.style.left = 'auto'
      showBtn.style.width = '52px'
      showBtn.style.height = '52px'
      showBtn.style.fontSize = '22px'
    } else if (viewportWidth <= 1024) {
      // Small desktop
      showBtn.style.top = '18px'
      showBtn.style.right = '18px'
      showBtn.style.left = 'auto'
      showBtn.style.width = '56px'
      showBtn.style.height = '56px'
      showBtn.style.fontSize = '24px'
    } else {
      // Desktop: Full size
      showBtn.style.top = '20px'
      showBtn.style.right = '20px'
      showBtn.style.left = 'auto'
      showBtn.style.width = '56px'
      showBtn.style.height = '56px'
      showBtn.style.fontSize = '24px'
    }
    
    showBtn.style.position = 'fixed'
    showBtn.style.zIndex = '2147483647'
    showBtn.style.transform = 'translateZ(0)'
    showBtn.style.visibility = 'visible'
    showBtn.style.opacity = '1'
    showBtn.style.display = 'flex'
  }
}

// Initialize the analyzer
let analyzer

// Add version identifier for debugging
console.log('CodeLens: Content script loaded - Version 1.0.1');
window.codelensVersion = '1.0.1';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('CodeLens: DOM loaded, initializing analyzer');
    analyzer = new CodeLensAnalyzer()
  })
} else {
  console.log('CodeLens: DOM already loaded, initializing analyzer immediately');
  analyzer = new CodeLensAnalyzer()
}
