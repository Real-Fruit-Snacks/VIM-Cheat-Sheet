interface ExampleState {
  text: string[]
  cursorRow: number
  cursorCol: number
  mode: 'normal' | 'insert' | 'visual' | 'command'
  description: string
}

interface VimCommandExample {
  command: string
  beforeState: ExampleState
  afterState: ExampleState
  explanation: string
}

export const vimExamples: Record<string, VimCommandExample> = {
  'h': {
    command: 'h',
    beforeState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor on "b" in "brown"'
    },
    afterState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 9,
      mode: 'normal',
      description: 'Cursor moved left to space before "brown"'
    },
    explanation: 'Moves cursor one character to the left. If at beginning of line, cursor stays in place.'
  },

  'j': {
    command: 'j',
    beforeState: {
      text: [
        'First line of text',
        'Second line here',
        'Third line below'
      ],
      cursorRow: 0,
      cursorCol: 6,
      mode: 'normal',
      description: 'Cursor on "l" in "line" (first line)'
    },
    afterState: {
      text: [
        'First line of text',
        'Second line here',
        'Third line below'
      ],
      cursorRow: 1,
      cursorCol: 6,
      mode: 'normal',
      description: 'Cursor moved down to "l" in "line" (second line)'
    },
    explanation: 'Moves cursor down one line. Tries to maintain the same column position when possible.'
  },

  'k': {
    command: 'k',
    beforeState: {
      text: [
        'First line of text',
        'Second line here',
        'Third line below'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on "i" in "line" (second line)'
    },
    afterState: {
      text: [
        'First line of text',
        'Second line here',
        'Third line below'
      ],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor moved up to "i" in "line" (first line)'
    },
    explanation: 'Moves cursor up one line. Maintains column position or moves to end of line if shorter.'
  },

  'l': {
    command: 'l',
    beforeState: {
      text: ['Hello world!'],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on space between "Hello" and "world"'
    },
    afterState: {
      text: ['Hello world!'],
      cursorRow: 0,
      cursorCol: 6,
      mode: 'normal',
      description: 'Cursor moved right to "w" in "world"'
    },
    explanation: 'Moves cursor one character to the right. If at end of line, cursor stays in place.'
  },

  'w': {
    command: 'w',
    beforeState: {
      text: ['The quick brown fox jumps over'],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Cursor on "q" in "quick"'
    },
    afterState: {
      text: ['The quick brown fox jumps over'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor moved to "b" in "brown" (start of next word)'
    },
    explanation: 'Moves to the beginning of the next word. Words are separated by spaces or punctuation.'
  },

  'b': {
    command: 'b',
    beforeState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 16,
      mode: 'normal',
      description: 'Cursor on "f" in "fox"'
    },
    afterState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor moved to "b" in "brown" (start of previous word)'
    },
    explanation: 'Moves to the beginning of the previous word. Useful for navigating backwards through text.'
  },

  'e': {
    command: 'e',
    beforeState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Cursor on "q" in "quick"'
    },
    afterState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor moved to "k" (end of "quick")'
    },
    explanation: 'Moves to the end of the current word. If already at the end, moves to the end of the next word.'
  },

  '0': {
    command: '0',
    beforeState: {
      text: ['    Hello world from VIM!'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor on "o" in "world"'
    },
    afterState: {
      text: ['    Hello world from VIM!'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at beginning of line (first character)'
    },
    explanation: 'Moves to the very beginning of the line, including any leading whitespace.'
  },

  '^': {
    command: '^',
    beforeState: {
      text: ['    Hello world from VIM!'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor on "o" in "world"'
    },
    afterState: {
      text: ['    Hello world from VIM!'],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Cursor on "H" (first non-whitespace character)'
    },
    explanation: 'Moves to the first non-blank character of the line, skipping leading whitespace.'
  },

  '$': {
    command: '$',
    beforeState: {
      text: ['Hello world from VIM!'],
      cursorRow: 0,
      cursorCol: 6,
      mode: 'normal',
      description: 'Cursor on "w" in "world"'
    },
    afterState: {
      text: ['Hello world from VIM!'],
      cursorRow: 0,
      cursorCol: 19,
      mode: 'normal',
      description: 'Cursor on "!" (last character of line)'
    },
    explanation: 'Moves to the end of the line. One of the most frequently used navigation commands.'
  },

  '%': {
    command: '%',
    beforeState: {
      text: [
        'function example() {',
        '    return "hello";',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 18,
      mode: 'normal',
      description: 'Cursor on opening "{" brace'
    },
    afterState: {
      text: [
        'function example() {',
        '    return "hello";',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor jumped to matching "}" brace'
    },
    explanation: 'Jumps to the matching bracket, parenthesis, or brace. Works with (), [], {}, and more.'
  },

  '(': {
    command: '(',
    beforeState: {
      text: [
        'This is the first sentence. This is the second one.',
        'Here starts a new sentence after paragraph.'
      ],
      cursorRow: 0,
      cursorCol: 35,
      mode: 'normal',
      description: 'Cursor in the middle of second sentence'
    },
    afterState: {
      text: [
        'This is the first sentence. This is the second one.',
        'Here starts a new sentence after paragraph.'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at beginning of first sentence'
    },
    explanation: 'Moves to the beginning of the current sentence. Sentences are separated by periods, exclamation marks, or question marks followed by spaces.'
  },

  ')': {
    command: ')',
    beforeState: {
      text: [
        'This is the first sentence. This is the second one.',
        'Here starts a new sentence after paragraph.'
      ],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor in the middle of first sentence'
    },
    afterState: {
      text: [
        'This is the first sentence. This is the second one.',
        'Here starts a new sentence after paragraph.'
      ],
      cursorRow: 0,
      cursorCol: 28,
      mode: 'normal',
      description: 'Cursor at beginning of second sentence'
    },
    explanation: 'Moves to the beginning of the next sentence. Useful for navigating through paragraphs of text.'
  },

  // Editing Commands
  'dd': {
    command: 'dd',
    beforeState: {
      text: [
        'First line to keep',
        'This line will be deleted',
        'Last line to keep'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on line to be deleted'
    },
    afterState: {
      text: [
        'First line to keep',
        'Last line to keep'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Line deleted, cursor on next line'
    },
    explanation: 'Deletes the entire current line and moves cursor to the beginning of the next line. The deleted line is stored in the default register.'
  },

  'dw': {
    command: 'dw',
    beforeState: {
      text: ['Delete this word and keep rest'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on "t" in "this"'
    },
    afterState: {
      text: ['Delete word and keep rest'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Word "this " deleted'
    },
    explanation: 'Deletes from cursor to the beginning of the next word, including any trailing spaces. Cursor remains at the same position.'
  },

  'cw': {
    command: 'cw',
    beforeState: {
      text: ['Change this word to something else'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on "t" in "this"'
    },
    afterState: {
      text: ['Change word to something else'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'insert',
      description: 'Ready to type replacement word'
    },
    explanation: 'Changes the word from cursor position to end of word, then enters insert mode. The deleted text is stored in the default register.'
  },

  'yy': {
    command: 'yy',
    beforeState: {
      text: [
        'First line of text',
        'This line will be copied',
        'Third line of text'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on line to copy'
    },
    afterState: {
      text: [
        'First line of text',
        'This line will be copied',
        'Third line of text'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Line copied to register (no visual change)'
    },
    explanation: 'Copies (yanks) the entire current line to the default register. No visual change occurs, but the line is now available for pasting with "p".'
  },

  'p': {
    command: 'p',
    beforeState: {
      text: [
        'First line',
        'Second line'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor after "First line" (register contains "copied text")'
    },
    afterState: {
      text: [
        'First line',
        'copied text',
        'Second line'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Pasted line below current line'
    },
    explanation: 'Pastes the contents of the default register after the current line (for line-wise content) or after cursor (for character-wise content).'
  },

  'x': {
    command: 'x',
    beforeState: {
      text: ['Remove the extra x character here'],
      cursorRow: 0,
      cursorCol: 17,
      mode: 'normal',
      description: 'Cursor on "x" character to delete'
    },
    afterState: {
      text: ['Remove the extra  character here'],
      cursorRow: 0,
      cursorCol: 17,
      mode: 'normal',
      description: 'Character deleted, cursor stays in place'
    },
    explanation: 'Deletes the character under the cursor. If at end of line, deletes the previous character.'
  },

  // Insert Mode Commands
  'i': {
    command: 'i',
    beforeState: {
      text: ['Insert text here'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on "t" in "text"'
    },
    afterState: {
      text: ['Insert text here'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'insert',
      description: 'Insert mode at cursor position'
    },
    explanation: 'Enters insert mode at the current cursor position. You can now type to insert text before the character under the cursor.'
  },

  'a': {
    command: 'a',
    beforeState: {
      text: ['Append text here'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on "t" in "text"'
    },
    afterState: {
      text: ['Append text here'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'insert',
      description: 'Insert mode after cursor position'
    },
    explanation: 'Enters insert mode after the current cursor position. You can now type to insert text after the character under the cursor.'
  },

  'o': {
    command: 'o',
    beforeState: {
      text: [
        'First line',
        'Second line'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on first line'
    },
    afterState: {
      text: [
        'First line',
        '',
        'Second line'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'insert',
      description: 'New line created below, insert mode'
    },
    explanation: 'Opens a new line below the current line and enters insert mode. Cursor is positioned at the beginning of the new line.'
  },

  'A': {
    command: 'A',
    beforeState: {
      text: ['Append at end of this line'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor in middle of line'
    },
    afterState: {
      text: ['Append at end of this line'],
      cursorRow: 0,
      cursorCol: 25,
      mode: 'insert',
      description: 'Insert mode at end of line'
    },
    explanation: 'Moves cursor to the end of the current line and enters insert mode. Useful for adding content at the end of a line.'
  },

  'I': {
    command: 'I',
    beforeState: {
      text: ['    Insert at beginning of this line'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor in middle of line'
    },
    afterState: {
      text: ['    Insert at beginning of this line'],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'insert',
      description: 'Insert mode at first non-blank character'
    },
    explanation: 'Moves cursor to the first non-blank character of the line and enters insert mode. Skips leading whitespace.'
  },

  'O': {
    command: 'O',
    beforeState: {
      text: [
        'First line',
        'Second line'
      ],
      cursorRow: 1,
      cursorCol: 3,
      mode: 'normal',
      description: 'Cursor on second line'
    },
    afterState: {
      text: [
        'First line',
        '',
        'Second line'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'insert',
      description: 'New line created above, insert mode'
    },
    explanation: 'Opens a new line above the current line and enters insert mode. Cursor is positioned at the beginning of the new line.'
  },

  // Text Object Examples  
  'diw': {
    command: 'diw',
    beforeState: {
      text: ['Delete the word under cursor here'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Cursor inside "word"'
    },
    afterState: {
      text: ['Delete the  under cursor here'],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'normal',
      description: 'Word deleted, cursor moved left'
    },
    explanation: 'Deletes the inner word under the cursor. Works regardless of cursor position within the word.'
  },

  'ciw': {
    command: 'ciw',
    beforeState: {
      text: ['Change the word under cursor here'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Cursor inside "word"'
    },
    afterState: {
      text: ['Change the  under cursor here'],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'insert',
      description: 'Word deleted, ready to type replacement'
    },
    explanation: 'Changes the inner word under the cursor and enters insert mode. Perfect for quickly replacing a word.'
  },

  'yiw': {
    command: 'yiw',
    beforeState: {
      text: ['Copy the word under cursor here'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor inside "word"'
    },
    afterState: {
      text: ['Copy the word under cursor here'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Word copied to register (no visual change)'
    },
    explanation: 'Copies (yanks) the inner word under the cursor to the default register. No visual change, but word is ready for pasting.'
  },

  // Visual Mode Examples
  'v': {
    command: 'v',
    beforeState: {
      text: ['Select some text in this line'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on "s" in "some"'
    },
    afterState: {
      text: ['Select some text in this line'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'visual',
      description: 'Visual mode started, ready to select'
    },
    explanation: 'Enters character-wise visual mode. Move the cursor to extend selection, then use operators like d, c, or y.'
  },

  'V': {
    command: 'V',
    beforeState: {
      text: [
        'First line of text',
        'Select this entire line',
        'Third line of text'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on line to select'
    },
    afterState: {
      text: [
        'First line of text',
        'Select this entire line',
        'Third line of text'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'visual',
      description: 'Line-wise visual mode, entire line selected'
    },
    explanation: 'Enters line-wise visual mode, selecting the entire current line. Move up/down to select multiple lines.'
  },

  // Search and Replace Examples
  '/': {
    command: '/',
    beforeState: {
      text: [
        'Search for word in this text',
        'The word appears multiple times',
        'Find every word occurrence'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Ready to search'
    },
    afterState: {
      text: [
        'Search for word in this text',
        'The word appears multiple times',
        'Find every word occurrence'
      ],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'normal',
      description: 'Found first "word" occurrence'
    },
    explanation: 'Enters search mode. Type your search pattern and press Enter. Cursor jumps to first match. Use "n" for next match, "N" for previous.'
  },

  'n': {
    command: 'n',
    beforeState: {
      text: [
        'Search for word in this text',
        'The word appears multiple times',
        'Find every word occurrence'
      ],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'normal',
      description: 'Currently on first "word" match'
    },
    afterState: {
      text: [
        'Search for word in this text',
        'The word appears multiple times',
        'Find every word occurrence'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Jumped to next "word" match'
    },
    explanation: 'Repeats the last search in the same direction. Jumps to the next occurrence of your search pattern.'
  },

  'N': {
    command: 'N',
    beforeState: {
      text: [
        'Search for word in this text',
        'The word appears multiple times',
        'Find every word occurrence'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Currently on second "word" match'
    },
    afterState: {
      text: [
        'Search for word in this text',
        'The word appears multiple times',
        'Find every word occurrence'
      ],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'normal',
      description: 'Jumped to previous "word" match'
    },
    explanation: 'Repeats the last search in the opposite direction. Jumps to the previous occurrence of your search pattern.'
  },

  // Undo/Redo Examples
  'u': {
    command: 'u',
    beforeState: {
      text: [
        'Original text here',
        'This line was just added',
        'More original text'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'After adding new line'
    },
    afterState: {
      text: [
        'Original text here',
        'More original text'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Change undone, line removed'
    },
    explanation: 'Undoes the last change. VIM tracks all changes in chronological order. You can undo multiple times with repeated "u".'
  },

  'Ctrl-r': {
    command: 'Ctrl-r',
    beforeState: {
      text: [
        'Original text here',
        'More original text'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'After undoing a change'
    },
    afterState: {
      text: [
        'Original text here',
        'This line was just added',
        'More original text'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Change redone, line restored'
    },
    explanation: 'Redoes the last undone change. Useful when you undo too many changes and want to bring some back.'
  },

  // More Text Objects
  'da(': {
    command: 'da(',
    beforeState: {
      text: ['Delete (everything inside parentheses) here'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['Delete  here'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Parentheses and contents deleted'
    },
    explanation: 'Deletes around parentheses - removes both the parentheses and everything inside them. Works from anywhere within the parentheses.'
  },

  'di"': {
    command: 'di"',
    beforeState: {
      text: ['Change the "quoted text content" here'],
      cursorRow: 0,
      cursorCol: 18,
      mode: 'normal',
      description: 'Cursor inside quotes'
    },
    afterState: {
      text: ['Change the "" here'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Content inside quotes deleted'
    },
    explanation: 'Deletes the text inside double quotes, leaving the quotes intact. Cursor can be anywhere within the quoted text.'
  },

  'ca{': {
    command: 'ca{',
    beforeState: {
      text: [
        'function example() {',
        '    return "hello";',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor inside braces'
    },
    afterState: {
      text: ['function example() '],
      cursorRow: 0,
      cursorCol: 19,
      mode: 'insert',
      description: 'Braces and contents deleted, insert mode'
    },
    explanation: 'Changes around braces - deletes the braces and all content inside, then enters insert mode. Perfect for rewriting function bodies.'
  },

  // Document Navigation Examples
  'gg': {
    command: 'gg',
    beforeState: {
      text: [
        'First line of document',
        'Second line here',
        'Third line here',
        'Currently on this line',
        'Last line of document'
      ],
      cursorRow: 3,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor somewhere in middle of document'
    },
    afterState: {
      text: [
        'First line of document',
        'Second line here',
        'Third line here',
        'Currently on this line',
        'Last line of document'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to first line, first character'
    },
    explanation: 'Moves cursor to the very first line of the document, first character. Essential for quickly jumping to the beginning of any file.'
  },

  'G': {
    command: 'G',
    beforeState: {
      text: [
        'First line of document',
        'Second line here',
        'Third line here',
        'Currently on this line',
        'Last line of document'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor near beginning of document'
    },
    afterState: {
      text: [
        'First line of document',
        'Second line here',
        'Third line here',
        'Currently on this line',
        'Last line of document'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to last line, first character'
    },
    explanation: 'Moves cursor to the last line of the document. Use with line numbers (like 5G) to jump to specific lines.'
  },

  '5G': {
    command: '5G',
    beforeState: {
      text: [
        'Line 1: First line',
        'Line 2: Second line',
        'Line 3: Third line',
        'Line 4: Fourth line',
        'Line 5: Target line',
        'Line 6: Sixth line',
        'Line 7: Last line'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on line 2'
    },
    afterState: {
      text: [
        'Line 1: First line',
        'Line 2: Second line',
        'Line 3: Third line',
        'Line 4: Fourth line',
        'Line 5: Target line',
        'Line 6: Sixth line',
        'Line 7: Last line'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor jumped to line 5'
    },
    explanation: 'Jumps to line 5 (or any specified line number). Replace 5 with any line number to jump there directly.'
  },

  '{': {
    command: '{',
    beforeState: {
      text: [
        'First paragraph of text that contains',
        'multiple lines with content.',
        '',
        'Second paragraph starts here and',
        'continues with more text.',
        '',
        'Third paragraph is where cursor',
        'is currently located.'
      ],
      cursorRow: 6,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor in third paragraph'
    },
    afterState: {
      text: [
        'First paragraph of text that contains',
        'multiple lines with content.',
        '',
        'Second paragraph starts here and',
        'continues with more text.',
        '',
        'Third paragraph is where cursor',
        'is currently located.'
      ],
      cursorRow: 3,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to start of previous paragraph'
    },
    explanation: 'Moves to the beginning of the previous paragraph. Paragraphs are separated by blank lines.'
  },

  '}': {
    command: '}',
    beforeState: {
      text: [
        'First paragraph of text that contains',
        'multiple lines with content.',
        '',
        'Second paragraph starts here and',
        'continues with more text.',
        '',
        'Third paragraph comes after this.'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor in first paragraph'
    },
    afterState: {
      text: [
        'First paragraph of text that contains',
        'multiple lines with content.',
        '',
        'Second paragraph starts here and',
        'continues with more text.',
        '',
        'Third paragraph comes after this.'
      ],
      cursorRow: 3,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to start of next paragraph'
    },
    explanation: 'Moves to the beginning of the next paragraph. Essential for navigating through text documents.'
  },

  'H': {
    command: 'H',
    beforeState: {
      text: [
        'Top line visible on screen',
        'Second line visible',
        'Third line visible',
        'Current cursor line in middle',
        'Fifth line visible',
        'Bottom line visible on screen'
      ],
      cursorRow: 3,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor in middle of visible screen'
    },
    afterState: {
      text: [
        'Top line visible on screen',
        'Second line visible',
        'Third line visible',
        'Current cursor line in middle',
        'Fifth line visible',
        'Bottom line visible on screen'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to top of screen'
    },
    explanation: 'Moves cursor to the highest line visible on screen (Home). Useful for quick screen navigation.'
  },

  'M': {
    command: 'M',
    beforeState: {
      text: [
        'Top line visible on screen',
        'Second line visible',
        'Third line visible',
        'Fourth line visible',
        'Bottom line visible on screen'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor near top of screen'
    },
    afterState: {
      text: [
        'Top line visible on screen',
        'Second line visible',
        'Third line visible',
        'Fourth line visible',
        'Bottom line visible on screen'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to middle of screen'
    },
    explanation: 'Moves cursor to the middle line of the visible screen. Great for quick orientation within the viewport.'
  },

  'L': {
    command: 'L',
    beforeState: {
      text: [
        'Top line visible on screen',
        'Second line visible',
        'Third line visible',
        'Current cursor line',
        'Bottom line visible on screen'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor near top of screen'
    },
    afterState: {
      text: [
        'Top line visible on screen',
        'Second line visible',
        'Third line visible',
        'Current cursor line',
        'Bottom line visible on screen'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to bottom of screen'
    },
    explanation: 'Moves cursor to the lowest line visible on screen (Last). Complements H and M for screen navigation.'
  },

  // Scrolling Examples
  'Ctrl-u': {
    command: 'Ctrl-u',
    beforeState: {
      text: [
        'Line 1 (above viewport)',
        'Line 2 (above viewport)', 
        'Line 3 (above viewport)',
        'Line 4 (top of screen)',
        'Line 5 (visible)',
        'Line 6 (cursor here)',
        'Line 7 (bottom of screen)'
      ],
      cursorRow: 5,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor in middle of viewport'
    },
    afterState: {
      text: [
        'Line 1 (above viewport)',
        'Line 2 (top of screen now)',
        'Line 3 (visible now)',
        'Line 4 (cursor here now)',
        'Line 5 (visible)',
        'Line 6 (bottom of screen)',
        'Line 7 (below viewport)'
      ],
      cursorRow: 3,
      cursorCol: 5,
      mode: 'normal',
      description: 'Scrolled up half page, cursor adjusted'
    },
    explanation: 'Scrolls up half a page. Cursor moves with the scroll to maintain relative position on screen.'
  },

  'Ctrl-d': {
    command: 'Ctrl-d',
    beforeState: {
      text: [
        'Line 1 (top of screen)',
        'Line 2 (visible)',
        'Line 3 (cursor here)',
        'Line 4 (visible)',
        'Line 5 (bottom of screen)',
        'Line 6 (below viewport)',
        'Line 7 (below viewport)'
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor in middle of viewport'
    },
    afterState: {
      text: [
        'Line 1 (above viewport)',
        'Line 2 (above viewport)',
        'Line 3 (top of screen now)',
        'Line 4 (cursor here now)',
        'Line 5 (visible)',
        'Line 6 (visible now)',
        'Line 7 (bottom of screen)'
      ],
      cursorRow: 3,
      cursorCol: 8,
      mode: 'normal',
      description: 'Scrolled down half page, cursor adjusted'
    },
    explanation: 'Scrolls down half a page. The cursor maintains its relative position on the screen.'
  },

  'zz': {
    command: 'zz',
    beforeState: {
      text: [
        'Line 1 (top of screen)',
        'Line 2 (visible)',
        'Line 3 (cursor on this line)',
        'Line 4 (visible)',
        'Line 5 (bottom of screen)',
        'Line 6 (below screen)',
        'Line 7 (below screen)'
      ],
      cursorRow: 2,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor line near top of screen'
    },
    afterState: {
      text: [
        'Line 1 (above screen now)',
        'Line 2 (top of screen)',
        'Line 3 (cursor centered now)',
        'Line 4 (visible)',
        'Line 5 (visible)',
        'Line 6 (bottom of screen)',
        'Line 7 (below screen)'
      ],
      cursorRow: 2,
      cursorCol: 12,
      mode: 'normal',
      description: 'Current line centered on screen'
    },
    explanation: 'Centers the current line on the screen. Perfect for focusing on the line you\'re working on.'
  },

  'zt': {
    command: 'zt',
    beforeState: {
      text: [
        'Line 1 (top of screen)',
        'Line 2 (visible)',
        'Line 3 (visible)',
        'Line 4 (cursor here)',
        'Line 5 (bottom of screen)',
        'Line 6 (below screen)',
        'Line 7 (below screen)'
      ],
      cursorRow: 3,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor in middle of viewport'
    },
    afterState: {
      text: [
        'Line 4 (cursor at top now)',
        'Line 5 (visible)',
        'Line 6 (visible)',
        'Line 7 (visible)',
        'Line 8 (bottom of screen)',
        'Line 9 (below screen)',
        'Line 10 (below screen)'
      ],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Current line moved to top of screen'
    },
    explanation: 'Moves the current line to the top of the screen. Useful for seeing more context below the current line.'
  },

  'zb': {
    command: 'zb',
    beforeState: {
      text: [
        'Line 1 (above screen)',
        'Line 2 (above screen)',
        'Line 3 (top of screen)',
        'Line 4 (visible)',
        'Line 5 (cursor here)',
        'Line 6 (visible)',
        'Line 7 (bottom of screen)'
      ],
      cursorRow: 4,
      cursorCol: 6,
      mode: 'normal',
      description: 'Cursor in middle of viewport'
    },
    afterState: {
      text: [
        'Line 1 (top of screen now)',
        'Line 2 (visible)',
        'Line 3 (visible)',
        'Line 4 (visible)',
        'Line 5 (cursor at bottom)',
        'Line 6 (below screen)',
        'Line 7 (below screen)'
      ],
      cursorRow: 4,
      cursorCol: 6,
      mode: 'normal',
      description: 'Current line moved to bottom of screen'
    },
    explanation: 'Moves the current line to the bottom of the screen. Helpful for seeing more context above the current line.'
  },

  // Advanced Editing Examples
  'X': {
    command: 'X',
    beforeState: {
      text: ['Remove the extra character here'],
      cursorRow: 0,
      cursorCol: 17,
      mode: 'normal',
      description: 'Cursor on "c" in "character"'
    },
    afterState: {
      text: ['Remove the extr character here'],
      cursorRow: 0,
      cursorCol: 16,
      mode: 'normal',
      description: 'Character before cursor deleted'
    },
    explanation: 'Deletes the character before the cursor (to the left). Opposite of "x" which deletes under cursor.'
  },

  'D': {
    command: 'D',
    beforeState: {
      text: ['Keep this part, delete rest of line'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor on comma'
    },
    afterState: {
      text: ['Keep this part'],
      cursorRow: 0,
      cursorCol: 14,
      mode: 'normal',
      description: 'Everything from cursor to end deleted'
    },
    explanation: 'Deletes from cursor position to the end of the line. Equivalent to d$ but faster to type.'
  },

  'cc': {
    command: 'cc',
    beforeState: {
      text: [
        'First line stays',
        'Replace this entire line content',
        'Third line stays'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor on line to replace'
    },
    afterState: {
      text: [
        'First line stays',
        '',
        'Third line stays'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'insert',
      description: 'Line cleared, insert mode ready'
    },
    explanation: 'Changes the entire line - deletes all content and enters insert mode. Preserves indentation.'
  },

  'C': {
    command: 'C',
    beforeState: {
      text: ['Keep beginning, change rest of line'],
      cursorRow: 0,
      cursorCol: 16,
      mode: 'normal',
      description: 'Cursor on comma'
    },
    afterState: {
      text: ['Keep beginning'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'insert',
      description: 'Ready to type new ending'
    },
    explanation: 'Changes from cursor to end of line - deletes to end and enters insert mode. Like D but enters insert mode.'
  },

  's': {
    command: 's',
    beforeState: {
      text: ['Replace this x character with text'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor on "x" to replace'
    },
    afterState: {
      text: ['Replace this  character with text'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'insert',
      description: 'Character deleted, insert mode active'
    },
    explanation: 'Substitutes the character under cursor - deletes it and enters insert mode. Like "x" then "i".'
  },

  'S': {
    command: 'S',
    beforeState: {
      text: [
        'First line',
        '    Old line content to replace',
        'Third line'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on line to substitute'
    },
    afterState: {
      text: [
        'First line',
        '    ',
        'Third line'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'insert',
      description: 'Line content cleared, indentation preserved'
    },
    explanation: 'Substitutes the entire line - deletes content but preserves indentation, then enters insert mode.'
  },

  'r': {
    command: 'r',
    beforeState: {
      text: ['Replace this x with y character'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor on "x", will type "y"'
    },
    afterState: {
      text: ['Replace this y with y character'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Character replaced, stayed in normal mode'
    },
    explanation: 'Replaces the character under cursor with the next character you type. Stays in normal mode.'
  },

  'R': {
    command: 'R',
    beforeState: {
      text: ['Replace mode overwrites characters'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on "m" in "mode"'
    },
    afterState: {
      text: ['Replace mode overwrites characters'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'insert',
      description: 'Replace mode active - typing overwrites'
    },
    explanation: 'Enters replace mode where typing overwrites existing characters instead of inserting. Press Esc to exit.'
  },

  '.': {
    command: '.',
    beforeState: {
      text: [
        'First word here',
        'Second word here', 
        'Third word here'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'normal',
      description: 'After using "dw" on "word", cursor on next line'
    },
    afterState: {
      text: [
        'First word here',
        'Second here',
        'Third word here'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'normal',
      description: 'Last command (dw) repeated'
    },
    explanation: 'Repeats the last command that changed text. Extremely powerful for repetitive editing tasks.'
  },

  'J': {
    command: 'J',
    beforeState: {
      text: [
        'First line of text',
        'Second line to join'
      ],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on first line'
    },
    afterState: {
      text: ['First line of text Second line to join'],
      cursorRow: 0,
      cursorCol: 19,
      mode: 'normal',
      description: 'Lines joined with space, cursor at join point'
    },
    explanation: 'Joins the current line with the next line, adding a space between them. Cursor moves to the join point.'
  },

  'gJ': {
    command: 'gJ',
    beforeState: {
      text: [
        'First line',
        'Second line'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on first line'
    },
    afterState: {
      text: ['First lineSecond line'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Lines joined without space'
    },
    explanation: 'Joins lines without adding a space between them. Useful when you don\'t want automatic spacing.'
  },

  '~': {
    command: '~',
    beforeState: {
      text: ['Change Case of This Character'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on "C" in "Case"'
    },
    afterState: {
      text: ['Change case of This Character'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Case toggled, cursor moved right'
    },
    explanation: 'Toggles the case of the character under cursor (uppercase ↔ lowercase) and moves cursor right.'
  },

  // Copy/Paste Examples  
  'yw': {
    command: 'yw',
    beforeState: {
      text: ['Copy this word and keep it'],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on "t" in "this"'
    },
    afterState: {
      text: ['Copy this word and keep it'],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Word "this" copied to register'
    },
    explanation: 'Copies the word from cursor position to end of word. No visual change, but word is in register for pasting.'
  },

  'Y': {
    command: 'Y',
    beforeState: {
      text: [
        'Copy this line from cursor to end',
        'Second line here'
      ],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor in middle of first line'
    },
    afterState: {
      text: [
        'Copy this line from cursor to end',
        'Second line here'
      ],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Text from cursor to end copied'
    },
    explanation: 'Copies from cursor position to end of line. Same as y$ - useful for copying partial lines.'
  },

  'P': {
    command: 'P',
    beforeState: {
      text: [
        'First line',
        'Second line'
      ],
      cursorRow: 1,
      cursorCol: 3,
      mode: 'normal',
      description: 'Cursor on second line (register contains "inserted")'
    },
    afterState: {
      text: [
        'First line',
        'inserted',
        'Second line'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Content pasted above current line'
    },
    explanation: 'Pastes before cursor (above current line for line-wise content, before cursor for character-wise).'
  },

  // More Movement Commands
  'W': {
    command: 'W',
    beforeState: {
      text: ['Navigate through file-paths, URLs, and text-strings easily'],
      cursorRow: 0,
      cursorCol: 17,
      mode: 'normal',
      description: 'Cursor on hyphen in "file-paths"'
    },
    afterState: {
      text: ['Navigate through file-paths, URLs, and text-strings easily'],
      cursorRow: 0,
      cursorCol: 27,
      mode: 'normal',
      description: 'Cursor moved to "U" in "URLs"'
    },
    explanation: 'Moves to beginning of next WORD (space-delimited). Unlike "w", treats punctuation as part of words.'
  },

  'B': {
    command: 'B',
    beforeState: {
      text: ['Navigate through file-paths, URLs, and text-strings easily'],
      cursorRow: 0,
      cursorCol: 35,
      mode: 'normal',
      description: 'Cursor on "a" in "and"'
    },
    afterState: {
      text: ['Navigate through file-paths, URLs, and text-strings easily'],
      cursorRow: 0,
      cursorCol: 27,
      mode: 'normal',
      description: 'Cursor moved to "U" in "URLs"'
    },
    explanation: 'Moves to beginning of previous WORD. Treats punctuation as part of words, unlike "b".'
  },

  'E': {
    command: 'E',
    beforeState: {
      text: ['Navigate through file-paths, URLs, and text-strings easily'],
      cursorRow: 0,
      cursorCol: 27,
      mode: 'normal',
      description: 'Cursor on "U" in "URLs"'
    },
    afterState: {
      text: ['Navigate through file-paths, URLs, and text-strings easily'],
      cursorRow: 0,
      cursorCol: 30,
      mode: 'normal',
      description: 'Cursor moved to "s" at end of "URLs"'
    },
    explanation: 'Moves to end of current WORD. Includes punctuation as part of the word.'
  },

  // Text Object Examples  
  'y$': {
    command: 'y$',
    beforeState: {
      text: ['Copy from here to end of line'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor on "h" in "here"'
    },
    afterState: {
      text: ['Copy from here to end of line'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Text "here to end of line" copied'
    },
    explanation: 'Copies from cursor position to end of line. Useful for partial line copying.'
  },

  // More Text Objects
  'daw': {
    command: 'daw',
    beforeState: {
      text: ['Delete a word including spaces around it'],
      cursorRow: 0,
      cursorCol: 9,
      mode: 'normal',
      description: 'Cursor inside "word"'
    },
    afterState: {
      text: ['Delete aincluding spaces around it'],
      cursorRow: 0,
      cursorCol: 9,
      mode: 'normal',
      description: 'Word and surrounding space deleted'
    },
    explanation: 'Deletes "a word" - the word plus surrounding whitespace. More aggressive than "diw".'
  },

  'caw': {
    command: 'caw',
    beforeState: {
      text: ['Change a word including surrounding spaces'],
      cursorRow: 0,
      cursorCol: 9,
      mode: 'normal',
      description: 'Cursor inside "word"'
    },
    afterState: {
      text: ['Change aincluding surrounding spaces'],
      cursorRow: 0,
      cursorCol: 9,
      mode: 'insert',
      description: 'Word and spaces deleted, insert mode'
    },
    explanation: 'Changes "a word" including surrounding whitespace, then enters insert mode.'
  },

  'yaw': {
    command: 'yaw',
    beforeState: {
      text: ['Copy a word with its surrounding spaces'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor inside "word"'
    },
    afterState: {
      text: ['Copy a word with its surrounding spaces'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Word and spaces copied to register'
    },
    explanation: 'Copies "a word" including surrounding whitespace. Useful for moving words with their spacing.'
  },

  'di)': {
    command: 'di)',
    beforeState: {
      text: ['Function call(parameter, another, third)'],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['Function call()'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Contents inside parentheses deleted'
    },
    explanation: 'Deletes everything inside parentheses, leaving the parentheses intact. Works from anywhere inside.'
  },

  'da)': {
    command: 'da)',
    beforeState: {
      text: ['Function call(parameter, another, third)'],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['Function call'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Parentheses and contents deleted'
    },
    explanation: 'Deletes around parentheses - removes both parentheses and everything inside them.'
  },

  'ci)': {
    command: 'ci)',
    beforeState: {
      text: ['Function call(old parameter here)'],
      cursorRow: 0,
      cursorCol: 18,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['Function call()'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'insert',
      description: 'Contents cleared, ready for new parameters'
    },
    explanation: 'Changes inside parentheses - deletes contents and enters insert mode. Perfect for changing function parameters.'
  },

  // More Search Examples
  '?': {
    command: '?',
    beforeState: {
      text: [
        'Search backwards for pattern in text',
        'The pattern appears multiple times here',
        'Find pattern occurrences going backward'
      ],
      cursorRow: 2,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor near end of document'
    },
    afterState: {
      text: [
        'Search backwards for pattern in text',
        'The pattern appears multiple times here',
        'Find pattern occurrences going backward'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Found "pattern" searching backwards'
    },
    explanation: 'Searches backwards for a pattern. Type your search term and press Enter. Use N for next, n for previous when searching backwards.'
  },

  '*': {
    command: '*',
    beforeState: {
      text: [
        'Find word under cursor automatically',
        'The word appears in multiple places',
        'Same word here and everywhere else'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on "word"'
    },
    afterState: {
      text: [
        'Find word under cursor automatically',
        'The word appears in multiple places',
        'Same word here and everywhere else'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Found next "word" occurrence'
    },
    explanation: 'Searches forward for the word under cursor. Automatically searches for whole words, very convenient for finding variables/functions.'
  },

  '#': {
    command: '#',
    beforeState: {
      text: [
        'Find word under cursor automatically',
        'The word appears in multiple places',
        'Same word here and everywhere else'
      ],
      cursorRow: 2,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on "word"'
    },
    afterState: {
      text: [
        'Find word under cursor automatically',
        'The word appears in multiple places',
        'Same word here and everywhere else'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Found previous "word" occurrence'
    },
    explanation: 'Searches backward for the word under cursor. Like * but in reverse direction.'
  },

  // File Operations Examples
  ':w': {
    command: ':w',
    beforeState: {
      text: [
        'This file has been modified',
        'Need to save changes to disk',
        'Use :w to write file'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'File has unsaved changes'
    },
    afterState: {
      text: [
        'This file has been modified',
        'Need to save changes to disk',
        'Use :w to write file'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'File saved to disk successfully'
    },
    explanation: 'Writes (saves) the current file to disk. Essential command for preserving your work.'
  },

  ':q': {
    command: ':q',
    beforeState: {
      text: [
        'File content ready to close',
        'No unsaved changes',
        'Safe to quit'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Clean file ready to quit'
    },
    afterState: {
      text: [],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'VIM exited, returned to shell'
    },
    explanation: 'Quits VIM. Only works if there are no unsaved changes. Use :q! to force quit without saving.'
  },

  ':wq': {
    command: ':wq',
    beforeState: {
      text: [
        'File with unsaved changes',
        'Want to save and exit',
        'Use :wq for both operations'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'normal',
      description: 'File needs saving before exit'
    },
    afterState: {
      text: [],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File saved and VIM exited'
    },
    explanation: 'Writes the file and quits VIM in one command. The most common way to save and exit.'
  },

  // Visual Mode Examples  
  'gv': {
    command: 'gv',
    beforeState: {
      text: [
        'Previously selected text here',
        'This was the selected area',
        'Before deselecting it'
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'normal',
      description: 'After exiting visual mode'
    },
    afterState: {
      text: [
        'Previously selected text here',
        'This was the selected area',
        'Before deselecting it'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'visual',
      description: 'Previous selection restored'
    },
    explanation: 'Reselects the last visual selection. Useful when you accidentally exit visual mode and want the selection back.'
  },

  // Window Management Examples
  'Ctrl-w s': {
    command: 'Ctrl-w s',
    beforeState: {
      text: [
        'Single window view',
        'Current file content',
        'Want to split horizontally'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'One window open'
    },
    afterState: {
      text: [
        'Single window view',
        'Current file content - top window',
        'Want to split horizontally',
        '─────────────────────────────',
        'Single window view',
        'Current file content - bottom window',
        'Want to split horizontally'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Split into two horizontal windows'
    },
    explanation: 'Splits the current window horizontally. Same file appears in both windows, useful for viewing different parts simultaneously.'
  },

  'Ctrl-w v': {
    command: 'Ctrl-w v',
    beforeState: {
      text: [
        'Single window with file content',
        'Want to split vertically',
        'For side-by-side editing'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'normal',
      description: 'One window open'
    },
    afterState: {
      text: [
        'Single window │ Single window',
        'Want to split │ Want to split',
        'For side-by-  │ For side-by-'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'normal',
      description: 'Split into two vertical windows'
    },
    explanation: 'Splits the current window vertically. Creates side-by-side windows for comparing or editing related content.'
  },

  // Indentation Examples
  '>>': {
    command: '>>',
    beforeState: {
      text: [
        'function example() {',
        'return "hello";',
        'console.log("world");',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line needing indentation'
    },
    afterState: {
      text: [
        'function example() {',
        '    return "hello";',
        'console.log("world");',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Line indented by one shiftwidth'
    },
    explanation: 'Indents the current line by one shiftwidth (usually 4 spaces or 1 tab). Essential for code formatting.'
  },

  '<<': {
    command: '<<',
    beforeState: {
      text: [
        'function example() {',
        '        return "hello";',
        '    console.log("world");',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on over-indented line'
    },
    afterState: {
      text: [
        'function example() {',
        '    return "hello";',
        '    console.log("world");',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Line unindented by one shiftwidth'
    },
    explanation: 'Unindents the current line by one shiftwidth. Use to fix over-indented code.'
  },

  // Number Operations
  'Ctrl-a': {
    command: 'Ctrl-a',
    beforeState: {
      text: ['Version 1.4.2 needs incrementing'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on "1" in version number'
    },
    afterState: {
      text: ['Version 2.4.2 needs incrementing'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Number incremented from 1 to 2'
    },
    explanation: 'Increments the number under or after the cursor. Searches forward on the line if cursor is not on a number.'
  },

  'Ctrl-x': {
    command: 'Ctrl-x',
    beforeState: {
      text: ['Array index [5] is too high'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Cursor on "5" in array index'
    },
    afterState: {
      text: ['Array index [4] is too high'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Number decremented from 5 to 4'
    },
    explanation: 'Decrements the number under or after the cursor. Very useful for adjusting numeric values quickly.'
  },

  // Case Conversion Examples
  'guu': {
    command: 'guu',
    beforeState: {
      text: ['Convert THIS Line To Lowercase'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on line with mixed case'
    },
    afterState: {
      text: ['convert this line to lowercase'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Entire line converted to lowercase'
    },
    explanation: 'Converts the entire current line to lowercase. The "gu" operator with "u" for line.'
  },

  'gUU': {
    command: 'gUU',
    beforeState: {
      text: ['convert this line to uppercase'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on lowercase line'
    },
    afterState: {
      text: ['CONVERT THIS LINE TO UPPERCASE'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Entire line converted to uppercase'
    },
    explanation: 'Converts the entire current line to uppercase. The "gU" operator with "U" for line.'
  },

  'g~~': {
    command: 'g~~',
    beforeState: {
      text: ['Toggle Case Of This Entire Line'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor on line with mixed case'
    },
    afterState: {
      text: ['tOGGLE cASE oF tHIS eNTIRE lINE'],
      cursorRow: 0,
      cursorCol: 7,
      mode: 'normal',
      description: 'Every character case toggled'
    },
    explanation: 'Toggles the case of every character on the line. Uppercase becomes lowercase and vice versa.'
  },

  // Folding Examples
  'zf': {
    command: 'zf',
    beforeState: {
      text: [
        'function longFunction() {',
        '    // Many lines of code',
        '    let variable = "value";',
        '    console.log(variable);',
        '    return variable;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at start of function (will fold to closing brace)'
    },
    afterState: {
      text: [
        '+-- 6 lines: function longFunction() { ----'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Function folded into one line'
    },
    explanation: 'Creates a fold from cursor to matching brace/end. Use with motions like zf} to fold paragraphs or zf5j to fold 5 lines.'
  },

  'zo': {
    command: 'zo',
    beforeState: {
      text: [
        '+-- 6 lines: function longFunction() { ----'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on closed fold'
    },
    afterState: {
      text: [
        'function longFunction() {',
        '    // Many lines of code',
        '    let variable = "value";',
        '    console.log(variable);',
        '    return variable;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Fold opened, content visible'
    },
    explanation: 'Opens a fold under the cursor. Reveals the hidden content within the fold.'
  },

  'zc': {
    command: 'zc',
    beforeState: {
      text: [
        'function longFunction() {',
        '    // Many lines of code',
        '    let variable = "value";',
        '    console.log(variable);',
        '    return variable;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on foldable content'
    },
    afterState: {
      text: [
        '+-- 6 lines: function longFunction() { ----'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Content folded into one line'
    },
    explanation: 'Closes a fold under the cursor. Hides the content to reduce visual clutter and improve navigation.'
  },

  // Marks and Jumps Examples
  'ma': {
    command: 'ma',
    beforeState: {
      text: [
        'Important line to remember',
        'Other content here',
        'More lines of text',
        'Need to mark first line'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on important line'
    },
    afterState: {
      text: [
        'Important line to remember',
        'Other content here',
        'More lines of text',
        'Need to mark first line'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Mark "a" set at current position'
    },
    explanation: 'Sets mark "a" at current cursor position. Use lowercase letters for file-local marks, uppercase for global marks.'
  },

  "'a": {
    command: "'a",
    beforeState: {
      text: [
        'Important line to remember',
        'Other content here',
        'More lines of text',
        'Currently here, want to go to mark "a"'
      ],
      cursorRow: 3,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor away from mark "a"'
    },
    afterState: {
      text: [
        'Important line to remember',
        'Other content here',
        'More lines of text',
        'Currently here, want to go to mark "a"'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Jumped to line with mark "a"'
    },
    explanation: 'Jumps to the line containing mark "a". Cursor goes to the beginning of the marked line.'
  },

  '`a': {
    command: '`a',
    beforeState: {
      text: [
        'Important line to remember',
        'Other content here',
        'More lines of text',
        'Currently here, want exact mark position'
      ],
      cursorRow: 3,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor away from mark "a"'
    },
    afterState: {
      text: [
        'Important line to remember',
        'Other content here',
        'More lines of text',
        'Currently here, want exact mark position'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Jumped to exact mark "a" position'
    },
    explanation: 'Jumps to the exact position of mark "a". Unlike \' which goes to line start, this preserves column position.'
  },

  // Macro Examples
  'qa': {
    command: 'qa',
    beforeState: {
      text: [
        'task: first item',
        'task: second item',
        'task: third item'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Ready to record macro for repetitive task'
    },
    afterState: {
      text: [
        'task: first item',
        'task: second item',
        'task: third item'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Recording macro "a" (indicator shows recording)'
    },
    explanation: 'Starts recording a macro into register "a". Everything you type until "q" again will be saved for replay with @a.'
  },

  'q': {
    command: 'q',
    beforeState: {
      text: [
        'TASK: first item',
        'task: second item',
        'task: third item'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Recording macro, made changes to first line'
    },
    afterState: {
      text: [
        'TASK: first item',
        'task: second item',
        'task: third item'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Macro recording stopped'
    },
    explanation: 'Stops recording the current macro. The recorded sequence is now saved and ready for playback.'
  },

  '@a': {
    command: '@a',
    beforeState: {
      text: [
        'TASK: first item',
        'task: second item',
        'task: third item'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line to apply recorded macro'
    },
    afterState: {
      text: [
        'TASK: first item',
        'TASK: second item',
        'task: third item'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Macro replayed, same changes applied'
    },
    explanation: 'Replays the macro stored in register "a". Executes the exact sequence of commands that were recorded.'
  },

  '@@': {
    command: '@@',
    beforeState: {
      text: [
        'TASK: first item',
        'TASK: second item',
        'task: third item'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line, want to repeat last macro'
    },
    afterState: {
      text: [
        'TASK: first item',
        'TASK: second item',
        'TASK: third item'
      ],
      cursorRow: 2,
      cursorCol: 6,
      mode: 'normal',
      description: 'Last macro repeated automatically'
    },
    explanation: 'Repeats the last played macro. Convenient shortcut when you need to apply the same macro multiple times.'
  },

  // Buffer Management Examples
  ':ls': {
    command: ':ls',
    beforeState: {
      text: [
        'Current buffer content',
        'Want to see other open buffers',
        'Multiple files are loaded'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Working in current buffer'
    },
    afterState: {
      text: [
        '1    "file1.txt"    line 1',
        '2 %a "file2.txt"    line 8 (current)',
        '3    "file3.txt"    line 15',
        '                            ',
        'Press ENTER to continue'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Buffer list displayed'
    },
    explanation: 'Lists all open buffers with their numbers, names, and status. %a shows current buffer, # shows alternate buffer.'
  },

  ':bn': {
    command: ':bn',
    beforeState: {
      text: [
        'Current buffer: file1.txt',
        'Content of first file',
        'Want to switch to next buffer'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'In buffer 1 (file1.txt)'
    },
    afterState: {
      text: [
        'Next buffer: file2.txt',
        'Content of second file',
        'Successfully switched buffers'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Switched to buffer 2 (file2.txt)'
    },
    explanation: 'Switches to the next buffer in the buffer list. Cycles to first buffer after the last one.'
  },

  ':bp': {
    command: ':bp',
    beforeState: {
      text: [
        'Current buffer: file2.txt',
        'Content of second file',
        'Want to go back to previous buffer'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'In buffer 2 (file2.txt)'
    },
    afterState: {
      text: [
        'Previous buffer: file1.txt',
        'Content of first file',
        'Back to previous buffer'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Switched to buffer 1 (file1.txt)'
    },
    explanation: 'Switches to the previous buffer in the buffer list. Cycles to last buffer before the first one.'
  },

  // Tab Management Examples
  ':tabnew': {
    command: ':tabnew',
    beforeState: {
      text: [
        'Current tab with file content',
        'Want to open new tab',
        'For working on different file'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Working in current tab'
    },
    afterState: {
      text: [
        'New empty buffer in new tab',
        'Ready for new file or content',
        'Tab 2 is now active'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'New tab created and active'
    },
    explanation: 'Creates a new tab with an empty buffer. The new tab becomes the active tab.'
  },

  'gt': {
    command: 'gt',
    beforeState: {
      text: [
        'Tab 1: Current active tab',
        'File content here',
        'Want to switch to next tab'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'In tab 1, want to go to tab 2'
    },
    afterState: {
      text: [
        'Tab 2: Now active tab',
        'Different file content',
        'Successfully switched tabs'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Now in tab 2'
    },
    explanation: 'Goes to the next tab. Cycles to first tab after the last one. Essential for tab navigation.'
  },

  'gT': {
    command: 'gT',
    beforeState: {
      text: [
        'Tab 2: Current active tab',
        'File content here',
        'Want to go to previous tab'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'In tab 2, want to go to tab 1'
    },
    afterState: {
      text: [
        'Tab 1: Now active tab',
        'Previous file content',
        'Back to previous tab'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Now in tab 1'
    },
    explanation: 'Goes to the previous tab. Cycles to last tab before the first one.'
  },

  // More Complex Text Objects
  'dit': {
    command: 'dit',
    beforeState: {
      text: ['<div>Delete this content inside tags</div>'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside HTML tag'
    },
    afterState: {
      text: ['<div></div>'],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Content inside tags deleted'
    },
    explanation: 'Deletes inside HTML/XML tags. Works with any tag pair, cursor can be anywhere within the tags.'
  },

  'dat': {
    command: 'dat',
    beforeState: {
      text: ['<span>Delete entire tag and content</span>'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside HTML tag'
    },
    afterState: {
      text: [''],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Entire tag and content deleted'
    },
    explanation: 'Deletes around HTML/XML tags - removes the opening tag, content, and closing tag completely.'
  },

  'cit': {
    command: 'cit',
    beforeState: {
      text: ['<h1>Old heading text here</h1>'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor inside heading tag'
    },
    afterState: {
      text: ['<h1></h1>'],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'insert',
      description: 'Content cleared, ready for new heading'
    },
    explanation: 'Changes inside HTML/XML tags - deletes content and enters insert mode. Perfect for changing tag content.'
  },

  // Advanced Search and Replace
  ':s/old/new/': {
    command: ':s/old/new/',
    beforeState: {
      text: ['Replace old word with new word in old sentence'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Line with word to replace'
    },
    afterState: {
      text: ['Replace new word with new word in old sentence'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'First occurrence replaced'
    },
    explanation: 'Substitutes first occurrence of "old" with "new" on current line. Basic find and replace command.'
  },

  ':s/old/new/g': {
    command: ':s/old/new/g',
    beforeState: {
      text: ['Replace old word with new in old sentence with old text'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Line with multiple occurrences'
    },
    afterState: {
      text: ['Replace new word with new in new sentence with new text'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'All occurrences replaced'
    },
    explanation: 'Substitutes ALL occurrences of "old" with "new" on current line. The "g" flag means global replacement.'
  },

  ':%s/old/new/g': {
    command: ':%s/old/new/g',
    beforeState: {
      text: [
        'First line with old text',
        'Second line has old word too',
        'Third line also contains old'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Multiple lines with word to replace'
    },
    afterState: {
      text: [
        'First line with new text',
        'Second line has new word too',
        'Third line also contains new'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'All occurrences in file replaced'
    },
    explanation: 'Substitutes ALL occurrences of "old" with "new" in the entire file. % means all lines, g means all matches per line.'
  },

  // Window Navigation
  'Ctrl-w h': {
    command: 'Ctrl-w h',
    beforeState: {
      text: [
        'Left window  │ Right window',
        'content here │ cursor here ',
        'move left    │ want to move'
      ],
      cursorRow: 1,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor in right window'
    },
    afterState: {
      text: [
        'Left window  │ Right window',
        'cursor here  │ content here',
        'moved here   │ came from'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor moved to left window'
    },
    explanation: 'Moves cursor to the window on the left. Essential for navigating between split windows.'
  },

  'Ctrl-w l': {
    command: 'Ctrl-w l',
    beforeState: {
      text: [
        'Left window  │ Right window',
        'cursor here  │ content here',
        'want to move │ move right'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'normal',
      description: 'Cursor in left window'
    },
    afterState: {
      text: [
        'Left window  │ Right window',
        'content here │ cursor here ',
        'came from    │ moved here'
      ],
      cursorRow: 1,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor moved to right window'
    },
    explanation: 'Moves cursor to the window on the right. Part of the Ctrl-w movement commands.'
  },

  // Jump List Navigation
  'Ctrl-o': {
    command: 'Ctrl-o',
    beforeState: {
      text: [
        'Line 1: Starting point',
        'Line 2: Middle location',
        'Line 3: Current position after jumps',
        'Line 4: End location'
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'normal',
      description: 'Current position after several jumps'
    },
    afterState: {
      text: [
        'Line 1: Starting point',
        'Line 2: Middle location (back here)',
        'Line 3: Current position after jumps',
        'Line 4: End location'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Jumped back to previous location'
    },
    explanation: 'Jumps to previous location in jump list. Goes backward through your navigation history.'
  },

  'Ctrl-i': {
    command: 'Ctrl-i',
    beforeState: {
      text: [
        'Line 1: Starting point',
        'Line 2: Previous location (currently here)',
        'Line 3: Forward location',
        'Line 4: End location'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'After jumping back with Ctrl-o'
    },
    afterState: {
      text: [
        'Line 1: Starting point',
        'Line 2: Previous location',
        'Line 3: Forward location (jumped here)',
        'Line 4: End location'
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'normal',
      description: 'Jumped forward in jump list'
    },
    explanation: 'Jumps to next location in jump list. Goes forward through your navigation history.'
  },

  // More File Operations
  ':e filename': {
    command: ':e filename',
    beforeState: {
      text: [
        'Current file content',
        'Want to edit different file',
        'Use :e to open new file'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Currently editing one file'
    },
    afterState: {
      text: [
        'New file content loaded',
        'Different file is now open',
        'Successfully switched files'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'New file loaded and active'
    },
    explanation: 'Edits (opens) a new file. Replaces current buffer content with the specified file.'
  },

  ':w filename': {
    command: ':w filename',
    beforeState: {
      text: [
        'Content to save to new file',
        'Different from current filename',
        'Save as new name'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'Content ready to save with new name'
    },
    afterState: {
      text: [
        'Content to save to new file',
        'Different from current filename',
        'Save as new name'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'normal',
      description: 'File saved with new filename'
    },
    explanation: 'Writes the current buffer to a new filename. Like "Save As" - saves content with different name.'
  },

  // Spell Checking Examples
  ':set spell': {
    command: ':set spell',
    beforeState: {
      text: [
        'This sentance has mispelled words',
        'Spellcheck is currentely disabled',
        'Enable it to see erors highlighted'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Text with spelling errors, spell check off'
    },
    afterState: {
      text: [
        'This sentance has mispelled words',
        '     ^^^^^^^^     ^^^^^^^^^      ',
        'Spellcheck is currentely disabled',
        '              ^^^^^^^^^^         ',
        'Enable it to see erors highlighted',
        '                 ^^^^^^           '
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Spell check enabled, errors highlighted'
    },
    explanation: 'Enables spell checking. Misspelled words are highlighted, making errors easy to spot and correct.'
  },

  ']s': {
    command: ']s',
    beforeState: {
      text: [
        'This sentance has mispelled words',
        'Navigate to next speling error',
        'Use ]s to jump forward'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at start, spell check enabled'
    },
    afterState: {
      text: [
        'This sentance has mispelled words',
        'Navigate to next speling error',
        'Use ]s to jump forward'
      ],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor jumped to "sentance" (misspelled)'
    },
    explanation: 'Jumps to the next misspelled word. Essential for quickly navigating through spelling errors.'
  },

  '[s': {
    command: '[s',
    beforeState: {
      text: [
        'This sentance has mispelled words',
        'Navigate to previous speling error',
        'Use [s to jump backward'
      ],
      cursorRow: 1,
      cursorCol: 18,
      mode: 'normal',
      description: 'Cursor on "speling" error'
    },
    afterState: {
      text: [
        'This sentance has mispelled words',
        'Navigate to previous speling error',
        'Use [s to jump backward'
      ],
      cursorRow: 0,
      cursorCol: 18,
      mode: 'normal',
      description: 'Cursor jumped back to "mispelled"'
    },
    explanation: 'Jumps to the previous misspelled word. Useful for reviewing and correcting errors you may have missed.'
  },

  'z=': {
    command: 'z=',
    beforeState: {
      text: ['This sentance needs correction'],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor on misspelled "sentance"'
    },
    afterState: {
      text: [
        '1. sentence',
        '2. sentences', 
        '3. instance',
        '4. distance',
        'Type number and <Enter> (empty cancels): '
      ],
      cursorRow: 4,
      cursorCol: 43,
      mode: 'normal',
      description: 'Spelling suggestions displayed'
    },
    explanation: 'Shows spelling suggestions for the word under cursor. Type number and Enter to replace, or just Enter to cancel.'
  },

  'zg': {
    command: 'zg',
    beforeState: {
      text: ['The filename is config.yml'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor on "config" (marked as misspelled)'
    },
    afterState: {
      text: ['The filename is config.yml'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: '"config" added to dictionary, no longer highlighted'
    },
    explanation: 'Adds the word under cursor to the personal dictionary, so it won\'t be marked as misspelled anymore.'
  },

  'zw': {
    command: 'zw',
    beforeState: {
      text: ['This word is correct'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor on "correct" (not highlighted)'
    },
    afterState: {
      text: ['This word is correct'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: '"correct" now marked as misspelled'
    },
    explanation: 'Marks the word under cursor as incorrect, adding it to the bad words list so it will be highlighted as misspelled.'
  },

  // Completion commands
  'Ctrl-n': {
    command: 'Ctrl-n',
    beforeState: {
      text: [
        'function calculateTotal() {',
        '  let calc',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'insert',
      description: 'In insert mode, typing "calc"'
    },
    afterState: {
      text: [
        'function calculateTotal() {',
        '  let calculateTotal',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 18,
      mode: 'insert',
      description: 'Word completed to "calculateTotal"'
    },
    explanation: 'In insert mode, completes the current word by searching forward through the buffer for matching words.'
  },

  'Ctrl-p': {
    command: 'Ctrl-p',
    beforeState: {
      text: [
        'let variable = 42',
        'let var',
        'console.log(variable)'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'insert',
      description: 'In insert mode, typing "var"'
    },
    afterState: {
      text: [
        'let variable = 42',
        'let variable',
        'console.log(variable)'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'insert',
      description: 'Word completed to "variable"'
    },
    explanation: 'In insert mode, completes the current word by searching backward through the buffer for matching words.'
  },

  'Ctrl-x Ctrl-f': {
    command: 'Ctrl-x Ctrl-f',
    beforeState: {
      text: ['open file: /home/user/Doc'],
      cursorRow: 0,
      cursorCol: 22,
      mode: 'insert',
      description: 'In insert mode, partial path typed'
    },
    afterState: {
      text: [
        'Documents/',
        'Downloads/',
        'Desktop/'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'insert',  
      description: 'File/directory completion menu shown'
    },
    explanation: 'In insert mode, provides filename and directory path completion. Shows matching files/directories in a popup menu.'
  },

  // Advanced search/replace patterns
  ':%s/\\<word\\>/new/g': {
    command: ':%s/\\<word\\>/new/g',
    beforeState: {
      text: [
        'The word is in this line',
        'But sword and password contain word too',
        'Only exact word matches should change'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File with "word" as part of other words'
    },
    afterState: {
      text: [
        'The new is in this line',
        'But sword and password contain new too',
        'Only exact new matches should change'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Only whole word matches replaced'
    },
    explanation: 'Replaces whole word matches only using word boundaries (\\< and \\>). Prevents partial matches like "sword" from being changed.'
  },

  ':%s/^old/new/g': {
    command: ':%s/^old/new/g',
    beforeState: {
      text: [
        'old line starts here',
        'this old is in middle',
        'old beginning of line'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Lines with "old" in different positions'
    },
    afterState: {
      text: [
        'new line starts here',
        'this old is in middle',
        'new beginning of line'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Only "old" at line beginnings replaced'
    },
    explanation: 'Replaces "old" only when it appears at the beginning of lines. The ^ symbol matches the start of a line.'
  },

  ':%s/old$/new/g': {
    command: ':%s/old$/new/g',
    beforeState: {
      text: [
        'line ends with old',
        'old at start of line',
        'middle old here but not end old'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Lines with "old" in different positions'
    },
    afterState: {
      text: [
        'line ends with new',
        'old at start of line',
        'middle old here but not end new'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Only "old" at line endings replaced'
    },
    explanation: 'Replaces "old" only when it appears at the end of lines. The $ symbol matches the end of a line.'
  },

  ':%s/\\s\\+$//g': {
    command: ':%s/\\s\\+$//g',
    beforeState: {
      text: [
        'line with spaces   ',
        'clean line',
        'tabs and spaces\t  '
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Lines with trailing whitespace'
    },
    afterState: {
      text: [
        'line with spaces',
        'clean line',
        'tabs and spaces'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Trailing whitespace removed'
    },
    explanation: 'Removes all trailing whitespace from lines. \\s\\+ matches one or more whitespace characters, $ anchors to end of line.'
  },

  // Command mode operations
  ':pwd': {
    command: ':pwd',
    beforeState: {
      text: ['editing file in /home/user/projects'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'In normal mode'
    },
    afterState: {
      text: [
        'editing file in /home/user/projects',
        '',
        '/home/user/projects'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Current directory displayed'
    },
    explanation: 'Prints the current working directory. Useful for knowing where you are in the filesystem.'
  },

  ':!ls': {
    command: ':!ls',
    beforeState: {
      text: ['vim session with file open'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Editing a file'
    },
    afterState: {
      text: [
        'vim session with file open',
        '',
        'file1.txt  file2.py  directory/',
        'Press ENTER or type command to continue'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Shell command output shown'
    },
    explanation: 'Executes shell commands from within vim. The output is displayed, and you can return to vim by pressing Enter.'
  },

  // Help system commands
  'K': {
    command: 'K',
    beforeState: {
      text: ['printf("Hello world");'],
      cursorRow: 0,
      cursorCol: 2,
      mode: 'normal',
      description: 'Cursor on "printf" function'
    },
    afterState: {
      text: [
        'PRINTF(3)                 Linux Programmer\'s Manual',
        '',
        'NAME',
        '       printf - formatted output conversion',
        '',
        'SYNOPSIS',
        '       #include <stdio.h>'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Man page for printf opened'
    },
    explanation: 'Looks up the word under cursor in the system manual pages. Extremely useful for getting documentation on functions and commands.'
  },

  'Ctrl-]': {
    command: 'Ctrl-]',
    beforeState: {
      text: [
        'See :help motion.txt for more info',
        'The motion commands help you navigate'
      ],
      cursorRow: 0,
      cursorCol: 14,
      mode: 'normal',
      description: 'Cursor on "motion.txt" help link'
    },
    afterState: {
      text: [
        '*motion.txt*	Motion commands',
        '',
        'CURSOR MOTIONS',
        '',
        'h		left',
        'j		down'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Jumped to motion.txt help page'
    },
    explanation: 'In help files, follows the help tag under the cursor to jump to the corresponding documentation section.'
  },

  // Diff mode commands
  ']c': {
    command: ']c',
    beforeState: {
      text: [
        'line 1 same',
        'line 2 different left',
        'line 3 same',
        'line 4 different left'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'In diff mode, cursor at top'
    },
    afterState: {
      text: [
        'line 1 same',
        'line 2 different left',
        'line 3 same',
        'line 4 different left'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Jumped to next difference (line 2)'
    },
    explanation: 'In diff mode, jumps to the next difference between files. Essential for reviewing changes efficiently.'
  },

  '[c': {
    command: '[c',
    beforeState: {
      text: [
        'line 1 same',
        'line 2 different left',
        'line 3 same',
        'line 4 different left'
      ],
      cursorRow: 3,
      cursorCol: 0,
      mode: 'normal',
      description: 'In diff mode, cursor on line 4'
    },
    afterState: {
      text: [
        'line 1 same',
        'line 2 different left',
        'line 3 same',
        'line 4 different left'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Jumped to previous difference (line 2)'
    },
    explanation: 'In diff mode, jumps to the previous difference between files. Useful for navigating backwards through changes.'
  },

  // More advanced text objects
  'it': {
    command: 'it',
    beforeState: {
      text: ['<div>Hello <span>world</span></div>'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside span tag content'
    },
    afterState: {
      text: ['<div>Hello <span></span></div>'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Inner tag content "world" deleted'
    },
    explanation: 'Text object for inner HTML/XML tag. "dit" deletes content between tags, "cit" changes it, "yit" copies it.'
  },

  'at': {
    command: 'at',
    beforeState: {
      text: ['<div>Hello <span>world</span> there</div>'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside span tag'
    },
    afterState: {
      text: ['<div>Hello  there</div>'],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'normal',
      description: 'Entire span tag deleted'
    },
    explanation: 'Text object for entire HTML/XML tag. "dat" deletes the whole tag including content, "cat" changes it, "yat" copies it.'
  },

  // More register operations
  '"+y': {
    command: '"+y',
    beforeState: {
      text: ['Copy this text to system clipboard'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'visual',
      description: 'Text selected in visual mode'
    },
    afterState: {
      text: ['Copy this text to system clipboard'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text copied to system clipboard'
    },
    explanation: 'Copies selected text to system clipboard. You can then paste it in other applications with Ctrl+V.'
  },

  '"+p': {
    command: '"+p',
    beforeState: {
      text: ['Paste here: '],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'System clipboard contains "external text"'
    },
    afterState: {
      text: ['Paste here: external text'],
      cursorRow: 0,
      cursorCol: 24,
      mode: 'normal',
      description: 'System clipboard content pasted'
    },
    explanation: 'Pastes from system clipboard. Allows you to paste text copied from other applications (Ctrl+C) into vim.'
  },

  '"ay': {
    command: '"ay',
    beforeState: {
      text: ['Store this in register a'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'visual',
      description: 'Text selected for copying'
    },
    afterState: {
      text: ['Store this in register a'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text stored in register "a"'
    },
    explanation: 'Copies selected text to named register "a". Useful for storing multiple different pieces of text for later use.'
  },

  '"ap': {
    command: '"ap',
    beforeState: {
      text: ['Paste from register a: '],
      cursorRow: 0,
      cursorCol: 23,
      mode: 'normal',
      description: 'Register "a" contains stored text'
    },
    afterState: {
      text: ['Paste from register a: stored text'],
      cursorRow: 0,
      cursorCol: 33,
      mode: 'normal',
      description: 'Text from register "a" pasted'
    },
    explanation: 'Pastes text from named register "a". You can store different text in registers a-z and retrieve them later.'
  },

  ':reg': {
    command: ':reg',
    beforeState: {
      text: ['viewing register contents'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Normal editing mode'
    },
    afterState: {
      text: [
        '--- Registers ---',
        '"" hello world',
        '"0 copied text',
        '"a stored text',
        '": last command',
        'Press ENTER to continue'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All register contents displayed'
    },
    explanation: 'Shows contents of all registers. Useful for seeing what text is stored in different registers before pasting.'
  },

  // Window operations (duplicates removed)

  'Ctrl-w w': {
    command: 'Ctrl-w w',
    beforeState: {
      text: [
        '--- Window 1 (active) ---',
        'Current window',
        '--- Window 2 ---',
        'Other window'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor in first window'
    },
    afterState: {
      text: [
        '--- Window 1 ---',
        'Current window',
        '--- Window 2 (active) ---',
        'Other window'
      ],
      cursorRow: 3,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor moved to second window'
    },
    explanation: 'Cycles between open windows. Essential for navigating between multiple split windows in vim.'
  },

  'Ctrl-w c': {
    command: 'Ctrl-w c',
    beforeState: {
      text: [
        '--- Window 1 (active) ---',
        'This window will close',
        '--- Window 2 ---',
        'This window stays'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Multiple windows open'
    },
    afterState: {
      text: [
        '--- Single Window ---',
        'This window stays'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Current window closed'
    },
    explanation: 'Closes the current window. If it\'s the last window showing a modified file, vim will warn you to save first.'
  },

  // Numbers and counts operations
  '5j': {
    command: '5j',
    beforeState: {
      text: [
        'Line 1',
        'Line 2', 
        'Line 3',
        'Line 4',
        'Line 5',
        'Line 6',
        'Line 7'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line 1'
    },
    afterState: {
      text: [
        'Line 1',
        'Line 2', 
        'Line 3',
        'Line 4',
        'Line 5',
        'Line 6',
        'Line 7'
      ],
      cursorRow: 5,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor jumped 5 lines down to line 6'
    },
    explanation: 'Moves cursor down 5 lines. You can prefix most movement commands with numbers to repeat them.'
  },

  '3w': {
    command: '3w',
    beforeState: {
      text: ['The quick brown fox jumps over lazy dog'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on "The"'
    },
    afterState: {
      text: ['The quick brown fox jumps over lazy dog'],
      cursorRow: 0,
      cursorCol: 16,
      mode: 'normal',
      description: 'Cursor moved 3 words forward to "fox"'
    },
    explanation: 'Moves forward 3 words. Much faster than pressing w three times.'
  },

  '2dd': {
    command: '2dd',
    beforeState: {
      text: [
        'Line to delete 1',
        'Line to delete 2',
        'Line to keep',
        'Another line to keep'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on first line'
    },
    afterState: {
      text: [
        'Line to keep',
        'Another line to keep'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Two lines deleted'
    },
    explanation: 'Deletes 2 lines starting from the current line. Very efficient for deleting multiple consecutive lines.'
  },

  '4yy': {
    command: '4yy',
    beforeState: {
      text: [
        'Copy line 1',
        'Copy line 2',
        'Copy line 3', 
        'Copy line 4',
        'Keep this line'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on first line'
    },
    afterState: {
      text: [
        'Copy line 1',
        'Copy line 2',
        'Copy line 3', 
        'Copy line 4',
        'Keep this line'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: '4 lines copied to register'
    },
    explanation: 'Copies 4 lines starting from current line. You can then paste them elsewhere with p or P.'
  },

  '10G': {
    command: '10G',
    beforeState: {
      text: Array.from({length: 15}, (_, i) => `Line ${i + 1}`),
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line 1 of 15-line file'
    },
    afterState: {
      text: Array.from({length: 15}, (_, i) => `Line ${i + 1}`),
      cursorRow: 9,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor jumped to line 10'
    },
    explanation: 'Jumps directly to line 10. Much faster than navigating line by line in large files.'
  },

  // More folding operations
  'za': {
    command: 'za',
    beforeState: {
      text: [
        'function example() {',
        '+-- 10 lines: code block ----',
        'other code here'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on closed fold'
    },
    afterState: {
      text: [
        'function example() {',
        '  let x = 1;',
        '  let y = 2;',
        '  return x + y;',
        '}',
        'other code here'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Fold opened, content visible'
    },
    explanation: 'Toggles fold under cursor - opens if closed, closes if open. Essential for navigating folded code.'
  },

  'zM': {
    command: 'zM',
    beforeState: {
      text: [
        'function one() {',
        '  let x = 1;',
        '  return x;',
        '}',
        'function two() {',
        '  let y = 2;',
        '  return y;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All folds open, code expanded'
    },
    afterState: {
      text: [
        '+-- 4 lines: function one() {',
        '+-- 4 lines: function two() {'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All folds closed, compact view'
    },
    explanation: 'Closes all folds in the file. Great for getting an overview of file structure without details.'
  },

  'zR': {
    command: 'zR',
    beforeState: {
      text: [
        '+-- 4 lines: function one() {',
        '+-- 4 lines: function two() {'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All folds closed'
    },
    afterState: {
      text: [
        'function one() {',
        '  let x = 1;',
        '  return x;',
        '}',
        'function two() {',
        '  let y = 2;',
        '  return y;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All folds opened, full detail'
    },
    explanation: 'Opens all folds in the file. Opposite of zM - shows all content in full detail.'
  },

  // File operations (duplicate :w filename removed)

  ':e!': {
    command: ':e!',
    beforeState: {
      text: [
        'Original file content',
        'Modified line (unsaved)',
        'Another modification'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File has unsaved modifications'
    },
    afterState: {
      text: [
        'Original file content',
        'Original line (restored)',
        'Original content'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File reloaded, changes discarded'
    },
    explanation: 'Reloads file from disk, discarding all unsaved changes. Useful for undoing all modifications since last save.'
  },

  'Ctrl-^': {
    command: 'Ctrl-^',
    beforeState: {
      text: [
        '--- Current file: main.py ---',
        'def main():',
        '    print("Hello")'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Editing main.py'
    },
    afterState: {
      text: [
        '--- Alternate file: config.txt ---',
        'setting1=value1',
        'setting2=value2'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Switched to alternate buffer'
    },
    explanation: 'Switches to the alternate buffer (previously edited file). Quick way to toggle between two files.'
  },

  // Visual mode operations (o is duplicate - using different key)

  '=': {
    command: '=',
    beforeState: {
      text: [
        'if (condition) {',
        'console.log("test");',
        'return true;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'visual',
      description: 'Code selected with poor indentation'
    },
    afterState: {
      text: [
        'if (condition) {',
        '    console.log("test");',
        '    return true;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Code auto-indented properly'
    },
    explanation: 'Auto-indents selected code according to vim\'s indentation rules. Essential for cleaning up code formatting.'
  },

  // Case conversion operations (duplicates removed)

  // More search operations
  'f{char}': {
    command: 'fa',
    beforeState: {
      text: ['Move to letter a in this line'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at start of line'
    },
    afterState: {
      text: ['Move to letter a in this line'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Cursor on letter "a"'
    },
    explanation: 'Finds and moves to the next occurrence of character "a" on the current line. Use ; to repeat.'
  },

  'F{char}': {
    command: 'Fa',
    beforeState: {
      text: ['Find backward to letter a here'],
      cursorRow: 0,
      cursorCol: 28,
      mode: 'normal',
      description: 'Cursor at end of line'
    },
    afterState: {
      text: ['Find backward to letter a here'],
      cursorRow: 0,
      cursorCol: 22,
      mode: 'normal',
      description: 'Cursor on letter "a"'
    },
    explanation: 'Finds and moves backward to the previous occurrence of character "a" on the current line.'
  },

  ';': {
    command: ';',
    beforeState: {
      text: ['Find all a letters in this line'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'After using fa, cursor on first "a"'
    },
    afterState: {
      text: ['Find all a letters in this line'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor moved to next "a"'
    },
    explanation: 'Repeats the last f/F/t/T command in the same direction. Essential for efficiently navigating to characters.'
  },

  ',': {
    command: ',',
    beforeState: {
      text: ['Find all a letters in this line'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'After fa;, cursor on second "a"'
    },
    afterState: {
      text: ['Find all a letters in this line'],
      cursorRow: 0,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor moved back to previous "a"'
    },
    explanation: 'Repeats the last f/F/t/T command in the opposite direction. Useful for backtracking.'
  },

  // More buffer operations
  ':b#': {
    command: ':b#',
    beforeState: {
      text: [
        '--- Buffer 3: current.txt ---',
        'Currently editing this file'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'In buffer 3'
    },
    afterState: {
      text: [
        '--- Buffer 1: previous.txt ---',
        'Previously edited file'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Switched to alternate buffer'
    },
    explanation: 'Switches to the alternate buffer (last buffer you were editing). Quick way to toggle between files.'
  },

  ':bd': {
    command: ':bd',
    beforeState: {
      text: [
        '--- 3 buffers open ---',
        'Buffer 1: file1.txt',
        'Buffer 2: file2.txt [current]',
        'Buffer 3: file3.txt'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Multiple buffers loaded'
    },
    afterState: {
      text: [
        '--- 2 buffers open ---',
        'Buffer 1: file1.txt [current]',
        'Buffer 3: file3.txt'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Current buffer deleted, switched to buffer 1'
    },
    explanation: 'Deletes (closes) the current buffer. If it has unsaved changes, vim will warn you first.'
  },

  // More tab operations  
  ':tabclose': {
    command: ':tabclose',
    beforeState: {
      text: [
        '--- Tab 1 --- Tab 2* --- Tab 3 ---',
        'Content in tab 2 (current)'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: '3 tabs open, currently in tab 2'
    },
    afterState: {
      text: [
        '--- Tab 1* --- Tab 3 ---',
        'Content in tab 1 (now current)'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Tab 2 closed, moved to tab 1'
    },
    explanation: 'Closes the current tab. If it\'s the only window showing a modified buffer, vim will warn you.'
  },

  '3gt': {
    command: '3gt',
    beforeState: {
      text: [
        '--- Tab 1* --- Tab 2 --- Tab 3 ---',
        'Currently in tab 1'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'In tab 1 of 3'
    },
    afterState: {
      text: [
        '--- Tab 1 --- Tab 2 --- Tab 3* ---',
        'Now in tab 3'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Jumped directly to tab 3'
    },
    explanation: 'Jumps directly to tab number 3. Much faster than cycling through tabs with gt.'
  },

  // More indentation operations
  '5>>': {
    command: '5>>',
    beforeState: {
      text: [
        'line 1',
        'line 2',
        'line 3',
        'line 4',
        'line 5',
        'line 6'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line 1'
    },
    afterState: {
      text: [
        '    line 1',
        '    line 2',
        '    line 3',
        '    line 4',
        '    line 5',
        'line 6'
      ],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'First 5 lines indented'
    },
    explanation: 'Indents 5 lines starting from current line. Efficient for indenting multiple lines at once.'
  },

  'gg=G': {
    command: 'gg=G',
    beforeState: {
      text: [
        'function example() {',
        'let x = 1;',
        'if (x > 0) {',
        'console.log("positive");',
        '}',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'File with inconsistent indentation'
    },
    afterState: {
      text: [
        'function example() {',
        '    let x = 1;',
        '    if (x > 0) {',
        '        console.log("positive");',
        '    }',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Entire file auto-indented'
    },
    explanation: 'Auto-indents the entire file. Combines gg (go to top) with =G (indent to bottom). Essential for cleaning up code.'
  },

  // More advanced movement commands
  'gf': {
    command: 'gf',
    beforeState: {
      text: ['Read the file: config.txt for settings'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor on filename "config.txt"'
    },
    afterState: {
      text: [
        '--- config.txt ---',
        'setting1=value1',
        'setting2=value2',
        'setting3=value3'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Opened config.txt file'
    },
    explanation: 'Opens the file whose name is under the cursor. Extremely useful for navigating between files in documentation or code.'
  },

  'gi': {
    command: 'gi',
    beforeState: {
      text: [
        'Last insert was here: hello',
        'Cursor moved elsewhere',
        'Current cursor position'
      ],
      cursorRow: 2,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor at different location'
    },
    afterState: {
      text: [
        'Last insert was here: hello',
        'Cursor moved elsewhere',
        'Current cursor position'
      ],
      cursorRow: 0,
      cursorCol: 27,
      mode: 'insert',
      description: 'Jumped to last insert position, in insert mode'
    },
    explanation: 'Goes to the last position where text was inserted and enters insert mode. Perfect for continuing where you left off editing.'
  },

  'g;': {
    command: 'g;',
    beforeState: {
      text: [
        'First change made here',
        'Second change made here', 
        'Third change made here'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'At newest change location'
    },
    afterState: {
      text: [
        'First change made here',
        'Second change made here', 
        'Third change made here'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Moved to previous change location'
    },
    explanation: 'Goes to the older position in the change list. Useful for navigating through your editing history.'
  },

  'g,': {
    command: 'g,',
    beforeState: {
      text: [
        'First change made here',
        'Second change made here', 
        'Third change made here'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'At older change location'
    },
    afterState: {
      text: [
        'First change made here',
        'Second change made here', 
        'Third change made here'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Moved to newer change location'
    },
    explanation: 'Goes to the newer position in the change list. Opposite of g; - moves forward through editing history.'
  },

  // More text substitution operations
  '&': {
    command: '&',
    beforeState: {
      text: [
        'Replace old with new text',
        'Another old word here',
        'More old content'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'After running :s/old/new/ on line 1'
    },
    afterState: {
      text: [
        'Replace new with new text',
        'Another new word here',
        'More old content'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Same substitution applied to current line'
    },
    explanation: 'Repeats the last substitute command on the current line. Much faster than retyping the entire substitution.'
  },

  ':nohl': {
    command: ':nohl',
    beforeState: {
      text: [
        'Search highlights every match',
        'All matches are highlighted',
        'Highlights everywhere'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Search highlighting enabled, matches visible'
    },
    afterState: {
      text: [
        'Search highlights every match',
        'All matches are highlighted', 
        'Highlights everywhere'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Search highlighting cleared'
    },
    explanation: 'Clears search highlighting without affecting the search pattern. Essential for removing visual clutter after searching.'
  },

  // More advanced visual mode operations
  'Ctrl-v': {
    command: 'Ctrl-v',
    beforeState: {
      text: [
        'Column 1  Column 2  Column 3',
        'Data A    Data B    Data C',
        'Row 1     Row 2     Row 3'
      ],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor positioned for column selection'
    },
    afterState: {
      text: [
        'Column 1  Column 2  Column 3',
        'Data A    Data B    Data C',
        'Row 1     Row 2     Row 3'
      ],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'visual',
      description: 'In visual block mode, ready to select columns'
    },
    explanation: 'Enters visual block mode for rectangular selections. Perfect for editing columnar data or multiple lines simultaneously.'
  },

  'U': {
    command: 'U',
    beforeState: {
      text: ['make this text UPPERCASE'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'visual',
      description: 'Text selected in visual mode'
    },
    afterState: {
      text: ['MAKE THIS TEXT UPPERCASE'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Selected text converted to uppercase'
    },
    explanation: 'In visual mode, converts selected text to uppercase. Much more efficient than manual case changes.'
  },

  // Insert mode operations
  'Ctrl-t': {
    command: 'Ctrl-t',
    beforeState: {
      text: [
        'function example() {',
        'code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'insert',
      description: 'In insert mode at start of line'
    },
    afterState: {
      text: [
        'function example() {',
        '    code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'insert',
      description: 'Line indented, still in insert mode'
    },
    explanation: 'In insert mode, indents the current line. Very useful for adjusting indentation while typing.'
  },

  // Ctrl-d duplicate removed (insert mode unindent)

  // Page scrolling operations
  'Ctrl-b': {
    command: 'Ctrl-b',
    beforeState: {
      text: Array.from({length: 50}, (_, i) => `Line ${i + 1}`),
      cursorRow: 30,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line 31 of 50-line file'
    },
    afterState: {
      text: Array.from({length: 50}, (_, i) => `Line ${i + 1}`),
      cursorRow: 5,
      cursorCol: 0,
      mode: 'normal',
      description: 'Scrolled up full page, cursor on line 6'
    },
    explanation: 'Scrolls up one full page (screen height). Much faster than using k repeatedly for long files.'
  },

  'Ctrl-f': {
    command: 'Ctrl-f',
    beforeState: {
      text: Array.from({length: 50}, (_, i) => `Line ${i + 1}`),
      cursorRow: 5,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on line 6 of 50-line file'
    },
    afterState: {
      text: Array.from({length: 50}, (_, i) => `Line ${i + 1}`),
      cursorRow: 30,
      cursorCol: 0,
      mode: 'normal',
      description: 'Scrolled down full page, cursor on line 31'
    },
    explanation: 'Scrolls down one full page (screen height). Essential for quickly navigating through long files.'
  },

  // More file operations with time
  ':earlier 15m': {
    command: ':earlier 15m',
    beforeState: {
      text: [
        'Current state of file',
        'Recent changes made',
        'Latest modifications'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File in current state'
    },
    afterState: {
      text: [
        'File state 15 minutes ago',
        'Old content restored',
        'Previous version'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File reverted to state 15 minutes ago'
    },
    explanation: 'Reverts file to its state 15 minutes ago. Powerful time-based undo that goes beyond simple command history.'
  },

  ':later 15m': {
    command: ':later 15m',
    beforeState: {
      text: [
        'File state 15 minutes ago',
        'Old content restored',
        'Previous version'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File reverted to earlier state'
    },
    afterState: {
      text: [
        'Current state of file',
        'Recent changes made',
        'Latest modifications'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File advanced to later state'
    },
    explanation: 'Advances file to its state 15 minutes later. Opposite of :earlier, moves forward through time-based history.'
  },

  // More marks and navigation
  '`.': {
    command: '`.',
    beforeState: {
      text: [
        'First line',
        'Last change was made on this line',
        'Third line'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor elsewhere in file'
    },
    afterState: {
      text: [
        'First line',
        'Last change was made on this line',
        'Third line'
      ],
      cursorRow: 1,
      cursorCol: 25,
      mode: 'normal',
      description: 'Jumped to exact position of last change'
    },
    explanation: 'Jumps to the exact position where the last change was made. More precise than \'\' which goes to line start.'
  },

  ':marks': {
    command: ':marks',
    beforeState: {
      text: ['Viewing current file with marks set'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Normal editing mode'
    },
    afterState: {
      text: [
        '--- Marks ---',
        'mark line  col file/text',
        ' a      5    0 important line',
        ' b     10   15 function definition',
        ' \'.     1    0 last change',
        'Press ENTER to continue'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All marks displayed with positions'
    },
    explanation: 'Shows all marks with their line numbers and positions. Essential for understanding your navigation bookmarks.'
  },

  ':jumps': {
    command: ':jumps',
    beforeState: {
      text: ['Viewing jump history'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Normal editing mode'
    },
    afterState: {
      text: [
        '--- Jump List ---',
        ' jump line  col file/text',
        '   3    15    0 function start',
        '   2    25    5 variable declaration',
        '   1    45   10 return statement',
        '>  0    55    0 current position'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Jump history displayed'
    },
    explanation: 'Shows the jump list with recent cursor positions. Useful for understanding where Ctrl-o and Ctrl-i will take you.'
  },

  // Macro operations with multiple executions  
  '5@a': {
    command: '5@a',
    beforeState: {
      text: [
        'Line 1 to process',
        'Line 2 to process',
        'Line 3 to process',
        'Line 4 to process',
        'Line 5 to process'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Macro "a" recorded, ready to execute'
    },
    afterState: {
      text: [
        'Line 1 processed',
        'Line 2 processed',
        'Line 3 processed',
        'Line 4 processed',
        'Line 5 processed'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Macro executed 5 times'
    },
    explanation: 'Executes macro "a" five times. Extremely powerful for repetitive editing tasks across multiple lines.'
  },

  // More advanced repeat operations
  '3.': {
    command: '3.',
    beforeState: {
      text: [
        'Original text here',
        'More text here',
        'Additional text'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'After making a change, cursor on second line'
    },
    afterState: {
      text: [
        'Original text here',
        'More text here (change repeated 3 times)',
        'Additional text'
      ],
      cursorRow: 1,
      cursorCol: 30,
      mode: 'normal',
      description: 'Last change repeated 3 times'
    },
    explanation: 'Repeats the last change 3 times. Multiplies the power of the dot command for repeated operations.'
  },

  // More text insertion modes
  'ZZ': {
    command: 'ZZ',
    beforeState: {
      text: [
        'File with unsaved changes',
        'Need to save and exit quickly'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File has modifications'
    },
    afterState: {
      text: [
        '"filename" 2L, 45C written',
        '[Vim session ended]'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File saved and vim exited'
    },
    explanation: 'Saves file and quits vim in one command. Much faster than :wq when you want to save and exit quickly.'
  },

  'ZQ': {
    command: 'ZQ',
    beforeState: {
      text: [
        'File with unsaved changes',
        'Want to quit without saving'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File has modifications'
    },
    afterState: {
      text: [
        '[Vim session ended]',
        '[Changes discarded]'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Vim exited without saving'
    },
    explanation: 'Quits vim without saving changes. Equivalent to :q! but faster to type.'
  },

  // More advanced editing operations
  't{char}': {
    command: 'ta',
    beforeState: {
      text: ['Move to before the letter a'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at start of line'
    },
    afterState: {
      text: ['Move to before the letter a'],
      cursorRow: 0,
      cursorCol: 22,
      mode: 'normal',
      description: 'Cursor positioned before "a"'
    },
    explanation: 'Moves cursor to just before the next occurrence of character "a" on the line. Use ; to repeat.'
  },

  'T{char}': {
    command: 'Ta',
    beforeState: {
      text: ['Move backward before the letter a'],
      cursorRow: 0,
      cursorCol: 30,
      mode: 'normal',
      description: 'Cursor at end of line'
    },
    afterState: {
      text: ['Move backward before the letter a'],
      cursorRow: 0,
      cursorCol: 26,
      mode: 'normal',
      description: 'Cursor positioned before "a"'
    },
    explanation: 'Moves cursor backward to just before the previous occurrence of character "a" on the line.'
  },

  // More percentage operations
  '50%': {
    command: '50%',
    beforeState: {
      text: Array.from({length: 20}, (_, i) => `Line ${i + 1}`),
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at start of 20-line file'
    },
    afterState: {
      text: Array.from({length: 20}, (_, i) => `Line ${i + 1}`),
      cursorRow: 9,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at 50% of file (line 10)'
    },
    explanation: 'Jumps to 50% of the file. Useful for quickly navigating to approximate positions in large files.'
  },

  // More complex text objects  
  'i`': {
    command: 'i`',
    beforeState: {
      text: ['Code with `backtick content` here'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside backticks'
    },
    afterState: {
      text: ['Code with `` here'],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'normal',
      description: 'Backtick content deleted'
    },
    explanation: 'Text object for inner backticks. "di`" deletes content inside backticks, "ci`" changes it, "yi`" copies it.'
  },

  'a`': {
    command: 'a`',
    beforeState: {
      text: ['Code with `backtick content` here'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside backticks'
    },
    afterState: {
      text: ['Code with  here'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Backticks and content deleted'
    },
    explanation: 'Text object around backticks. "da`" deletes backticks and content, "ca`" changes everything, "ya`" copies all.'
  },

  'is': {
    command: 'is',
    beforeState: {
      text: [
        'First sentence here. Second sentence follows. Third one too.'
      ],
      cursorRow: 0,
      cursorCol: 25,
      mode: 'normal',
      description: 'Cursor in second sentence'
    },
    afterState: {
      text: [
        'First sentence here.  Third one too.'
      ],
      cursorRow: 0,
      cursorCol: 21,
      mode: 'normal',
      description: 'Second sentence deleted'
    },
    explanation: 'Text object for inner sentence. "dis" deletes current sentence, "cis" changes it, "yis" copies it.'
  },

  'as': {
    command: 'as',
    beforeState: {
      text: [
        'First sentence here. Second sentence follows. Third one too.'
      ],
      cursorRow: 0,
      cursorCol: 25,
      mode: 'normal',
      description: 'Cursor in second sentence'
    },
    afterState: {
      text: [
        'First sentence here.Third one too.'
      ],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Second sentence and space deleted'
    },
    explanation: 'Text object around sentence. "das" deletes sentence and following space, includes punctuation and whitespace.'
  },

  'ip': {
    command: 'ip',
    beforeState: {
      text: [
        'First paragraph line one.',
        'First paragraph line two.',
        '',
        'Second paragraph here.',
        'Second paragraph continues.'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor in first paragraph'
    },
    afterState: {
      text: [
        '',
        'Second paragraph here.',
        'Second paragraph continues.'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'First paragraph deleted, blank line remains'
    },
    explanation: 'Text object for inner paragraph. "dip" deletes current paragraph, "cip" changes it, "yip" copies it.'
  },

  'ap': {
    command: 'ap',
    beforeState: {
      text: [
        'First paragraph line one.',
        'First paragraph line two.',
        '',
        'Second paragraph here.',
        'Second paragraph continues.'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor in first paragraph'
    },
    afterState: {
      text: [
        'Second paragraph here.',
        'Second paragraph continues.'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'First paragraph and blank line deleted'
    },
    explanation: 'Text object around paragraph. "dap" deletes paragraph and surrounding whitespace, including blank lines.'
  },

  // More undo/redo operations
  '5u': {
    command: '5u',
    beforeState: {
      text: [
        'After 5 changes made',
        'Each change can be undone',
        'Multiple undo levels available'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File after making 5 changes'
    },
    afterState: {
      text: [
        'Original state restored',
        'Before any changes',
        'Clean starting point'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: '5 changes undone'
    },
    explanation: 'Undoes the last 5 changes. Each u command undoes one change level, so 5u undoes 5 separate changes.'
  },

  // More register operations  
  '"_d': {
    command: '"_d',
    beforeState: {
      text: [
        'Keep this in register',
        'Delete this without affecting registers',
        'Paste the kept content later'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text in default register to preserve'
    },
    afterState: {
      text: [
        'Keep this in register',
        'Paste the kept content later'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Line deleted without affecting registers'
    },
    explanation: 'Deletes to black hole register, preserving other registers. Essential when you want to delete without overwriting copied text.'
  },

  '"0p': {
    command: '"0p',
    beforeState: {
      text: [
        'Original copied text',
        'This was deleted afterwards',
        'Paste original here: '
      ],
      cursorRow: 2,
      cursorCol: 21,
      mode: 'normal',
      description: 'Yank register contains original copy'
    },
    afterState: {
      text: [
        'Original copied text',
        'This was deleted afterwards',
        'Paste original here: Original copied text'
      ],
      cursorRow: 2,
      cursorCol: 39,
      mode: 'normal',
      description: 'Original copied text pasted'
    },
    explanation: 'Pastes from yank register "0", which contains the last copied (not deleted) text. Useful when deletions have overwritten default register.'
  },

  // More command mode operations
  ':set': {
    command: ':set',
    beforeState: {
      text: ['Viewing current vim settings'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Normal editing mode'
    },
    afterState: {
      text: [
        '--- Options ---',
        '  autoindent        hlsearch          number',
        '  expandtab         incsearch         ruler',
        '  filetype=text     laststatus=2      syntax',
        'Press ENTER to continue'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Current settings displayed'
    },
    explanation: 'Shows all current vim options and their values. Useful for understanding your current configuration.'
  },

  ':set number': {
    command: ':set number',
    beforeState: {
      text: [
        'Line without numbers',
        'Another line here',
        'Third line visible'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'No line numbers visible'
    },
    afterState: {
      text: [
        '1 | Line without numbers',
        '2 | Another line here',
        '3 | Third line visible'
      ],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Line numbers now displayed'
    },
    explanation: 'Enables line number display. Essential for navigation and referencing specific lines in code.'
  },

  ':set nonumber': {
    command: ':set nonumber',
    beforeState: {
      text: [
        '1 | Line with numbers',
        '2 | Another line here',
        '3 | Third line visible'
      ],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Line numbers currently displayed'
    },
    afterState: {
      text: [
        'Line with numbers',
        'Another line here',
        'Third line visible'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Line numbers hidden'
    },
    explanation: 'Disables line number display. Useful for cleaner appearance or when copying text.'
  },

  ':version': {
    command: ':version',
    beforeState: {
      text: ['Check vim version information'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Normal editing mode'
    },
    afterState: {
      text: [
        'VIM - Vi IMproved 8.2 (2019 Dec 12)',
        'Included patches: 1-3582',
        'Compiled by team@vim.org',
        '+clipboard +python3 +syntax',
        'Press ENTER to continue'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Version information displayed'
    },
    explanation: 'Shows detailed vim version information including patches and compiled features. Useful for troubleshooting and compatibility.'
  },

  // Text case operations (u duplicate removed)

  // Advanced line operations
  ':retab': {
    command: ':retab',
    beforeState: {
      text: [
        '\tMixed\t   indentation',
        '    Spaces and\ttabs combined',
        '\t\t  Inconsistent formatting'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File with mixed tabs and spaces'
    },
    afterState: {
      text: [
        '    Mixed       indentation',
        '    Spaces and  tabs combined',
        '        Inconsistent formatting'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Tabs converted to spaces'
    },
    explanation: 'Converts tabs to spaces (or vice versa) based on current settings. Essential for maintaining consistent indentation style.'
  },

  // More window operations
  'Ctrl-w =': {
    command: 'Ctrl-w =',
    beforeState: {
      text: [
        '--- Large Window ---',
        'This window takes most space',
        '--- Tiny Window ---',
        'Small'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Windows with unequal sizes'
    },
    afterState: {
      text: [
        '--- Equal Window ---',
        'This window balanced',
        '--- Equal Window ---',
        'This window balanced'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All windows sized equally'
    },
    explanation: 'Makes all windows equal size. Useful for balancing workspace after splitting or resizing windows.'
  },

  'Ctrl-w o': {
    command: 'Ctrl-w o',
    beforeState: {
      text: [
        '--- Window 1 (active) ---',
        'Keep this window open',
        '--- Window 2 ---',
        'Close this window',
        '--- Window 3 ---',
        'Close this too'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Multiple windows open'
    },
    afterState: {
      text: [
        '--- Single Window ---',
        'Keep this window open'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Only current window remains'
    },
    explanation: 'Closes all other windows except the current one. Quick way to maximize current window space.'
  },

  // Additional file operations
  ':r filename': {
    command: ':r config.txt',
    beforeState: {
      text: [
        'Current file content',
        'Insert file here:'
      ],
      cursorRow: 1,
      cursorCol: 17,
      mode: 'normal',
      description: 'Cursor where content will be inserted'
    },
    afterState: {
      text: [
        'Current file content',
        'Insert file here:',
        'setting1=value1',
        'setting2=value2',
        'setting3=value3'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'File content inserted below cursor'
    },
    explanation: 'Reads and inserts contents of config.txt below current line. Useful for incorporating external files or command output.'
  },

  ':r !command': {
    command: ':r !date',
    beforeState: {
      text: [
        'Document created on: ',
        'Content follows below'
      ],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor where date will be inserted'
    },
    afterState: {
      text: [
        'Document created on: ',
        'Mon Dec 25 14:30:45 PST 2023',
        'Content follows below'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Command output inserted'
    },
    explanation: 'Executes shell command and inserts output below cursor. Very powerful for incorporating live data or system information.'
  },

  // More folding operations
  'zv': {
    command: 'zv',
    beforeState: {
      text: [
        'function example() {',
        '+-- 5 lines: nested function ----',
        'other code here'
      ],
      cursorRow: 1,
      cursorCol: 10,
      mode: 'normal',
      description: 'Cursor inside closed fold'
    },
    afterState: {
      text: [
        'function example() {',
        '  function nested() {',
        '    return value;',
        '  }',
        '  return nested();',
        '}',
        'other code here'
      ],
      cursorRow: 1,
      cursorCol: 10,
      mode: 'normal',
      description: 'Fold opened to reveal cursor line'
    },
    explanation: 'Opens just enough folds to make the cursor line visible. Useful for revealing specific code without opening all folds.'
  },

  'zi': {
    command: 'zi',
    beforeState: {
      text: [
        'function one() {',
        '  let x = 1;',
        '  return x;',
        '}',
        'function two() {',
        '  let y = 2;',
        '  return y;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Folding enabled, folds can be created'
    },
    afterState: {
      text: [
        'function one() {',
        '  let x = 1;',
        '  return x;',
        '}',
        'function two() {',
        '  let y = 2;',
        '  return y;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Folding disabled, all folds opened'
    },
    explanation: 'Toggles folding on/off globally. When disabled, all folds are opened and no new folds can be created.'
  },

  // Missing Text Objects (Critical Priority)
  'iw': {
    command: 'iw',
    beforeState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor on "brown" word'
    },
    afterState: {
      text: ['The quick  fox jumps'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Word "brown" deleted'
    },
    explanation: 'Text object for inner word. "diw" deletes the word under cursor, "ciw" changes it, "yiw" copies it. Does not include surrounding spaces.'
  },

  'aw': {
    command: 'aw',
    beforeState: {
      text: ['The quick brown fox jumps'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor on "brown" word'
    },
    afterState: {
      text: ['The quick fox jumps'],
      cursorRow: 0,
      cursorCol: 10,
      mode: 'normal',
      description: 'Word "brown" and following space deleted'
    },
    explanation: 'Text object around word. "daw" deletes word and surrounding whitespace, "caw" changes it, "yaw" copies it. Includes spaces for clean deletion.'
  },

  'i"': {
    command: 'i"',
    beforeState: {
      text: ['console.log("Hello World");'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside double quotes'
    },
    afterState: {
      text: ['console.log("");'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Text inside quotes deleted'
    },
    explanation: 'Text object for inner double quotes. "di"" deletes content inside quotes, "ci"" changes it, "yi"" copies it. Quotes remain intact.'
  },

  'a"': {
    command: 'a"',
    beforeState: {
      text: ['console.log("Hello World");'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside double quotes'
    },
    afterState: {
      text: ['console.log();'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Quotes and content deleted'
    },
    explanation: 'Text object around double quotes. "da"" deletes quotes and content, "ca"" changes everything, "ya"" copies all including quotes.'
  },

  "i'": {
    command: "i'",
    beforeState: {
      text: ["const msg = 'Hello VIM';"],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside single quotes'
    },
    afterState: {
      text: ["const msg = '';"],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Text inside quotes deleted'
    },
    explanation: 'Text object for inner single quotes. "di\'" deletes content inside quotes, "ci\'" changes it, "yi\'" copies it. Quotes remain.'
  },

  "a'": {
    command: "a'",
    beforeState: {
      text: ["const msg = 'Hello VIM';"],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside single quotes'
    },
    afterState: {
      text: ["const msg = ;"],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Quotes and content deleted'
    },
    explanation: 'Text object around single quotes. "da\'" deletes quotes and content, "ca\'" changes everything, "ya\'" copies all including quotes.'
  },

  'i(': {
    command: 'i(',
    beforeState: {
      text: ['function call(arg1, arg2, arg3)'],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['function call()'],
      cursorRow: 0,
      cursorCol: 14,
      mode: 'normal',
      description: 'Content inside parentheses deleted'
    },
    explanation: 'Text object for inner parentheses. "di(" deletes content inside parens, "ci(" changes it, "yi(" copies it. Parentheses remain.'
  },

  'a(': {
    command: 'a(',
    beforeState: {
      text: ['function call(arg1, arg2, arg3)'],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['function call'],
      cursorRow: 0,
      cursorCol: 13,
      mode: 'normal',
      description: 'Parentheses and content deleted'
    },
    explanation: 'Text object around parentheses. "da(" deletes parens and content, "ca(" changes everything, "ya(" copies all including parentheses.'
  },

  'i[': {
    command: 'i[',
    beforeState: {
      text: ['array[index1, index2, index3]'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside square brackets'
    },
    afterState: {
      text: ['array[]'],
      cursorRow: 0,
      cursorCol: 6,
      mode: 'normal',
      description: 'Content inside brackets deleted'
    },
    explanation: 'Text object for inner square brackets. "di[" deletes content inside brackets, "ci[" changes it, "yi[" copies it. Brackets remain.'
  },

  'a[': {
    command: 'a[',
    beforeState: {
      text: ['array[index1, index2, index3]'],
      cursorRow: 0,
      cursorCol: 15,
      mode: 'normal',
      description: 'Cursor inside square brackets'
    },
    afterState: {
      text: ['array'],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Brackets and content deleted'
    },
    explanation: 'Text object around square brackets. "da[" deletes brackets and content, "ca[" changes everything, "ya[" copies all including brackets.'
  },

  'i{': {
    command: 'i{',
    beforeState: {
      text: [
        'object = {',
        '  key1: value1,',
        '  key2: value2',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor inside curly braces'
    },
    afterState: {
      text: [
        'object = {',
        '}' 
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Content inside braces deleted'
    },
    explanation: 'Text object for inner curly braces. "di{" deletes content inside braces, "ci{" changes it, "yi{" copies it. Braces remain intact.'
  },

  'a{': {
    command: 'a{',
    beforeState: {
      text: [
        'object = {',
        '  key1: value1,',
        '  key2: value2',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor inside curly braces'
    },
    afterState: {
      text: ['object = '],
      cursorRow: 0,
      cursorCol: 9,
      mode: 'normal',
      description: 'Braces and all content deleted'
    },
    explanation: 'Text object around curly braces. "da{" deletes braces and content, "ca{" changes everything, "ya{" copies all including braces.'
  },

  // Alternative notations for the same text objects
  'i)': {
    command: 'i)',
    beforeState: {
      text: ['if (condition && other_condition)'],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['if ()'],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Content inside parentheses deleted'
    },
    explanation: 'Alternative notation for i(. Text object for inner parentheses. Same functionality as i( - selects content inside parentheses.'
  },

  'a)': {
    command: 'a)',
    beforeState: {
      text: ['if (condition && other_condition)'],
      cursorRow: 0,
      cursorCol: 20,
      mode: 'normal',
      description: 'Cursor inside parentheses'
    },
    afterState: {
      text: ['if '],
      cursorRow: 0,
      cursorCol: 3,
      mode: 'normal',
      description: 'Parentheses and content deleted'
    },
    explanation: 'Alternative notation for a(. Text object around parentheses. Same functionality as a( - selects parentheses and content.'
  },

  'i]': {
    command: 'i]',
    beforeState: {
      text: ['list[item1, item2, item3]'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor inside square brackets'
    },
    afterState: {
      text: ['list[]'],
      cursorRow: 0,
      cursorCol: 5,
      mode: 'normal',
      description: 'Content inside brackets deleted'
    },
    explanation: 'Alternative notation for i[. Text object for inner square brackets. Same functionality as i[ - selects content inside brackets.'
  },

  'a]': {
    command: 'a]',
    beforeState: {
      text: ['list[item1, item2, item3]'],
      cursorRow: 0,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor inside square brackets'
    },
    afterState: {
      text: ['list'],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Brackets and content deleted'
    },
    explanation: 'Alternative notation for a[. Text object around square brackets. Same functionality as a[ - selects brackets and content.'
  },

  'i}': {
    command: 'i}',
    beforeState: {
      text: [
        'function() {',
        '  return true;',
        '  // some comment',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor inside curly braces'
    },
    afterState: {
      text: [
        'function() {',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Content inside braces deleted'
    },
    explanation: 'Alternative notation for i{. Text object for inner curly braces. Same functionality as i{ - selects content inside braces.'
  },

  'a}': {
    command: 'a}',
    beforeState: {
      text: [
        'function() {',
        '  return true;',
        '  // some comment',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 5,
      mode: 'normal',
      description: 'Cursor inside curly braces'
    },
    afterState: {
      text: ['function() '],
      cursorRow: 0,
      cursorCol: 11,
      mode: 'normal',
      description: 'Braces and all content deleted'
    },
    explanation: 'Alternative notation for a{. Text object around curly braces. Same functionality as a{ - selects braces and content.'
  },

  // VIM Configuration Basics (vimrcBasics)
  '~/.vimrc': {
    command: '~/.vimrc',
    beforeState: {
      text: ['Creating VIM configuration file'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Need to create VIM config'
    },
    afterState: {
      text: [
        '--- ~/.vimrc file location ---',
        '/home/username/.vimrc',
        'VIM configuration file for Linux/Mac',
        'Edit with: vim ~/.vimrc'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'VIM config file location shown'
    },
    explanation: 'Location of VIM configuration file on Linux/Mac systems. This file contains all your VIM settings and customizations.'
  },

  '$HOME/_vimrc': {
    command: '$HOME/_vimrc',
    beforeState: {
      text: ['Creating VIM configuration on Windows'],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Need VIM config on Windows'
    },
    afterState: {
      text: [
        '--- $HOME/_vimrc file location ---',
        'C:\\Users\\username\\_vimrc',
        'VIM configuration file for Windows',
        'Edit with: vim $HOME/_vimrc'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Windows VIM config location shown'
    },
    explanation: 'Location of VIM configuration file on Windows systems. Uses underscore prefix instead of dot due to Windows filesystem conventions.'
  },

  ':source $MYVIMRC': {
    command: ':source $MYVIMRC',
    beforeState: {
      text: [
        '" Modified .vimrc settings',
        'set number',
        'set hlsearch',
        'syntax on'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Modified .vimrc file open'
    },
    afterState: {
      text: [
        '" Modified .vimrc settings',
        'set number',
        'set hlsearch', 
        'syntax on',
        '',
        '.vimrc reloaded without restarting VIM'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Settings reloaded and applied'
    },
    explanation: 'Reloads your .vimrc configuration file without restarting VIM. Essential for testing configuration changes immediately.'
  },

  '" comment': {
    command: '" comment',
    beforeState: {
      text: [
        'set number',
        'set hlsearch',
        'syntax on'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'VIM configuration file'
    },
    afterState: {
      text: [
        'set number',
        '" Enable search highlighting',
        'set hlsearch',
        'syntax on'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Comment added to explain setting'
    },
    explanation: 'Comments in VIM configuration files start with double quote. Use them to document your settings and make .vimrc more readable.'
  },

  'set number': {
    command: 'set number',
    beforeState: {
      text: [
        'function example() {',
        '  return true;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'No line numbers visible'
    },
    afterState: {
      text: [
        '1 | function example() {',
        '2 |   return true;',
        '3 | }'
      ],
      cursorRow: 0,
      cursorCol: 4,
      mode: 'normal',
      description: 'Line numbers now displayed'
    },
    explanation: 'Enables absolute line number display. Essential for navigation, debugging, and referencing specific lines in code files.'
  },

  'set relativenumber': {
    command: 'set relativenumber',
    beforeState: {
      text: [
        '1 | function example() {',
        '2 |   let x = 1;',
        '3 |   let y = 2;',
        '4 |   return x + y;',
        '5 | }'
      ],
      cursorRow: 2,
      cursorCol: 4,
      mode: 'normal',
      description: 'Cursor on line 3 with absolute numbers'
    },
    afterState: {
      text: [
        '2 | function example() {',
        '1 |   let x = 1;',
        '3 |   let y = 2;',
        '1 |   return x + y;',
        '2 | }'
      ],
      cursorRow: 2,
      cursorCol: 4,
      mode: 'normal',
      description: 'Relative numbers shown from current line'
    },
    explanation: 'Shows line numbers relative to current cursor position. Makes it easy to use counts with movement commands like 3j or 2k.'
  },

  'set hlsearch': {
    command: 'set hlsearch',
    beforeState: {
      text: [
        'function test() {',
        '  test variable here',
        '  return test + 1;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'After searching /test, no highlighting'
    },
    afterState: {
      text: [
        'function [test]() {',
        '  [test] variable here',
        '  return [test] + 1;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All "test" matches highlighted'
    },
    explanation: 'Highlights all matches of your search pattern, making it easy to see all occurrences of searched text at once.'
  },

  'set incsearch': {
    command: 'set incsearch',
    beforeState: {
      text: [
        'function calculate() {',
        '  calculator.run();',
        '  return calculation;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Starting to type /calc...'
    },
    afterState: {
      text: [
        'function [calc]ulate() {',
        '  calculator.run();',
        '  return calculation;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 9,
      mode: 'normal',
      description: 'Cursor jumps to match as you type'
    },
    explanation: 'Shows search results incrementally as you type. Cursor jumps to the first match, updating in real-time as you type more characters.'
  },

  'set ignorecase': {
    command: 'set ignorecase',
    beforeState: {
      text: [
        'Function Test() {',
        '  test variable',
        '  TEST constant',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Searching /test finds only exact case'
    },
    afterState: {
      text: [
        'Function [Test]() {',
        '  [test] variable',
        '  [TEST] constant',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'All case variations highlighted'
    },
    explanation: 'Makes searches case-insensitive. Searching for "test" will match "test", "Test", "TEST", etc. Very useful for most text searching.'
  },

  'set smartcase': {
    command: 'set smartcase',
    beforeState: {
      text: [
        'Function Test() {',
        '  test variable',
        '  TEST constant',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'With ignorecase set, searching /Test'
    },
    afterState: {
      text: [
        'Function [Test]() {',
        '  test variable',
        '  TEST constant',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Only exact case "Test" highlighted'
    },
    explanation: 'Overrides ignorecase when search pattern contains uppercase. Lowercase = case-insensitive, uppercase = case-sensitive. Best of both worlds.'
  },

  'set tabstop=4': {
    command: 'set tabstop=4',
    beforeState: {
      text: [
        'function() {',
        '\tindented with tab (8 spaces wide)',
        '\t\tdouble indent',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Tabs display as 8 spaces (default)'
    },
    afterState: {
      text: [
        'function() {',
        '    indented with tab (4 spaces wide)',
        '        double indent',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Tabs now display as 4 spaces'
    },
    explanation: 'Sets display width of tab characters to 4 spaces. Common setting for most programming languages and coding standards.'
  },

  'set expandtab': {
    command: 'set expandtab',
    beforeState: {
      text: [
        'function() {',
        '    code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'insert',
      description: 'Pressing Tab key in insert mode'
    },
    afterState: {
      text: [
        'function() {',
        '        code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 8,
      mode: 'insert',
      description: 'Tab converted to spaces'
    },
    explanation: 'Converts Tab key presses to spaces instead of tab characters. Ensures consistent indentation across all editors and systems.'
  },

  'set autoindent': {
    command: 'set autoindent',
    beforeState: {
      text: [
        'function example() {',
        '    if (true) {',
        '        console.log("test");'
      ],
      cursorRow: 2,
      cursorCol: 27,
      mode: 'insert',
      description: 'Pressing Enter at end of indented line'
    },
    afterState: {
      text: [
        'function example() {',
        '    if (true) {',
        '        console.log("test");',
        '        '
      ],
      cursorRow: 3,
      cursorCol: 8,
      mode: 'insert',
      description: 'New line automatically indented'
    },
    explanation: 'Automatically indents new lines to match the indentation of the current line. Essential for maintaining consistent code structure.'
  },

  'syntax on': {
    command: 'syntax on',
    beforeState: {
      text: [
        'function example() {',
        '  let variable = "string";',
        '  return variable + 123;',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Code with no syntax highlighting'
    },
    afterState: {
      text: [
        '[function] [example]() {',
        '  [let] [variable] = ["string"];',
        '  [return] [variable] + [123];',
        '}'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Syntax highlighting enabled'
    },
    explanation: 'Enables syntax highlighting for programming languages. Colors keywords, strings, numbers, and comments to improve code readability.'
  },

  // VIM Key Mappings and Customization (vimrcKeysAndMappings)
  'let mapleader = ","': {
    command: 'let mapleader = ","',
    beforeState: {
      text: [
        '" VIM configuration',
        'set number',
        'syntax on'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Basic .vimrc configuration'
    },
    afterState: {
      text: [
        '" VIM configuration',
        'let mapleader = ","',
        'set number',
        'syntax on'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Leader key set to comma'
    },
    explanation: 'Sets the leader key to comma. Leader key acts as a prefix for custom key mappings, allowing you to create personalized shortcuts like ,w for save.'
  },

  'nnoremap <leader>w :w<CR>': {
    command: 'nnoremap <leader>w :w<CR>',
    beforeState: {
      text: [
        'let mapleader = ","',
        '" Custom mapping to save file',
        'nnoremap <leader>w :w<CR>'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Custom save mapping defined'
    },
    afterState: {
      text: [
        'let mapleader = ","',
        '" Custom mapping to save file',
        'nnoremap <leader>w :w<CR>',
        '',
        'Press ",w" to save file quickly'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Shortcut ,w now saves files'
    },
    explanation: 'Creates a custom mapping where leader+w (,w) saves the current file. Non-recursive normal mode mapping prevents conflicts with other mappings.'
  },

  'inoremap jj <Esc>': {
    command: 'inoremap jj <Esc>',
    beforeState: {
      text: [
        'function example() {',
        '  typing in insert mode'
      ],
      cursorRow: 1,
      cursorCol: 22,
      mode: 'insert',
      description: 'In insert mode, typing jj quickly'
    },
    afterState: {
      text: [
        'function example() {',
        '  typing in insert mode'
      ],
      cursorRow: 1,
      cursorCol: 21,
      mode: 'normal',
      description: 'jj pressed, now in normal mode'
    },
    explanation: 'Maps double-j (jj) to Escape in insert mode. Popular alternative to reaching for Esc key, keeping hands on home row for faster editing.'
  },

  'vnoremap < <gv': {
    command: 'vnoremap < <gv',
    beforeState: {
      text: [
        'function example() {',
        '    unindented code',
        '    more code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'visual',
      description: 'Lines selected, pressing < to unindent'
    },
    afterState: {
      text: [
        'function example() {',
        'unindented code',
        'more code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'visual',
      description: 'Lines unindented, selection maintained'
    },
    explanation: 'Remaps < in visual mode to unindent and reselect. Default behavior loses selection after indenting, this keeps it selected for multiple adjustments.'
  },

  'vnoremap > >gv': {
    command: 'vnoremap > >gv',
    beforeState: {
      text: [
        'function example() {',
        'indented code',
        'more code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'visual',
      description: 'Lines selected, pressing > to indent'
    },
    afterState: {
      text: [
        'function example() {',
        '    indented code',
        '    more code here',
        '}'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'visual',
      description: 'Lines indented, selection maintained'
    },
    explanation: 'Remaps > in visual mode to indent and reselect. Allows you to press > multiple times to indent several levels without reselecting.'
  },

  // Key Notation Examples
  '<CR>': {
    command: '<CR>',
    beforeState: {
      text: [
        '" Key notation example',
        'nnoremap <leader>s :source %<CR>',
        'inoremap <C-s> <Esc>:w<CR>i'
      ],
      cursorRow: 1,
      cursorCol: 27,
      mode: 'normal',
      description: 'VIM key notation in mappings'
    },
    afterState: {
      text: [
        '" Key notation example',
        'nnoremap <leader>s :source %<CR>',
        'inoremap <C-s> <Esc>:w<CR>i',
        '',
        '<CR> represents the Enter/Return key'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Enter key notation explained'
    },
    explanation: 'Key notation for Enter/Return key in VIM mappings. Used to execute commands or insert newlines in custom key mappings.'
  },

  '<Esc>': {
    command: '<Esc>',
    beforeState: {
      text: [
        '" Exit insert mode mapping',
        'inoremap jk <Esc>',
        'cnoremap jk <Esc>'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'normal',
      description: 'Escape key in mappings'
    },
    afterState: {
      text: [
        '" Exit insert mode mapping',
        'inoremap jk <Esc>',
        'cnoremap jk <Esc>',
        '',
        '<Esc> represents the Escape key'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Escape key notation explained'
    },
    explanation: 'Key notation for Escape key in VIM mappings. Commonly used to exit insert mode or cancel operations in custom mappings.'
  },

  '<Tab>': {
    command: '<Tab>',
    beforeState: {
      text: [
        '" Tab key mapping',
        'nnoremap <Tab> >>',
        'nnoremap <S-Tab> <<'
      ],
      cursorRow: 1,
      cursorCol: 11,
      mode: 'normal',
      description: 'Tab key in mappings'
    },
    afterState: {
      text: [
        '" Tab key mapping',
        'nnoremap <Tab> >>',
        'nnoremap <S-Tab> <<',
        '',
        '<Tab> represents the Tab key'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Tab key notation explained'
    },
    explanation: 'Key notation for Tab key in VIM mappings. Often mapped to indentation commands or completion triggers in custom configurations.'
  },

  '<Space>': {
    command: '<Space>',
    beforeState: {
      text: [
        '" Space key as leader',
        'let mapleader = " "',
        'nnoremap <Space>w :w<CR>'
      ],
      cursorRow: 2,
      cursorCol: 11,
      mode: 'normal',
      description: 'Space key in mappings'
    },
    afterState: {
      text: [
        '" Space key as leader',
        'let mapleader = " "',
        'nnoremap <Space>w :w<CR>',
        '',
        '<Space> represents the spacebar'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Space key notation explained'
    },
    explanation: 'Key notation for spacebar in VIM mappings. Popular choice for leader key due to its size and accessibility with either thumb.'
  },

  '<C-x>': {
    command: '<C-x>',
    beforeState: {
      text: [
        '" Ctrl combinations',
        'nnoremap <C-s> :w<CR>',
        'inoremap <C-x> <Esc>dd'
      ],
      cursorRow: 2,
      cursorCol: 11,
      mode: 'normal',
      description: 'Ctrl key combinations in mappings'
    },
    afterState: {
      text: [
        '" Ctrl combinations',
        'nnoremap <C-s> :w<CR>',
        'inoremap <C-x> <Esc>dd',
        '',
        '<C-x> represents Ctrl+x key combination'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Ctrl key notation explained'
    },
    explanation: 'Key notation for Ctrl key combinations in VIM mappings. <C-x> means hold Ctrl and press x. Used for many common shortcuts.'
  },

  '<leader>': {
    command: '<leader>',
    beforeState: {
      text: [
        'let mapleader = ","',
        '" Leader key mappings',
        'nnoremap <leader>q :q<CR>',
        'nnoremap <leader>w :w<CR>'
      ],
      cursorRow: 2,
      cursorCol: 11,
      mode: 'normal',
      description: 'Leader key in mappings'
    },
    afterState: {
      text: [
        'let mapleader = ","',
        '" Leader key mappings',
        'nnoremap <leader>q :q<CR>',
        'nnoremap <leader>w :w<CR>',
        '',
        '<leader> represents your configured leader key'
      ],
      cursorRow: 5,
      cursorCol: 0,
      mode: 'normal',
      description: 'Leader key notation explained'
    },
    explanation: 'Special key notation for the leader key in VIM mappings. Dynamically represents whatever key you\'ve set as mapleader (comma, space, etc).'
  },

  'nnoremap': {
    command: 'nnoremap',
    beforeState: {
      text: [
        '" Non-recursive normal mode mapping',
        'nnoremap j gj',
        'nnoremap k gk'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Normal mode mapping command'
    },
    afterState: {
      text: [
        '" Non-recursive normal mode mapping',
        'nnoremap j gj',
        'nnoremap k gk',
        '',
        'j and k now move by display lines, not file lines'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Custom j/k movement behavior'
    },
    explanation: 'Non-recursive normal mode mapping command. Creates custom key bindings that won\'t trigger other mappings, preventing infinite loops.'
  },

  'inoremap': {
    command: 'inoremap',
    beforeState: {
      text: [
        '" Insert mode shortcuts',
        'inoremap <C-l> <Right>',
        'inoremap <C-h> <Left>'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Insert mode mapping command'
    },
    afterState: {
      text: [
        '" Insert mode shortcuts',
        'inoremap <C-l> <Right>',
        'inoremap <C-h> <Left>',
        '',
        'Ctrl+h/l now move cursor in insert mode'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Insert mode navigation enabled'
    },
    explanation: 'Non-recursive insert mode mapping command. Creates custom key bindings that work only in insert mode, useful for navigation without leaving insert.'
  },

  'vnoremap': {
    command: 'vnoremap',
    beforeState: {
      text: [
        '" Visual mode enhancements',
        'vnoremap < <gv',
        'vnoremap > >gv'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Visual mode mapping command'
    },
    afterState: {
      text: [
        '" Visual mode enhancements',
        'vnoremap < <gv',
        'vnoremap > >gv',
        '',
        'Indent/unindent keeps visual selection active'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Better visual mode indentation'
    },
    explanation: 'Non-recursive visual mode mapping command. Creates custom key bindings that work only in visual mode, improving text selection workflows.'
  },

  ':%s/^$\\n//g': {
    command: ':%s/^$\\n//g',
    beforeState: {
      text: [
        'First line',
        '',
        'Second line',
        '',
        '',
        'Third line',
        ''
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File with multiple empty lines'
    },
    afterState: {
      text: [
        'First line',
        'Second line',
        'Third line'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Empty lines removed'
    },
    explanation: 'Removes all empty lines from the file. ^$ matches lines that start and end with nothing (empty lines), \\n includes the newline character.'
  },

  ':%s/\\(\\w\\+\\)/[\\1]/g': {
    command: ':%s/\\(\\w\\+\\)/[\\1]/g',
    beforeState: {
      text: [
        'hello world test',
        'vim editor rocks'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text with words to wrap'
    },
    afterState: {
      text: [
        '[hello] [world] [test]',
        '[vim] [editor] [rocks]'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Words wrapped in brackets'
    },
    explanation: 'Uses capture groups to wrap each word in brackets. \\(\\w\\+\\) captures word characters, \\1 references the captured group in replacement.'
  },

  ':s#old#new#': {
    command: ':s#old#new#',
    beforeState: {
      text: [
        'Path: /home/user/old/file.txt',
        'URL: http://old.example.com/path'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Line with forward slashes'
    },
    afterState: {
      text: [
        'Path: /home/user/new/file.txt',
        'URL: http://old.example.com/path'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'First occurrence replaced'
    },
    explanation: 'Uses # as delimiter instead of / to avoid escaping forward slashes. Useful when working with file paths or URLs containing forward slashes.'
  },

  '\\n': {
    command: '\\n',
    beforeState: {
      text: [
        'Find: word1 word2',
        'Replace with: :%s/word1 word2/word1\\nword2/g'
      ],
      cursorRow: 1,
      cursorCol: 30,
      mode: 'normal',
      description: 'Pattern with newline escape'
    },
    afterState: {
      text: [
        'Find: word1 word2',
        'Replace with: word1',
        'word2'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Newline inserted in replacement'
    },
    explanation: 'Newline character in search/replace patterns. In replacement strings, \\n creates a new line. Essential for formatting and text restructuring.'
  },

  '\\t': {
    command: '\\t',
    beforeState: {
      text: [
        'Replace spaces with tabs:',
        '    indented line',
        '        more indented'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Lines with space indentation'
    },
    afterState: {
      text: [
        'Replace spaces with tabs:',
        '\tindented line',
        '\t\tmore indented'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Converted to tab indentation'
    },
    explanation: 'Tab character in patterns. \\t matches or inserts a tab character. Commonly used for indentation conversion and whitespace formatting.'
  },

  '\\s': {
    command: '\\s',
    beforeState: {
      text: [
        'Pattern: \\s matches any whitespace',
        'Text:  multiple   spaces	and	tabs',
        'Usage: :%s/\\s\\+/ /g'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text with various whitespace'
    },
    afterState: {
      text: [
        'Pattern: \\s matches any whitespace',
        'Text: multiple spaces and tabs',
        'Usage: :%s/\\s\\+/ /g'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Normalized whitespace'
    },
    explanation: 'Matches any whitespace character (spaces, tabs, newlines). \\s\\+ matches one or more whitespace characters. Useful for cleaning up formatting.'
  },

  '\\d': {
    command: '\\d',
    beforeState: {
      text: [
        'Extract numbers from text:',
        'Price: $29.99, Quantity: 5 items',
        'Pattern: \\d matches digits'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text containing digits'
    },
    afterState: {
      text: [
        'Extract numbers from text:',
        'Price: $XX.XX, Quantity: X items',
        'Pattern: \\d matches digits'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Digits replaced with X'
    },
    explanation: 'Matches any digit character [0-9]. \\d\\+ matches one or more digits. Essential for number manipulation and data extraction.'
  },

  '\\w': {
    command: '\\w',
    beforeState: {
      text: [
        'Word pattern: \\w matches word chars',
        'Text: hello_world123 and symbols!@#',
        'Usage: :%s/\\w\\+/[WORD]/g'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text with word characters'
    },
    afterState: {
      text: [
        'Word pattern: \\w matches word chars',
        'Text: [WORD] and [WORD]!@#',
        'Usage: :%s/\\w\\+/[WORD]/g'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Word characters replaced'
    },
    explanation: 'Matches word characters [a-zA-Z0-9_]. \\w\\+ matches one or more word characters. Useful for identifying variable names and identifiers.'
  },

  '.*': {
    command: '.*',
    beforeState: {
      text: [
        'Pattern: .* matches everything',
        'Line: Start middle end',
        'Usage: :%s/Start.*end/REPLACED/g'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Line with start and end markers'
    },
    afterState: {
      text: [
        'Pattern: .* matches everything',
        'Line: REPLACED',
        'Usage: :%s/Start.*end/REPLACED/g'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Everything between markers replaced'
    },
    explanation: 'Matches zero or more of any character except newline. Greedy matching - captures the longest possible match. Essential for complex pattern matching.'
  },

  '"*y': {
    command: '"*y',
    beforeState: {
      text: [
        'Select and copy to system clipboard:',
        'hello world',
        'This text will be copied'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'visual',
      description: 'Text selected in visual mode'
    },
    afterState: {
      text: [
        'Select and copy to system clipboard:',
        'hello world',
        'This text will be copied'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text copied to system clipboard'
    },
    explanation: 'Copies selected text to primary selection (Linux) or system clipboard. Text can be pasted with middle mouse click or Ctrl+V in other applications.'
  },

  '"*p': {
    command: '"*p',
    beforeState: {
      text: [
        'Paste from system clipboard:',
        'Current line',
        'Insert here:'
      ],
      cursorRow: 2,
      cursorCol: 12,
      mode: 'normal',
      description: 'Cursor after colon, clipboard contains "system text"'
    },
    afterState: {
      text: [
        'Paste from system clipboard:',
        'Current line',
        'Insert here: system text'
      ],
      cursorRow: 2,
      cursorCol: 24,
      mode: 'normal',
      description: 'System clipboard content pasted'
    },
    explanation: 'Pastes from primary selection (Linux) or system clipboard. Retrieves text copied from other applications or terminal selections.'
  },

  '".': {
    command: '".',
    beforeState: {
      text: [
        'Last inserted text register:',
        'Previously typed: hello',
        'Insert again:'
      ],
      cursorRow: 2,
      cursorCol: 13,
      mode: 'insert',
      description: 'In insert mode, about to paste last insertion'
    },
    afterState: {
      text: [
        'Last inserted text register:',
        'Previously typed: hello',
        'Insert again: hello'
      ],
      cursorRow: 2,
      cursorCol: 18,
      mode: 'insert',
      description: 'Last inserted text repeated'
    },
    explanation: 'Contains the last text that was inserted. Use Ctrl-r . in insert mode to paste it, or ". to reference in commands. Useful for repeating insertions.'
  },

  '"%': {
    command: '"%',
    beforeState: {
      text: [
        'Current filename register:',
        'Insert current file path:',
        'Editing: '
      ],
      cursorRow: 2,
      cursorCol: 9,
      mode: 'insert',
      description: 'In insert mode, will paste filename'
    },
    afterState: {
      text: [
        'Current filename register:',
        'Insert current file path:',
        'Editing: /home/user/document.txt'
      ],
      cursorRow: 2,
      cursorCol: 33,
      mode: 'insert',
      description: 'Current filename inserted'
    },
    explanation: 'Contains the current filename. Use Ctrl-r % in insert mode or "% in commands. Useful for referencing the current file in text or commands.'
  },

  '":': {
    command: '":',
    beforeState: {
      text: [
        'Last command register:',
        'Previously ran: :set number',
        'Repeat command:'
      ],
      cursorRow: 2,
      cursorCol: 15,
      mode: 'insert',
      description: 'About to insert last command'
    },
    afterState: {
      text: [
        'Last command register:',
        'Previously ran: :set number',
        'Repeat command: set number'
      ],
      cursorRow: 2,
      cursorCol: 25,
      mode: 'insert',
      description: 'Last command inserted'
    },
    explanation: 'Contains the last executed command. Use Ctrl-r : in insert mode or ": in commands. Helpful for documenting or repeating commands.'
  },

  '"/': {
    command: '"/',
    beforeState: {
      text: [
        'Last search register:',
        'Previously searched: /function',
        'Search pattern was:'
      ],
      cursorRow: 2,
      cursorCol: 20,
      mode: 'insert',
      description: 'About to insert last search pattern'
    },
    afterState: {
      text: [
        'Last search register:',
        'Previously searched: /function',
        'Search pattern was: function'
      ],
      cursorRow: 2,
      cursorCol: 28,
      mode: 'insert',
      description: 'Last search pattern inserted'
    },
    explanation: 'Contains the last search pattern. Use Ctrl-r / in insert mode or "/ in commands. Useful for referencing or modifying previous searches.'
  },

  '"=': {
    command: '"=',
    beforeState: {
      text: [
        'Expression register for calculations:',
        'Calculate: 25 + 17 = ',
        'Result: '
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'insert',
      description: 'In insert mode, ready for calculation'
    },
    afterState: {
      text: [
        'Expression register for calculations:',
        'Calculate: 25 + 17 = ',
        'Result: 42'
      ],
      cursorRow: 2,
      cursorCol: 10,
      mode: 'insert',
      description: 'Calculation result inserted'
    },
    explanation: 'Expression register for calculations. Use Ctrl-r = in insert mode, enter expression like "25+17", press Enter. VIM evaluates and inserts the result.'
  },

  ':help': {
    command: ':help',
    beforeState: {
      text: [
        'Need help with VIM commands?',
        'Type :help to open documentation',
        'Current file content...'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'About to open help system'
    },
    afterState: {
      text: [
        'VIM HELP SYSTEM',
        '================',
        'Welcome to VIM help! Navigate with:',
        '- Ctrl-] to follow links',
        '- Ctrl-t to go back',
        '- :q to close help'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Help window opened'
    },
    explanation: 'Opens VIM\'s comprehensive help documentation. Use Ctrl-] to follow links, Ctrl-t to go back, and :q to close help windows.'
  },

  ':help keyword': {
    command: ':help keyword',
    beforeState: {
      text: [
        'Get specific help:',
        ':help w',
        ':help search'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'normal',
      description: 'About to search for help on "w"'
    },
    afterState: {
      text: [
        'HELP FOR "w" COMMAND',
        '====================',
        'w                   Move cursor to beginning of next word',
        'W                   Move to next WORD (space-delimited)',
        'See also: b, e, ge'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Specific help for "w" displayed'
    },
    explanation: 'Gets help on a specific keyword, command, or topic. Very precise - helps you understand exactly what a command does and its variations.'
  },

  ':helpgrep pattern': {
    command: ':helpgrep pattern',
    beforeState: {
      text: [
        'Search across all help files:',
        ':helpgrep register',
        ':helpgrep copy'
      ],
      cursorRow: 1,
      cursorCol: 16,
      mode: 'normal',
      description: 'About to search help for "register"'
    },
    afterState: {
      text: [
        'HELP SEARCH RESULTS',
        '===================',
        'Found 15 matches for "register":',
        '1. usr_09.txt: Using the clipboard',
        '2. change.txt: Registers and copying',
        '3. cmdline.txt: Command line registers'
      ],
      cursorRow: 3,
      cursorCol: 0,
      mode: 'normal',
      description: 'Help search results displayed'
    },
    explanation: 'Searches through all help files for a pattern. Creates a quickfix list of matches. Use :cn/:cp to navigate results.'
  },

  ':h ctrl-v': {
    command: ':h ctrl-v',
    beforeState: {
      text: [
        'Get help for key combinations:',
        ':h ctrl-v',
        ':h ctrl-w'
      ],
      cursorRow: 1,
      cursorCol: 9,
      mode: 'normal',
      description: 'About to get help for Ctrl-v'
    },
    afterState: {
      text: [
        'HELP FOR CTRL-V',
        '===============',
        'CTRL-V          Start visual block mode',
        'i_CTRL-V        Insert literal character',
        'c_CTRL-V        Insert literal in command line'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Ctrl-v help documentation shown'
    },
    explanation: 'Gets help for key combinations. Use the format shown - "ctrl-v" for Ctrl+V. Essential for understanding complex key bindings.'
  },

  ':h i_ctrl-r': {
    command: ':h i_ctrl-r',
    beforeState: {
      text: [
        'Insert mode command help:',
        ':h i_ctrl-r',
        ':h i_ctrl-w'
      ],
      cursorRow: 1,
      cursorCol: 11,
      mode: 'normal',
      description: 'Getting insert mode help'
    },
    afterState: {
      text: [
        'INSERT MODE CTRL-R',
        '==================',
        'i_CTRL-R        Insert register contents',
        'i_CTRL-R "      Insert from default register',
        'i_CTRL-R %      Insert current filename'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Insert mode Ctrl-r help shown'
    },
    explanation: 'Gets help for insert mode commands. Use "i_" prefix for insert mode help. Shows how to use registers and special insertions in insert mode.'
  },

  ':h c_ctrl-r': {
    command: ':h c_ctrl-r',
    beforeState: {
      text: [
        'Command mode command help:',
        ':h c_ctrl-r',
        ':h c_ctrl-w'
      ],
      cursorRow: 1,
      cursorCol: 11,
      mode: 'normal',
      description: 'Getting command mode help'
    },
    afterState: {
      text: [
        'COMMAND MODE CTRL-R',
        '===================',
        'c_CTRL-R        Insert register in command line',
        'c_CTRL-R "      Insert from default register',
        'c_CTRL-R /      Insert last search pattern'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'Command mode Ctrl-r help shown'
    },
    explanation: 'Gets help for command mode commands. Use "c_" prefix for command mode help. Shows how to insert register contents into command line.'
  },

  'v_d': {
    command: 'd',
    beforeState: {
      text: [
        'Delete selected text in visual mode:',
        'The quick brown fox jumps',
        'over the lazy dog'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'visual',
      description: 'Selected text: "quick brown" in visual mode'
    },
    afterState: {
      text: [
        'Delete selected text in visual mode:',
        'The  fox jumps',
        'over the lazy dog'
      ],
      cursorRow: 1,
      cursorCol: 4,
      mode: 'normal',
      description: 'Selected text deleted'
    },
    explanation: 'In visual mode, "d" deletes the selected text. Works with character, line, or block selections. Deleted text goes to default register.'
  },

  'v_c': {
    command: 'c',
    beforeState: {
      text: [
        'Change selected text in visual mode:',
        'Hello old world',
        'Goodbye old world'
      ],
      cursorRow: 1,
      cursorCol: 6,
      mode: 'visual',
      description: 'Selected text: "old" in visual mode'
    },
    afterState: {
      text: [
        'Change selected text in visual mode:',
        'Hello new world',
        'Goodbye old world'
      ],
      cursorRow: 1,
      cursorCol: 9,
      mode: 'insert',
      description: 'Replaced "old" with "new", now in insert mode'
    },
    explanation: 'In visual mode, "c" deletes the selected text and enters insert mode. Perfect for replacing selected content with new text.'
  },

  'v_y': {
    command: 'y',
    beforeState: {
      text: [
        'Copy selected text in visual mode:',
        'important text here',
        'paste destination:'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'visual',
      description: 'Selected text: "important text" in visual mode'
    },
    afterState: {
      text: [
        'Copy selected text in visual mode:',
        'important text here',
        'paste destination:'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Text copied to register, ready to paste'
    },
    explanation: 'In visual mode, "y" copies (yanks) the selected text to the default register. Text remains in place and can be pasted elsewhere.'
  },

  'v_>': {
    command: '>',
    beforeState: {
      text: [
        'Indent selected lines:',
        'function example() {',
        'console.log("hello");',
        'return true;',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'visual',
      description: 'Lines 2-3 selected in visual line mode'
    },
    afterState: {
      text: [
        'Indent selected lines:',
        'function example() {',
        '    console.log("hello");',
        '    return true;',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 4,
      mode: 'normal',
      description: 'Selected lines indented by one level'
    },
    explanation: 'In visual mode, ">" indents the selected lines. Use with visual line mode (V) for full lines, or visual block for column operations.'
  },

  'v_<': {
    command: '<',
    beforeState: {
      text: [
        'Unindent selected lines:',
        'function example() {',
        '        console.log("hello");',
        '        return true;',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'visual',
      description: 'Over-indented lines selected'
    },
    afterState: {
      text: [
        'Unindent selected lines:',
        'function example() {',
        '    console.log("hello");',
        '    return true;',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 4,
      mode: 'normal',
      description: 'Selected lines unindented to proper level'
    },
    explanation: 'In visual mode, "<" removes one level of indentation from selected lines. Essential for fixing indentation and code formatting.'
  },

  ':q!': {
    command: ':q!',
    beforeState: {
      text: [
        'Modified file with unsaved changes:',
        'This file has been modified',
        'But I don\'t want to save these changes',
        'Use :q! to quit without saving'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File has unsaved modifications'
    },
    afterState: {
      text: [
        'VIM has exited without saving.',
        'All changes were discarded.',
        'Original file remains unchanged.'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Exited VIM, changes discarded'
    },
    explanation: 'Quits VIM without saving changes. The "!" forces the quit even with unsaved modifications. Use when you want to discard all changes.'
  },

  ':x': {
    command: ':x',
    beforeState: {
      text: [
        'File ready to save and exit:',
        'My important document',
        'with valuable content',
        'Ready to save and close'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File ready to be saved and closed'
    },
    afterState: {
      text: [
        'File saved successfully!',
        'VIM has exited.',
        'Document preserved to disk.'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File saved and VIM exited'
    },
    explanation: 'Saves the file and exits VIM. Same as :wq but more efficient - only writes if the file has been modified. Smart alternative to :wq.'
  },

  ':w !sudo tee %': {
    command: ':w !sudo tee %',
    beforeState: {
      text: [
        'Error: Permission denied!',
        'Cannot write to /etc/hosts',
        'Need sudo privileges to save',
        'Use :w !sudo tee % trick'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cannot save due to permissions'
    },
    afterState: {
      text: [
        'Success! File saved with sudo.',
        'Password was prompted for sudo',
        '/etc/hosts updated successfully',
        'No need to restart VIM'
      ],
      cursorRow: 0,
      cursorCol: 0,
      mode: 'normal',
      description: 'File saved with elevated privileges'
    },
    explanation: 'Saves file with sudo privileges when you forgot to open with sudo. Uses tee command to write as root. Essential for system files.'
  },

  ':set paste': {
    command: ':set paste',
    beforeState: {
      text: [
        'About to paste from clipboard:',
        'function broken() {',
        'code here',
        'Auto-indent will mess this up!'
      ],
      cursorRow: 2,
      cursorCol: 9,
      mode: 'normal',
      description: 'Ready to paste, but auto-indent will cause issues'
    },
    afterState: {
      text: [
        'About to paste from clipboard:',
        'function broken() {',
        'code here',
        '-- INSERT (paste) --'
      ],
      cursorRow: 2,
      cursorCol: 9,
      mode: 'insert',
      description: 'Paste mode enabled, safe to paste'
    },
    explanation: 'Enables paste mode - disables auto-indent, auto-complete and other features that interfere with pasting. Essential when pasting code from clipboard.'
  },

  ':set nopaste': {
    command: ':set nopaste',
    beforeState: {
      text: [
        'Finished pasting code:',
        'function working() {',
        '  console.log("pasted correctly");',
        '-- INSERT (paste) --'
      ],
      cursorRow: 2,
      cursorCol: 30,
      mode: 'insert',
      description: 'In paste mode after successful paste'
    },
    afterState: {
      text: [
        'Finished pasting code:',
        'function working() {',
        '  console.log("pasted correctly");',
        '-- INSERT --'
      ],
      cursorRow: 2,
      cursorCol: 30,
      mode: 'insert',
      description: 'Normal insert mode restored'
    },
    explanation: 'Disables paste mode and restores normal VIM behavior - auto-indent, auto-complete, etc. Use after finishing paste operations.'
  },

  ':': {
    command: ':',
    beforeState: {
      text: [
        'Normal mode editing:',
        'Press : to enter command mode',
        'Type commands like :w, :q, :set'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'In normal mode, about to enter command mode'
    },
    afterState: {
      text: [
        'Normal mode editing:',
        'Press : to enter command mode',
        'Type commands like :w, :q, :set',
        ':'
      ],
      cursorRow: 3,
      cursorCol: 1,
      mode: 'command',
      description: 'Command line opened, ready for commands'
    },
    explanation: 'Enters command mode from normal mode. Command line appears at bottom. Type VIM commands like :w (save), :q (quit), :set (options).'
  },

  ':cd path': {
    command: ':cd path',
    beforeState: {
      text: [
        'Current directory: /home/user',
        'Change to project directory:',
        ':cd /home/user/projects/myapp'
      ],
      cursorRow: 2,
      cursorCol: 27,
      mode: 'normal',
      description: 'About to change to project directory'
    },
    afterState: {
      text: [
        'Current directory: /home/user/projects/myapp',
        'Successfully changed directory',
        'Now in project root'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Changed to project directory'
    },
    explanation: 'Changes VIM\'s working directory. Affects file operations and relative paths. Use :pwd to see current directory.'
  },

  ':!command': {
    command: ':!command',
    beforeState: {
      text: [
        'Execute shell commands from VIM:',
        ':!ls -la',
        ':!git status'
      ],
      cursorRow: 1,
      cursorCol: 7,
      mode: 'normal',
      description: 'About to run ls -la command'
    },
    afterState: {
      text: [
        'Shell command output:',
        'total 48',
        'drwxr-xr-x 3 user user 4096 Nov 22 10:30 .',
        'drwxr-xr-x 5 user user 4096 Nov 20 09:15 ..',
        '-rw-r--r-- 1 user user  156 Nov 22 10:30 file.txt',
        'Press ENTER to continue'
      ],
      cursorRow: 5,
      cursorCol: 0,
      mode: 'normal',
      description: 'Shell command executed, output displayed'
    },
    explanation: 'Executes shell commands without leaving VIM. Output is displayed, press Enter to return to editing. Use for git, ls, make, etc.'
  },

  'm{letter}': {
    command: 'm{letter}',
    beforeState: {
      text: [
        'Mark important locations:',
        'function processData() {',
        '  // TODO: implement this',
        '  return result;',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'normal',
      description: 'Cursor on TODO comment, about to set mark "t"'
    },
    afterState: {
      text: [
        'Mark important locations:',
        'function processData() {',
        '  // TODO: implement this  [mark "t" set]',
        '  return result;',
        '}'
      ],
      cursorRow: 2,
      cursorCol: 8,
      mode: 'normal',
      description: 'Mark "t" set at current position'
    },
    explanation: 'Sets a mark at current cursor position. Use a-z for file-local marks, A-Z for global marks. Example: "mt" sets mark "t", jump back with \'t or `t.'
  },

  '`{letter}': {
    command: '`{letter}',
    beforeState: {
      text: [
        'Jump to exact mark position:',
        'Line 1 of file',
        'Line 2 where mark "t" was set at col 15',
        'Line 3 current position',
        'Line 4 more content'
      ],
      cursorRow: 3,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor at line 3, about to jump to mark "t"'
    },
    afterState: {
      text: [
        'Jump to exact mark position:',
        'Line 1 of file',
        'Line 2 where mark "t" was set at col 15',
        'Line 3 current position',
        'Line 4 more content'
      ],
      cursorRow: 2,
      cursorCol: 15,
      mode: 'normal',
      description: 'Jumped to exact position of mark "t"'
    },
    explanation: 'Jumps to exact position (line and column) of mark. Use backtick + letter. More precise than \' which goes to line start.'
  },

  '``': {
    command: '``',
    beforeState: {
      text: [
        'Jump back to previous position:',
        'Moved here from line 5',
        'This is line 2',
        'Line 3',
        'Original position was here'
      ],
      cursorRow: 1,
      cursorCol: 12,
      mode: 'normal',
      description: 'Moved to line 2, previous position was line 5 col 20'
    },
    afterState: {
      text: [
        'Jump back to previous position:',
        'Moved here from line 5',
        'This is line 2',
        'Line 3',
        'Original position was here'
      ],
      cursorRow: 4,
      cursorCol: 20,
      mode: 'normal',
      description: 'Jumped back to previous exact position'
    },
    explanation: 'Jumps back to previous cursor position (exact location). Double backtick. Alternative to \'\' which goes to line start only.'
  },

  ':changes': {
    command: ':changes',
    beforeState: {
      text: [
        'View change history:',
        'Made several edits to this file',
        'Want to see change locations',
        'Use :changes command'
      ],
      cursorRow: 2,
      cursorCol: 0,
      mode: 'normal',
      description: 'About to view change list'
    },
    afterState: {
      text: [
        'CHANGE LIST:',
        '  change line  col text',
        '      3    10    5 added function',
        '      2    25   12 fixed typo',
        '      1    45    8 updated comment',
        'Press ENTER to continue'
      ],
      cursorRow: 4,
      cursorCol: 0,
      mode: 'normal',
      description: 'Change list displayed with line/column info'
    },
    explanation: 'Shows list of all changes made to current buffer. Lists line and column numbers. Use g; and g, to navigate through changes.'
  },

  ':set nospell': {
    command: ':set nospell',
    beforeState: {
      text: [
        'Disable spell checking:',
        'The quick brown fox jumps',
        'over teh lazy dog  [teh is underlined]',
        'Spell check currently enabled'
      ],
      cursorRow: 2,
      cursorCol: 5,
      mode: 'normal',
      description: 'Spell checking enabled, misspellings highlighted'
    },
    afterState: {
      text: [
        'Disable spell checking:',
        'The quick brown fox jumps',
        'over teh lazy dog',
        'Spell check disabled'
      ],
      cursorRow: 2,
      cursorCol: 5,
      mode: 'normal',
      description: 'Spell checking disabled, no highlighting'
    },
    explanation: 'Disables spell checking. Removes highlighting from misspelled words. Use when spell checking interferes with editing.'
  },

  ':set spelllang=en_us': {
    command: ':set spelllang=en_us',
    beforeState: {
      text: [
        'Set spell check language:',
        'colour favour behaviour',
        'Currently using British English',
        'Change to American English'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Using British spelling dictionary'
    },
    afterState: {
      text: [
        'Set spell check language:',
        'colour favour behaviour  [words now marked as misspelled]',
        'Changed to American English',
        'Color, favor, behavior would be correct'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Changed to American English dictionary'
    },
    explanation: 'Sets spell check language/locale. Common values: en_us, en_gb, de, fr, es. Affects which words are considered correctly spelled.'
  },

  'zug': {
    command: 'zug',
    beforeState: {
      text: [
        'Remove word from dictionary:',
        'specialword was added to dictionary',
        'But it was added by mistake',
        'Use zug to remove it'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on word that was incorrectly added'
    },
    afterState: {
      text: [
        'Remove word from dictionary:',
        'specialword  [now marked as misspelled]',
        'Word removed from personal dictionary',
        'Will be flagged as error again'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Word removed from dictionary, now flagged'
    },
    explanation: 'Removes word under cursor from personal dictionary. Undoes previous "zg" addition. Word will be marked as misspelled again.'
  },

  'zuw': {
    command: 'zuw',
    beforeState: {
      text: [
        'Undo marking word as wrong:',
        'validword was marked as incorrect',
        'But it was marked by mistake',
        'Use zuw to undo the marking'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Cursor on word incorrectly marked as wrong'
    },
    afterState: {
      text: [
        'Undo marking word as wrong:',
        'validword  [no longer marked as error]',
        'Marking as incorrect undone',
        'Word is now treated normally'
      ],
      cursorRow: 1,
      cursorCol: 0,
      mode: 'normal',
      description: 'Word no longer marked as incorrect'
    },
    explanation: 'Undoes marking word as incorrect (undoes "zw" command). Word will no longer be flagged as intentionally wrong.'
  }
}