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
  }
}