interface ExampleState {
  text: string[]
  cursorRow: number
  cursorCol: number
  mode: 'normal' | 'insert' | 'visual'
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
  }
}