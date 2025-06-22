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
  }
}