/**
 * Parser for VIM help files (.txt format)
 * Converts VIM help syntax to HTML for display in the app
 */

export interface ParsedHelpContent {
  title: string
  sections: HelpSection[]
  tags: Map<string, number> // tag name -> line number
}

export interface HelpSection {
  id: string
  title: string
  content: string
  level: number
}

export class VimHelpParser {
  private lines: string[]
  private tags: Map<string, number>
  
  constructor(content: string) {
    this.lines = content.split('\n')
    this.tags = new Map()
  }

  parse(): ParsedHelpContent {
    const sections: HelpSection[] = []
    let currentSection: HelpSection | null = null
    let contentBuffer: string[] = []
    
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i]
      
      // Extract tags (*tag-name*)
      const tagMatches = line.matchAll(/\*([^*]+)\*/g)
      for (const match of tagMatches) {
        this.tags.set(match[1], i)
      }
      
      // Check if this is a section header
      if (this.isSectionHeader(line, i)) {
        // Save previous section
        if (currentSection && contentBuffer.length > 0) {
          currentSection.content = this.formatContent(contentBuffer.join('\n'))
          sections.push(currentSection)
        }
        
        // Start new section
        currentSection = {
          id: this.generateSectionId(line),
          title: this.cleanSectionTitle(line),
          content: '',
          level: this.getSectionLevel(line)
        }
        contentBuffer = []
      } else if (currentSection) {
        contentBuffer.push(line)
      }
    }
    
    // Save last section
    if (currentSection && contentBuffer.length > 0) {
      currentSection.content = this.formatContent(contentBuffer.join('\n'))
      sections.push(currentSection)
    }
    
    return {
      title: this.extractTitle(),
      sections,
      tags: this.tags
    }
  }

  private isSectionHeader(line: string, index: number): boolean {
    // Check for various section header patterns
    if (line.match(/^={3,}$/)) return false // Skip separator lines
    
    // Numbered sections (1., 2.1., etc)
    if (line.match(/^\d+\.(\d+\.)?\s+\S/)) return true
    
    // All caps headers
    if (line.match(/^[A-Z][A-Z\s]+$/)) return true
    
    // Lines followed by ===== or -----
    if (index < this.lines.length - 1) {
      const nextLine = this.lines[index + 1]
      if (nextLine.match(/^[=-]{3,}$/)) return true
    }
    
    return false
  }

  private getSectionLevel(line: string): number {
    if (line.match(/^\d+\.\s/)) return 1
    if (line.match(/^\d+\.\d+\.\s/)) return 2
    if (line.match(/^[A-Z][A-Z\s]+$/)) return 1
    return 3
  }

  private generateSectionId(line: string): string {
    return line.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
  }

  private cleanSectionTitle(line: string): string {
    return line.replace(/\*([^*]+)\*/g, '$1').trim()
  }

  private extractTitle(): string {
    // Look for the main title in the first few lines
    for (let i = 0; i < Math.min(10, this.lines.length); i++) {
      const line = this.lines[i]
      if (line.includes('.txt') && line.includes('For Vim')) {
        return line.split(/\s+/)[0].replace('.txt', '')
      }
    }
    return 'VIM Help'
  }

  private formatContent(content: string): string {
    // Convert VIM help syntax to HTML
    let formatted = content
    
    // Escape HTML
    formatted = formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    // Convert *tags* to anchors
    formatted = formatted.replace(/\*([^*]+)\*/g, '<span class="vim-help-tag" id="$1">$1</span>')
    
    // Convert |links| to clickable links
    formatted = formatted.replace(/\|([^|]+)\|/g, '<a href="#$1" class="vim-help-link">$1</a>')
    
    // Format code blocks (lines starting with > or tab)
    formatted = formatted.split('\n').map(line => {
      if (line.match(/^(\s{4,}|>|\t)/)) {
        return `<pre class="vim-help-code">${line}</pre>`
      }
      return line
    }).join('\n')
    
    // Convert key combinations
    formatted = formatted.replace(/CTRL-(\w)/g, '<kbd>Ctrl-$1</kbd>')
    formatted = formatted.replace(/<([A-Za-z-]+)>/g, '<kbd>$1</kbd>')
    
    // Convert consecutive code blocks into a single block
    formatted = formatted.replace(/(<\/pre><br><pre class="vim-help-code">)/g, '\n')
    
    // Preserve line breaks
    formatted = formatted.replace(/\n/g, '<br>')
    
    return formatted
  }
}

/**
 * Fetch and cache VIM help files
 */
export class VimHelpCache {
  private cache: Map<string, ParsedHelpContent> = new Map()
  private baseUrl = '/vim-help/'
  public isPreloaded = false
  
  async getHelpFile(filename: string): Promise<ParsedHelpContent | null> {
    // Check cache first
    if (this.cache.has(filename)) {
      return this.cache.get(filename)!
    }
    
    try {
      // Load from bundled help files
      const response = await fetch(`${this.baseUrl}${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load help file: ${filename}`)
      }
      
      const content = await response.text()
      const parser = new VimHelpParser(content)
      const parsed = parser.parse()
      
      this.cache.set(filename, parsed)
      return parsed
    } catch (error) {
      console.error(`Failed to fetch help file ${filename}:`, error)
      
      // Fallback to index.txt if specific file not found
      if (filename !== 'index.txt') {
        return this.getHelpFile('index.txt')
      }
      
      return null
    }
  }
  
  // Preload common help files for better performance
  async preloadCommonFiles(): Promise<void> {
    if (this.isPreloaded) return
    
    const commonFiles = [
      'index.txt',
      'motion.txt',
      'insert.txt',
      'change.txt',
      'visual.txt',
      'pattern.txt'
    ]
    
    await Promise.all(
      commonFiles.map(file => this.getHelpFile(file))
    )
    
    this.isPreloaded = true
  }
}

// Singleton instance
export const vimHelpCache = new VimHelpCache()