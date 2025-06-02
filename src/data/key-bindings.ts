export interface KeyBinding {
  key: string
  description: string
  group?: string
  mode?: string[]
  command?: string
  subKeys?: KeyBinding[]
  preview?: string  // Shows what the final command will look like
}

// Common motions that work with operators
export const motions: KeyBinding[] = [
  { key: 'w', description: 'word forward', command: 'w', preview: 'w' },
  { key: 'W', description: 'WORD forward', command: 'W', preview: 'W' },
  { key: 'b', description: 'word backward', command: 'b', preview: 'b' },
  { key: 'B', description: 'WORD backward', command: 'B', preview: 'B' },
  { key: 'e', description: 'end of word', command: 'e', preview: 'e' },
  { key: 'E', description: 'end of WORD', command: 'E', preview: 'E' },
  { key: '0', description: 'beginning of line', command: '0', preview: '0' },
  { key: '^', description: 'first non-blank', command: '^', preview: '^' },
  { key: '$', description: 'end of line', command: '$', preview: '$' },
  { key: 'G', description: 'end of file', command: 'G', preview: 'G' },
  { key: 'g', description: 'beginning of file', command: 'gg', preview: 'gg' },
  { key: '{', description: 'previous paragraph', command: '{', preview: '{' },
  { key: '}', description: 'next paragraph', command: '}', preview: '}' },
  { key: '(', description: 'previous sentence', command: '(', preview: '(' },
  { key: ')', description: 'next sentence', command: ')', preview: ')' },
  { key: 'H', description: 'top of screen', command: 'H', preview: 'H' },
  { key: 'M', description: 'middle of screen', command: 'M', preview: 'M' },
  { key: 'L', description: 'bottom of screen', command: 'L', preview: 'L' },
]

// Text objects for inner/around operations
export const textObjects: KeyBinding[] = [
  { key: 'w', description: 'word', command: 'w', preview: 'w' },
  { key: 'W', description: 'WORD', command: 'W', preview: 'W' },
  { key: 's', description: 'sentence', command: 's', preview: 's' },
  { key: 'p', description: 'paragraph', command: 'p', preview: 'p' },
  { key: '"', description: 'double quotes', command: '"', preview: '"' },
  { key: "'", description: 'single quotes', command: "'", preview: "'" },
  { key: '`', description: 'backticks', command: '`', preview: '`' },
  { key: '(', description: 'parentheses', command: '(', preview: '(' },
  { key: ')', description: 'parentheses', command: ')', preview: ')' },
  { key: 'b', description: 'parentheses (alias)', command: 'b', preview: 'b' },
  { key: '{', description: 'braces', command: '{', preview: '{' },
  { key: '}', description: 'braces', command: '}', preview: '}' },
  { key: 'B', description: 'braces (alias)', command: 'B', preview: 'B' },
  { key: '[', description: 'brackets', command: '[', preview: '[' },
  { key: ']', description: 'brackets', command: ']', preview: ']' },
  { key: '<', description: 'angle brackets', command: '<', preview: '<' },
  { key: '>', description: 'angle brackets', command: '>', preview: '>' },
  { key: 't', description: 'HTML/XML tag', command: 't', preview: 't' },
]

// Registers for copy/paste operations
export const registers: KeyBinding[] = [
  { key: 'a', description: 'register a', command: 'a', preview: '"a' },
  { key: 'b', description: 'register b', command: 'b', preview: '"b' },
  { key: 'c', description: 'register c', command: 'c', preview: '"c' },
  { key: 'd', description: 'register d', command: 'd', preview: '"d' },
  { key: 'e', description: 'register e', command: 'e', preview: '"e' },
  { key: '+', description: 'system clipboard', command: '+', preview: '"+' },
  { key: '*', description: 'primary selection', command: '*', preview: '"*' },
  { key: '0', description: 'yank register', command: '0', preview: '"0' },
  { key: '"', description: 'unnamed register', command: '"', preview: '""' },
  { key: '/', description: 'search register', command: '/', preview: '"/' },
  { key: ':', description: 'command register', command: ':', preview: '":' },
]

export const keyBindings: Record<string, KeyBinding[]> = {
  // Visual mode selection
  'v': [
    { key: 'i', description: 'Select inside...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Select inside ${obj.description}`, 
      command: `vi${obj.command}`,
      preview: `vi${obj.key}`
    })) },
    { key: 'a', description: 'Select around...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Select around ${obj.description}`, 
      command: `va${obj.command}`,
      preview: `va${obj.key}`
    })) },
  ],

  // Replace character
  'r': [
    { key: 'a', description: 'Replace with a', command: 'ra', group: 'Replace', preview: 'ra' },
    { key: 'b', description: 'Replace with b', command: 'rb', group: 'Replace', preview: 'rb' },
    { key: 'c', description: 'Replace with c', command: 'rc', group: 'Replace', preview: 'rc' },
    { key: ' ', description: 'Replace with space', command: 'r ', group: 'Replace', preview: 'r<Space>' },
    { key: 'Enter', description: 'Replace with newline', command: 'r<CR>', group: 'Replace', preview: 'r<CR>' },
  ],

  // Operator key bindings - Delete
  'd': [
    { key: 'd', description: 'Delete line', command: 'dd', group: 'Linewise', preview: 'dd' },
    { key: 'w', description: 'Delete word', command: 'dw', group: 'Motion', preview: 'dw' },
    { key: 'W', description: 'Delete WORD', command: 'dW', group: 'Motion', preview: 'dW' },
    { key: 'b', description: 'Delete word backward', command: 'db', group: 'Motion', preview: 'db' },
    { key: 'e', description: 'Delete to end of word', command: 'de', group: 'Motion', preview: 'de' },
    { key: '$', description: 'Delete to end of line', command: 'd$', group: 'Motion', preview: 'd$' },
    { key: '0', description: 'Delete to beginning of line', command: 'd0', group: 'Motion', preview: 'd0' },
    { key: '^', description: 'Delete to first non-blank', command: 'd^', group: 'Motion', preview: 'd^' },
    { key: 'G', description: 'Delete to end of file', command: 'dG', group: 'Motion', preview: 'dG' },
    { key: 'g', description: 'Delete to beginning of file', command: 'dgg', group: 'Motion', preview: 'dgg' },
    { key: '{', description: 'Delete paragraph backward', command: 'd{', group: 'Motion', preview: 'd{' },
    { key: '}', description: 'Delete paragraph forward', command: 'd}', group: 'Motion', preview: 'd}' },
    { key: 'i', description: 'Delete inside...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Delete inside ${obj.description}`, 
      command: `di${obj.command}`,
      preview: `di${obj.key}`
    })) },
    { key: 'a', description: 'Delete around...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Delete around ${obj.description}`, 
      command: `da${obj.command}`,
      preview: `da${obj.key}`
    })) },
  ],

  // Operator key bindings - Change
  'c': [
    { key: 'c', description: 'Change line', command: 'cc', group: 'Linewise', preview: 'cc' },
    { key: 'w', description: 'Change word', command: 'cw', group: 'Motion', preview: 'cw' },
    { key: 'W', description: 'Change WORD', command: 'cW', group: 'Motion', preview: 'cW' },
    { key: 'b', description: 'Change word backward', command: 'cb', group: 'Motion', preview: 'cb' },
    { key: 'e', description: 'Change to end of word', command: 'ce', group: 'Motion', preview: 'ce' },
    { key: '$', description: 'Change to end of line', command: 'c$', group: 'Motion', preview: 'c$' },
    { key: '0', description: 'Change to beginning of line', command: 'c0', group: 'Motion', preview: 'c0' },
    { key: '^', description: 'Change to first non-blank', command: 'c^', group: 'Motion', preview: 'c^' },
    { key: 'G', description: 'Change to end of file', command: 'cG', group: 'Motion', preview: 'cG' },
    { key: 'g', description: 'Change to beginning of file', command: 'cgg', group: 'Motion', preview: 'cgg' },
    { key: '{', description: 'Change paragraph backward', command: 'c{', group: 'Motion', preview: 'c{' },
    { key: '}', description: 'Change paragraph forward', command: 'c}', group: 'Motion', preview: 'c}' },
    { key: 'i', description: 'Change inside...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Change inside ${obj.description}`, 
      command: `ci${obj.command}`,
      preview: `ci${obj.key}`
    })) },
    { key: 'a', description: 'Change around...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Change around ${obj.description}`, 
      command: `ca${obj.command}`,
      preview: `ca${obj.key}`
    })) },
  ],

  // Operator key bindings - Yank (Copy)
  'y': [
    { key: 'y', description: 'Yank line', command: 'yy', group: 'Linewise', preview: 'yy' },
    { key: 'w', description: 'Yank word', command: 'yw', group: 'Motion', preview: 'yw' },
    { key: 'W', description: 'Yank WORD', command: 'yW', group: 'Motion', preview: 'yW' },
    { key: 'b', description: 'Yank word backward', command: 'yb', group: 'Motion', preview: 'yb' },
    { key: 'e', description: 'Yank to end of word', command: 'ye', group: 'Motion', preview: 'ye' },
    { key: '$', description: 'Yank to end of line', command: 'y$', group: 'Motion', preview: 'y$' },
    { key: '0', description: 'Yank to beginning of line', command: 'y0', group: 'Motion', preview: 'y0' },
    { key: '^', description: 'Yank to first non-blank', command: 'y^', group: 'Motion', preview: 'y^' },
    { key: 'G', description: 'Yank to end of file', command: 'yG', group: 'Motion', preview: 'yG' },
    { key: 'g', description: 'Yank to beginning of file', command: 'ygg', group: 'Motion', preview: 'ygg' },
    { key: '{', description: 'Yank paragraph backward', command: 'y{', group: 'Motion', preview: 'y{' },
    { key: '}', description: 'Yank paragraph forward', command: 'y}', group: 'Motion', preview: 'y}' },
    { key: 'i', description: 'Yank inside...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Yank inside ${obj.description}`, 
      command: `yi${obj.command}`,
      preview: `yi${obj.key}`
    })) },
    { key: 'a', description: 'Yank around...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Yank around ${obj.description}`, 
      command: `ya${obj.command}`,
      preview: `ya${obj.key}`
    })) },
  ],

  // Register operations
  '"': registers.map(reg => ({
    ...reg,
    description: `Use ${reg.description}`,
    command: `"${reg.command}`,
    group: 'Register',
    preview: reg.preview
  })),

  // Mark operations - Set marks
  'm': [
    { key: 'a', description: 'Set mark a', command: 'ma', group: 'Lowercase', preview: 'ma' },
    { key: 'b', description: 'Set mark b', command: 'mb', group: 'Lowercase', preview: 'mb' },
    { key: 'c', description: 'Set mark c', command: 'mc', group: 'Lowercase', preview: 'mc' },
    { key: 'd', description: 'Set mark d', command: 'md', group: 'Lowercase', preview: 'md' },
    { key: 'e', description: 'Set mark e', command: 'me', group: 'Lowercase', preview: 'me' },
    { key: 'f', description: 'Set mark f', command: 'mf', group: 'Lowercase', preview: 'mf' },
    { key: 'A', description: 'Set global mark A', command: 'mA', group: 'Global', preview: 'mA' },
    { key: 'B', description: 'Set global mark B', command: 'mB', group: 'Global', preview: 'mB' },
    { key: 'C', description: 'Set global mark C', command: 'mC', group: 'Global', preview: 'mC' },
  ],

  // Mark operations - Jump to line of mark
  "'": [
    { key: 'a', description: 'Jump to line of mark a', command: "'a", group: 'Lowercase', preview: "'a" },
    { key: 'b', description: 'Jump to line of mark b', command: "'b", group: 'Lowercase', preview: "'b" },
    { key: 'c', description: 'Jump to line of mark c', command: "'c", group: 'Lowercase', preview: "'c" },
    { key: 'd', description: 'Jump to line of mark d', command: "'d", group: 'Lowercase', preview: "'d" },
    { key: 'e', description: 'Jump to line of mark e', command: "'e", group: 'Lowercase', preview: "'e" },
    { key: 'f', description: 'Jump to line of mark f', command: "'f", group: 'Lowercase', preview: "'f" },
    { key: 'A', description: 'Jump to global mark A', command: "'A", group: 'Global', preview: "'A" },
    { key: 'B', description: 'Jump to global mark B', command: "'B", group: 'Global', preview: "'B" },
    { key: 'C', description: 'Jump to global mark C', command: "'C", group: 'Global', preview: "'C" },
    { key: "'", description: 'Jump to previous position', command: "''", group: 'Special', preview: "''" },
    { key: '.', description: 'Jump to last change', command: "'.", group: 'Special', preview: "'." },
    { key: '^', description: 'Jump to last insert', command: "'^", group: 'Special', preview: "'^" },
    { key: '[', description: 'Jump to start of last change/yank', command: "'[", group: 'Special', preview: "'[" },
    { key: ']', description: 'Jump to end of last change/yank', command: "']", group: 'Special', preview: "']" },
    { key: '<', description: 'Jump to start of last visual selection', command: "'<", group: 'Special', preview: "'<" },
    { key: '>', description: 'Jump to end of last visual selection', command: "'>", group: 'Special', preview: "'>" },
  ],

  // Mark operations - Jump to exact position of mark
  '`': [
    { key: 'a', description: 'Jump to position of mark a', command: '`a', group: 'Lowercase', preview: '`a' },
    { key: 'b', description: 'Jump to position of mark b', command: '`b', group: 'Lowercase', preview: '`b' },
    { key: 'c', description: 'Jump to position of mark c', command: '`c', group: 'Lowercase', preview: '`c' },
    { key: 'd', description: 'Jump to position of mark d', command: '`d', group: 'Lowercase', preview: '`d' },
    { key: 'e', description: 'Jump to position of mark e', command: '`e', group: 'Lowercase', preview: '`e' },
    { key: 'f', description: 'Jump to position of mark f', command: '`f', group: 'Lowercase', preview: '`f' },
    { key: 'A', description: 'Jump to global mark A', command: '`A', group: 'Global', preview: '`A' },
    { key: 'B', description: 'Jump to global mark B', command: '`B', group: 'Global', preview: '`B' },
    { key: 'C', description: 'Jump to global mark C', command: '`C', group: 'Global', preview: '`C' },
    { key: '`', description: 'Jump to previous position', command: '``', group: 'Special', preview: '``' },
    { key: '.', description: 'Jump to exact position of last change', command: '`.', group: 'Special', preview: '`.' },
    { key: '^', description: 'Jump to exact position of last insert', command: '`^', group: 'Special', preview: '`^' },
    { key: '[', description: 'Jump to exact start of last change/yank', command: '`[', group: 'Special', preview: '`[' },
    { key: ']', description: 'Jump to exact end of last change/yank', command: '`]', group: 'Special', preview: '`]' },
    { key: '<', description: 'Jump to exact start of last visual selection', command: '`<', group: 'Special', preview: '`<' },
    { key: '>', description: 'Jump to exact end of last visual selection', command: '`>', group: 'Special', preview: '`>' },
  ],

  // Macro operations - Record macro
  'q': [
    { key: 'a', description: 'Record macro to register a', command: 'qa', group: 'Record', preview: 'qa' },
    { key: 'b', description: 'Record macro to register b', command: 'qb', group: 'Record', preview: 'qb' },
    { key: 'c', description: 'Record macro to register c', command: 'qc', group: 'Record', preview: 'qc' },
    { key: 'd', description: 'Record macro to register d', command: 'qd', group: 'Record', preview: 'qd' },
    { key: 'e', description: 'Record macro to register e', command: 'qe', group: 'Record', preview: 'qe' },
    { key: 'q', description: 'Stop recording macro', command: 'q', group: 'Control', preview: 'q' },
  ],

  // Macro operations - Play macro
  '@': [
    { key: 'a', description: 'Play macro from register a', command: '@a', group: 'Play', preview: '@a' },
    { key: 'b', description: 'Play macro from register b', command: '@b', group: 'Play', preview: '@b' },
    { key: 'c', description: 'Play macro from register c', command: '@c', group: 'Play', preview: '@c' },
    { key: 'd', description: 'Play macro from register d', command: '@d', group: 'Play', preview: '@d' },
    { key: 'e', description: 'Play macro from register e', command: '@e', group: 'Play', preview: '@e' },
    { key: '@', description: 'Repeat last macro', command: '@@', group: 'Control', preview: '@@' },
  ],

  // Leader key bindings (Space as leader)
  ' ': [
    {
      key: 'f',
      description: 'Find and search',
      group: 'Find',
      mode: ['normal'],
      subKeys: [
        { key: 'f', description: 'Find file', command: ':e ' },
        { key: 'g', description: 'Search in files', command: '/' },
        { key: 'r', description: 'Recent files', command: ':oldfiles' },
        { key: 'b', description: 'Find in buffer', command: '/' },
        { key: 'l', description: 'Find line', command: ':' },
      ]
    },
    {
      key: 'b',
      description: 'Buffer operations',
      group: 'Buffer',
      mode: ['normal'],
      subKeys: [
        { key: 'b', description: 'Buffer list', command: ':ls' },
        { key: 'n', description: 'Next buffer', command: ':bn' },
        { key: 'p', description: 'Previous buffer', command: ':bp' },
        { key: 'd', description: 'Delete buffer', command: ':bd' },
        { key: 'f', description: 'First buffer', command: ':bfirst' },
        { key: 'l', description: 'Last buffer', command: ':blast' },
      ]
    },
    {
      key: 'w',
      description: 'Window operations',
      group: 'Window',
      mode: ['normal'],
      subKeys: [
        { key: 'h', description: 'Move to left window', command: '<C-w>h' },
        { key: 'j', description: 'Move to window below', command: '<C-w>j' },
        { key: 'k', description: 'Move to window above', command: '<C-w>k' },
        { key: 'l', description: 'Move to right window', command: '<C-w>l' },
        { key: 's', description: 'Split horizontally', command: ':sp' },
        { key: 'v', description: 'Split vertically', command: ':vsp' },
        { key: 'c', description: 'Close window', command: '<C-w>c' },
        { key: 'o', description: 'Close other windows', command: '<C-w>o' },
      ]
    },
    {
      key: 't',
      description: 'Tab operations',
      group: 'Tab',
      mode: ['normal'],
      subKeys: [
        { key: 'n', description: 'New tab', command: ':tabnew' },
        { key: 'c', description: 'Close tab', command: ':tabclose' },
        { key: 'o', description: 'Close other tabs', command: ':tabonly' },
        { key: 'h', description: 'Previous tab', command: 'gT' },
        { key: 'l', description: 'Next tab', command: 'gt' },
      ]
    },
    {
      key: 'c',
      description: 'Code operations',
      group: 'Code',
      mode: ['normal', 'visual'],
      subKeys: [
        { key: 'c', description: 'Comment line', command: 'gcc' },
        { key: 'b', description: 'Comment block', command: 'gcb' },
        { key: 'f', description: 'Format code', command: '=' },
        { key: 'i', description: 'Indent', command: '>>' },
        { key: 'u', description: 'Unindent', command: '<<' },
      ]
    },
    {
      key: 'g',
      description: 'Git operations',
      group: 'Git',
      mode: ['normal'],
      subKeys: [
        { key: 's', description: 'Git status', command: ':!git status' },
        { key: 'a', description: 'Git add', command: ':!git add %' },
        { key: 'c', description: 'Git commit', command: ':!git commit' },
        { key: 'd', description: 'Git diff', command: ':!git diff' },
        { key: 'l', description: 'Git log', command: ':!git log --oneline' },
        { key: 'p', description: 'Git push', command: ':!git push' },
      ]
    },
    {
      key: 'q',
      description: 'Quit and session',
      group: 'Quit',
      mode: ['normal'],
      subKeys: [
        { key: 'q', description: 'Quit', command: ':q' },
        { key: 'w', description: 'Save and quit', command: ':wq' },
        { key: 'a', description: 'Quit all', command: ':qa' },
        { key: 'f', description: 'Force quit', command: ':q!' },
      ]
    },
    {
      key: 'h',
      description: 'Help and info',
      group: 'Help',
      mode: ['normal'],
      subKeys: [
        { key: 'h', description: 'Help topics', command: ':help' },
        { key: 'k', description: 'Help for word under cursor', command: ':help <cword>' },
        { key: 'v', description: 'VIM version', command: ':version' },
        { key: 'm', description: 'Show marks', command: ':marks' },
        { key: 'r', description: 'Show registers', command: ':reg' },
        { key: '?', description: 'Which-key help', command: '?' },
      ]
    },
  ],

  // G prefix bindings
  'g': [
    {
      key: 'g',
      description: 'Go to first line',
      command: 'gg',
      mode: ['normal']
    },
    {
      key: 'f',
      description: 'Go to file under cursor',
      command: 'gf',
      mode: ['normal']
    },
    {
      key: 'd',
      description: 'Go to definition',
      command: 'gd',
      mode: ['normal']
    },
    {
      key: 'i',
      description: 'Go to last insert position',
      command: 'gi',
      mode: ['normal']
    },
    {
      key: 'v',
      description: 'Reselect last visual selection',
      command: 'gv',
      mode: ['normal']
    },
    {
      key: 'c',
      description: 'Comment line',
      command: 'gcc',
      mode: ['normal']
    },
    {
      key: 'j',
      description: 'Join lines without space',
      command: 'gJ',
      mode: ['normal']
    },
    {
      key: 'J',
      description: 'Join lines with space',
      command: 'gJ',
      mode: ['normal']
    },
    {
      key: 'u',
      description: 'Lowercase line',
      command: 'guu',
      mode: ['normal']
    },
    {
      key: 'U',
      description: 'Uppercase line',
      command: 'gUU',
      mode: ['normal']
    },
    {
      key: '~',
      description: 'Toggle case line',
      command: 'g~~',
      mode: ['normal']
    },
    {
      key: 'q',
      description: 'Format paragraph',
      command: 'gq',
      mode: ['normal']
    },
    {
      key: 'w',
      description: 'Format paragraph (no cursor move)',
      command: 'gw',
      mode: ['normal']
    },
    {
      key: 'h',
      description: 'Start select mode',
      command: 'gh',
      mode: ['normal']
    },
    {
      key: 'H',
      description: 'Start select line mode',
      command: 'gH',
      mode: ['normal']
    },
    {
      key: 'm',
      description: 'Go to middle of line',
      command: 'gm',
      mode: ['normal']
    },
    {
      key: 'M',
      description: 'Go to middle of screen line',
      command: 'gM',
      mode: ['normal']
    },
    {
      key: '0',
      description: 'Go to first screen column',
      command: 'g0',
      mode: ['normal']
    },
    {
      key: '$',
      description: 'Go to last screen column',
      command: 'g$',
      mode: ['normal']
    },
    {
      key: '^',
      description: 'Go to first non-blank screen column',
      command: 'g^',
      mode: ['normal']
    },
    {
      key: 'e',
      description: 'Go to end of previous word',
      command: 'ge',
      mode: ['normal']
    },
    {
      key: 'E',
      description: 'Go to end of previous WORD',
      command: 'gE',
      mode: ['normal']
    },
    {
      key: ';',
      description: 'Go to previous change location',
      command: 'g;',
      mode: ['normal']
    },
    {
      key: ',',
      description: 'Go to next change location',
      command: 'g,',
      mode: ['normal']
    },
    {
      key: 'f',
      description: 'Go to file under cursor',
      command: 'gf',
      mode: ['normal']
    },
    {
      key: 'd',
      description: 'Go to definition',
      command: 'gd',
      mode: ['normal']
    },
    {
      key: 'D',
      description: 'Go to global definition',
      command: 'gD',
      mode: ['normal']
    },
    {
      key: '*',
      description: 'Search word under cursor (partial match)',
      command: 'g*',
      mode: ['normal']
    },
    {
      key: '#',
      description: 'Search word under cursor backward (partial)',
      command: 'g#',
      mode: ['normal']
    },
    {
      key: 'u',
      description: 'Lowercase (with motion)',
      command: 'gu',
      mode: ['normal'],
      subKeys: motions.map(motion => ({
        ...motion,
        description: `Lowercase ${motion.description}`,
        command: `gu${motion.command}`,
        preview: `gu${motion.key}`
      }))
    },
    {
      key: 'U',
      description: 'Uppercase (with motion)',
      command: 'gU',
      mode: ['normal'],
      subKeys: motions.map(motion => ({
        ...motion,
        description: `Uppercase ${motion.description}`,
        command: `gU${motion.command}`,
        preview: `gU${motion.key}`
      }))
    },
    {
      key: '~',
      description: 'Toggle case (with motion)',
      command: 'g~',
      mode: ['normal'],
      subKeys: motions.map(motion => ({
        ...motion,
        description: `Toggle case ${motion.description}`,
        command: `g~${motion.command}`,
        preview: `g~${motion.key}`
      }))
    },
    {
      key: 'v',
      description: 'Reselect last visual selection',
      command: 'gv',
      mode: ['normal']
    },
    {
      key: 'n',
      description: 'Search forward (stay on match)',
      command: 'gn',
      mode: ['normal']
    },
    {
      key: 'N',
      description: 'Search backward (stay on match)',
      command: 'gN',
      mode: ['normal']
    },
  ],

  // Z prefix bindings  
  'z': [
    {
      key: 'z',
      description: 'Center cursor line',
      command: 'zz',
      mode: ['normal']
    },
    {
      key: 't',
      description: 'Move cursor line to top',
      command: 'zt',
      mode: ['normal']
    },
    {
      key: 'b',
      description: 'Move cursor line to bottom',
      command: 'zb',
      mode: ['normal']
    },
    {
      key: 'H',
      description: 'Scroll half screen to the right',
      command: 'zH',
      mode: ['normal']
    },
    {
      key: 'L',
      description: 'Scroll half screen to the left',
      command: 'zL',
      mode: ['normal']
    },
    {
      key: 'h',
      description: 'Scroll screen to the right',
      command: 'zh',
      mode: ['normal']
    },
    {
      key: 'l',
      description: 'Scroll screen to the left',
      command: 'zl',
      mode: ['normal']
    },
    {
      key: 'o',
      description: 'Open fold under cursor',
      command: 'zo',
      mode: ['normal']
    },
    {
      key: 'c',
      description: 'Close fold under cursor',
      command: 'zc',
      mode: ['normal']
    },
    {
      key: 'a',
      description: 'Toggle fold under cursor',
      command: 'za',
      mode: ['normal']
    },
    {
      key: 'O',
      description: 'Open all folds under cursor',
      command: 'zO',
      mode: ['normal']
    },
    {
      key: 'C',
      description: 'Close all folds under cursor',
      command: 'zC',
      mode: ['normal']
    },
    {
      key: 'R',
      description: 'Open all folds in file',
      command: 'zR',
      mode: ['normal']
    },
    {
      key: 'M',
      description: 'Close all folds in file',
      command: 'zM',
      mode: ['normal']
    },
    {
      key: 'f',
      description: 'Create fold (with motion)',
      command: 'zf',
      mode: ['normal']
    },
    {
      key: 'A',
      description: 'Toggle all folds under cursor',
      command: 'zA',
      mode: ['normal']
    },
    {
      key: 'v',
      description: 'Open folds for current line',
      command: 'zv',
      mode: ['normal']
    },
    {
      key: 'x',
      description: 'Update folds',
      command: 'zx',
      mode: ['normal']
    },
    {
      key: 'X',
      description: 'Undo manually opened/closed folds',
      command: 'zX',
      mode: ['normal']
    },
    {
      key: 'm',
      description: 'Fold more',
      command: 'zm',
      mode: ['normal']
    },
    {
      key: 'r',
      description: 'Fold less',
      command: 'zr',
      mode: ['normal']
    },
    {
      key: 'n',
      description: 'Fold none (disable)',
      command: 'zn',
      mode: ['normal']
    },
    {
      key: 'N',
      description: 'Fold normal (enable)',
      command: 'zN',
      mode: ['normal']
    },
    {
      key: 'i',
      description: 'Toggle folding',
      command: 'zi',
      mode: ['normal']
    },
    {
      key: 'f',
      description: 'Create fold for motion',
      command: 'zf',
      mode: ['normal']
    },
    {
      key: 'd',
      description: 'Delete fold',
      command: 'zd',
      mode: ['normal']
    },
    {
      key: 'D',
      description: 'Delete all folds',
      command: 'zD',
      mode: ['normal']
    },
    {
      key: 'E',
      description: 'Eliminate all folds in window',
      command: 'zE',
      mode: ['normal']
    },
    {
      key: 'h',
      description: 'Scroll right',
      command: 'zh',
      mode: ['normal']
    },
    {
      key: 'l',
      description: 'Scroll left',
      command: 'zl',
      mode: ['normal']
    },
    {
      key: 'H',
      description: 'Scroll half screen right',
      command: 'zH',
      mode: ['normal']
    },
    {
      key: 'L',
      description: 'Scroll half screen left',
      command: 'zL',
      mode: ['normal']
    },
  ],

  // Bracket prefix bindings
  ']': [
    {
      key: 'b',
      description: 'Next buffer',
      command: ':bn',
      mode: ['normal']
    },
    {
      key: 't',
      description: 'Next tab',
      command: 'gt',
      mode: ['normal']
    },
    {
      key: 'q',
      description: 'Next quickfix',
      command: ':cnext',
      mode: ['normal']
    },
    {
      key: 'l',
      description: 'Next location',
      command: ':lnext',
      mode: ['normal']
    },
    {
      key: 'm',
      description: 'Next method/function',
      command: ']m',
      mode: ['normal']
    },
    {
      key: '{',
      description: 'Next unmatched {',
      command: ']{',
      mode: ['normal']
    },
    {
      key: '}',
      description: 'Next unmatched }',
      command: ']}',
      mode: ['normal']
    },
  ],

  '[': [
    {
      key: 'b',
      description: 'Previous buffer',
      command: ':bp',
      mode: ['normal']
    },
    {
      key: 't',
      description: 'Previous tab',
      command: 'gT',
      mode: ['normal']
    },
    {
      key: 'q',
      description: 'Previous quickfix',
      command: ':cprev',
      mode: ['normal']
    },
    {
      key: 'l',
      description: 'Previous location',
      command: ':lprev',
      mode: ['normal']
    },
    {
      key: 'm',
      description: 'Previous method/function',
      command: '[m',
      mode: ['normal']
    },
    {
      key: '{',
      description: 'Previous unmatched {',
      command: '[{',
      mode: ['normal']
    },
    {
      key: '}',
      description: 'Previous unmatched }',
      command: '[}',
      mode: ['normal']
    },
  ],

  // Text object operations
  't': [
    { key: 'a', description: 'Till after a', command: 'ta', group: 'Motion', preview: 'ta' },
    { key: 'b', description: 'Till after b', command: 'tb', group: 'Motion', preview: 'tb' },
    { key: 'c', description: 'Till after c', command: 'tc', group: 'Motion', preview: 'tc' },
    { key: '"', description: 'Till after "', command: 't"', group: 'Motion', preview: 't"' },
    { key: "'", description: "Till after '", command: "t'", group: 'Motion', preview: "t'" },
    { key: ')', description: 'Till after )', command: 't)', group: 'Motion', preview: 't)' },
    { key: '}', description: 'Till after }', command: 't}', group: 'Motion', preview: 't}' },
  ],

  'T': [
    { key: 'a', description: 'Till before a', command: 'Ta', group: 'Motion', preview: 'Ta' },
    { key: 'b', description: 'Till before b', command: 'Tb', group: 'Motion', preview: 'Tb' },
    { key: 'c', description: 'Till before c', command: 'Tc', group: 'Motion', preview: 'Tc' },
    { key: '"', description: 'Till before "', command: 'T"', group: 'Motion', preview: 'T"' },
    { key: "'", description: "Till before '", command: "T'", group: 'Motion', preview: "T'" },
    { key: '(', description: 'Till before (', command: 'T(', group: 'Motion', preview: 'T(' },
    { key: '{', description: 'Till before {', command: 'T{', group: 'Motion', preview: 'T{' },
  ],

  'f': [
    { key: 'a', description: 'Find a', command: 'fa', group: 'Motion', preview: 'fa' },
    { key: 'b', description: 'Find b', command: 'fb', group: 'Motion', preview: 'fb' },
    { key: 'c', description: 'Find c', command: 'fc', group: 'Motion', preview: 'fc' },
    { key: '"', description: 'Find "', command: 'f"', group: 'Motion', preview: 'f"' },
    { key: "'", description: "Find '", command: "f'", group: 'Motion', preview: "f'" },
    { key: '(', description: 'Find (', command: 'f(', group: 'Motion', preview: 'f(' },
    { key: '{', description: 'Find {', command: 'f{', group: 'Motion', preview: 'f{' },
  ],

  'F': [
    { key: 'a', description: 'Find a backward', command: 'Fa', group: 'Motion', preview: 'Fa' },
    { key: 'b', description: 'Find b backward', command: 'Fb', group: 'Motion', preview: 'Fb' },
    { key: 'c', description: 'Find c backward', command: 'Fc', group: 'Motion', preview: 'Fc' },
    { key: '"', description: 'Find " backward', command: 'F"', group: 'Motion', preview: 'F"' },
    { key: "'", description: "Find ' backward", command: "F'", group: 'Motion', preview: "F'" },
    { key: ')', description: 'Find ) backward', command: 'F)', group: 'Motion', preview: 'F)' },
    { key: '}', description: 'Find } backward', command: 'F}', group: 'Motion', preview: 'F}' },
  ],

  // Window management commands
  'Ctrl-w': [
    { key: 's', description: 'Split window horizontally', command: 'Ctrl-w s', group: 'Split', preview: '<C-w>s' },
    { key: 'v', description: 'Split window vertically', command: 'Ctrl-w v', group: 'Split', preview: '<C-w>v' },
    { key: 'w', description: 'Switch to next window', command: 'Ctrl-w w', group: 'Navigate', preview: '<C-w>w' },
    { key: 'h', description: 'Go to left window', command: 'Ctrl-w h', group: 'Navigate', preview: '<C-w>h' },
    { key: 'j', description: 'Go to window below', command: 'Ctrl-w j', group: 'Navigate', preview: '<C-w>j' },
    { key: 'k', description: 'Go to window above', command: 'Ctrl-w k', group: 'Navigate', preview: '<C-w>k' },
    { key: 'l', description: 'Go to right window', command: 'Ctrl-w l', group: 'Navigate', preview: '<C-w>l' },
    { key: 'q', description: 'Close current window', command: 'Ctrl-w q', group: 'Close', preview: '<C-w>q' },
    { key: 'c', description: 'Close current window', command: 'Ctrl-w c', group: 'Close', preview: '<C-w>c' },
    { key: 'o', description: 'Close all other windows', command: 'Ctrl-w o', group: 'Close', preview: '<C-w>o' },
    { key: '=', description: 'Make all windows equal size', command: 'Ctrl-w =', group: 'Resize', preview: '<C-w>=' },
    { key: '_', description: 'Maximize window height', command: 'Ctrl-w _', group: 'Resize', preview: '<C-w>_' },
    { key: '|', description: 'Maximize window width', command: 'Ctrl-w |', group: 'Resize', preview: '<C-w>|' },
    { key: '+', description: 'Increase window height', command: 'Ctrl-w +', group: 'Resize', preview: '<C-w>+' },
    { key: '-', description: 'Decrease window height', command: 'Ctrl-w -', group: 'Resize', preview: '<C-w>-' },
    { key: '>', description: 'Increase window width', command: 'Ctrl-w >', group: 'Resize', preview: '<C-w>>' },
    { key: '<', description: 'Decrease window width', command: 'Ctrl-w <', group: 'Resize', preview: '<C-w><' },
    { key: 'H', description: 'Move window to far left', command: 'Ctrl-w H', group: 'Move', preview: '<C-w>H' },
    { key: 'J', description: 'Move window to bottom', command: 'Ctrl-w J', group: 'Move', preview: '<C-w>J' },
    { key: 'K', description: 'Move window to top', command: 'Ctrl-w K', group: 'Move', preview: '<C-w>K' },
    { key: 'L', description: 'Move window to far right', command: 'Ctrl-w L', group: 'Move', preview: '<C-w>L' },
    { key: 'r', description: 'Rotate windows down', command: 'Ctrl-w r', group: 'Move', preview: '<C-w>r' },
    { key: 'R', description: 'Rotate windows up', command: 'Ctrl-w R', group: 'Move', preview: '<C-w>R' },
    { key: 'x', description: 'Exchange with next window', command: 'Ctrl-w x', group: 'Move', preview: '<C-w>x' },
  ],

  // Indent/unindent operators
  '>': [
    { key: '>', description: 'Indent current line', command: '>>', group: 'Linewise', preview: '>>' },
    { key: 'w', description: 'Indent word', command: '>w', group: 'Motion', preview: '>w' },
    { key: 'W', description: 'Indent WORD', command: '>W', group: 'Motion', preview: '>W' },
    { key: '$', description: 'Indent to end of line', command: '>$', group: 'Motion', preview: '>$' },
    { key: '0', description: 'Indent to beginning of line', command: '>0', group: 'Motion', preview: '>0' },
    { key: '{', description: 'Indent paragraph backward', command: '>{', group: 'Motion', preview: '>{' },
    { key: '}', description: 'Indent paragraph forward', command: '>}', group: 'Motion', preview: '>}' },
    { key: 'G', description: 'Indent to end of file', command: '>G', group: 'Motion', preview: '>G' },
    { key: 'g', description: 'Indent to beginning of file', command: '>gg', group: 'Motion', preview: '>gg' },
    { key: 'i', description: 'Indent inside...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Indent inside ${obj.description}`, 
      command: `>i${obj.command}`,
      preview: `>i${obj.key}`
    })) },
    { key: 'a', description: 'Indent around...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Indent around ${obj.description}`, 
      command: `>a${obj.command}`,
      preview: `>a${obj.key}`
    })) },
  ],

  '<': [
    { key: '<', description: 'Unindent current line', command: '<<', group: 'Linewise', preview: '<<' },
    { key: 'w', description: 'Unindent word', command: '<w', group: 'Motion', preview: '<w' },
    { key: 'W', description: 'Unindent WORD', command: '<W', group: 'Motion', preview: '<W' },
    { key: '$', description: 'Unindent to end of line', command: '<$', group: 'Motion', preview: '<$' },
    { key: '0', description: 'Unindent to beginning of line', command: '<0', group: 'Motion', preview: '<0' },
    { key: '{', description: 'Unindent paragraph backward', command: '<{', group: 'Motion', preview: '<{' },
    { key: '}', description: 'Unindent paragraph forward', command: '<}', group: 'Motion', preview: '<}' },
    { key: 'G', description: 'Unindent to end of file', command: '<G', group: 'Motion', preview: '<G' },
    { key: 'g', description: 'Unindent to beginning of file', command: '<gg', group: 'Motion', preview: '<gg' },
    { key: 'i', description: 'Unindent inside...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Unindent inside ${obj.description}`, 
      command: `<i${obj.command}`,
      preview: `<i${obj.key}`
    })) },
    { key: 'a', description: 'Unindent around...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Unindent around ${obj.description}`, 
      command: `<a${obj.command}`,
      preview: `<a${obj.key}`
    })) },
  ],

  // Command mode helpers
  ':': [
    { key: 'w', description: 'Save file', command: ':w', group: 'File', preview: ':w' },
    { key: 'q', description: 'Quit', command: ':q', group: 'File', preview: ':q' },
    { key: 'x', description: 'Save and quit', command: ':x', group: 'File', preview: ':x' },
    { key: 'e', description: 'Edit file...', command: ':e ', group: 'File', preview: ':e' },
    { key: 'b', description: 'Buffer operations...', group: 'Buffer', subKeys: [
      { key: 'n', description: 'Next buffer', command: ':bn', preview: ':bn' },
      { key: 'p', description: 'Previous buffer', command: ':bp', preview: ':bp' },
      { key: 'd', description: 'Delete buffer', command: ':bd', preview: ':bd' },
      { key: 'l', description: 'List buffers', command: ':ls', preview: ':ls' },
    ]},
    { key: 's', description: 'Substitute/Replace...', command: ':s/', group: 'Edit', preview: ':s/' },
    { key: '%', description: 'Substitute all in file...', command: ':%s/', group: 'Edit', preview: ':%s/' },
    { key: 'n', description: 'Turn off search highlight', command: ':noh', group: 'Search', preview: ':noh' },
    { key: 'h', description: 'Help...', command: ':h ', group: 'Help', preview: ':h' },
    { key: 'v', description: 'Vertical split', command: ':vsp', group: 'Window', preview: ':vsp' },
    { key: 'S', description: 'Horizontal split', command: ':sp', group: 'Window', preview: ':sp' },
    { key: 'o', description: 'Only this window', command: ':only', group: 'Window', preview: ':only' },
    { key: 't', description: 'Tab operations...', group: 'Tab', subKeys: [
      { key: 'n', description: 'New tab', command: ':tabnew', preview: ':tabnew' },
      { key: 'c', description: 'Close tab', command: ':tabclose', preview: ':tabclose' },
      { key: 'o', description: 'Only this tab', command: ':tabonly', preview: ':tabonly' },
    ]},
    { key: 'r', description: 'Read file...', command: ':r ', group: 'File', preview: ':r' },
    { key: '!', description: 'Shell command...', command: ':!', group: 'Shell', preview: ':!' },
    { key: 'm', description: 'Move line to...', command: ':m ', group: 'Edit', preview: ':m' },
    { key: 'c', description: 'Copy line to...', command: ':t ', group: 'Edit', preview: ':t' },
  ],

  // Auto-format operator
  '=': [
    { key: '=', description: 'Auto-indent current line', command: '==', group: 'Linewise', preview: '==' },
    { key: 'w', description: 'Auto-indent word', command: '=w', group: 'Motion', preview: '=w' },
    { key: 'W', description: 'Auto-indent WORD', command: '=W', group: 'Motion', preview: '=W' },
    { key: '{', description: 'Auto-indent paragraph backward', command: '={', group: 'Motion', preview: '={' },
    { key: '}', description: 'Auto-indent paragraph forward', command: '=}', group: 'Motion', preview: '=}' },
    { key: 'G', description: 'Auto-indent to end of file', command: '=G', group: 'Motion', preview: '=G' },
    { key: 'g', description: 'Auto-indent to beginning of file', command: '=gg', group: 'Motion', preview: '=gg' },
    { key: 'i', description: 'Auto-indent inside...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Auto-indent inside ${obj.description}`, 
      command: `=i${obj.command}`,
      preview: `=i${obj.key}`
    })) },
    { key: 'a', description: 'Auto-indent around...', group: 'Text Object', subKeys: textObjects.map(obj => ({
      ...obj, 
      description: `Auto-indent around ${obj.description}`, 
      command: `=a${obj.command}`,
      preview: `=a${obj.key}`
    })) },
  ],
}

// Function to get available keys for a given prefix
export function getAvailableKeys(prefix: string, mode: string = 'normal'): KeyBinding[] {
  const keys = keyBindings[prefix] || []
  return keys.filter(key => 
    !key.mode || key.mode.includes(mode)
  )
}

// Function to get sub-keys for a nested command
export function getSubKeys(prefix: string, key: string, mode: string = 'normal'): KeyBinding[] {
  const prefixKeys = keyBindings[prefix] || []
  const parentKey = prefixKeys.find(k => k.key === key)
  
  if (parentKey && parentKey.subKeys) {
    return parentKey.subKeys.filter(subKey => 
      !subKey.mode || subKey.mode.includes(mode)
    )
  }
  
  return []
}

// Function to check if a key sequence has available completions
export function hasAvailableKeys(sequence: string, mode: string = 'normal'): boolean {
  if (sequence.length === 0) return false
  
  if (sequence.length === 1) {
    const available = getAvailableKeys(sequence, mode)
    return available.length > 0
  }
  
  // Handle multi-character sequences (e.g., " f" for leader + f)
  const prefix = sequence.slice(0, -1)
  const lastKey = sequence.slice(-1)
  
  const subKeys = getSubKeys(prefix, lastKey, mode)
  return subKeys.length > 0
}