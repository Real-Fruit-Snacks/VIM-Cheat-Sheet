import { type VimDemoData } from '../components/VimDemo'

export const vimDemos: VimDemoData[] = [
  {
    id: 'refactor-function',
    title: 'Refactoring a JavaScript Function',
    description: 'Learn how to quickly refactor code by extracting variables, renaming functions, and improving readability.',
    category: 'developer',
    difficulty: 'intermediate',
    timeToMaster: '5-10 min',
    useCase: 'Code refactoring',
    steps: [
      {
        command: 'f(',
        description: 'Navigate to function parameters',
        before: {
          text: [
            'function calculateTotal(items) {',
            '  let sum = 0;',
            '  for (let i = 0; i < items.length; i++) {',
            '    sum += items[i].price * items[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Position cursor at the start of function'
        },
        after: {
          text: [
            'function calculateTotal(items) {',
            '  let sum = 0;',
            '  for (let i = 0; i < items.length; i++) {',
            '    sum += items[i].price * items[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 17,
          mode: 'normal',
          description: 'Cursor moves to opening parenthesis'
        },
        explanation: 'Use f( to quickly jump to the opening parenthesis of function parameters.'
      },
      {
        command: 'ciw',
        description: 'Change parameter name',
        before: {
          text: [
            'function calculateTotal(items) {',
            '  let sum = 0;',
            '  for (let i = 0; i < items.length; i++) {',
            '    sum += items[i].price * items[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 18,
          mode: 'normal',
          description: 'Position cursor on "items" parameter'
        },
        after: {
          text: [
            'function calculateTotal(products) {',
            '  let sum = 0;',
            '  for (let i = 0; i < items.length; i++) {',
            '    sum += items[i].price * items[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 26,
          mode: 'insert',
          description: 'Parameter renamed to "products"'
        },
        explanation: 'ciw deletes the current word and enters insert mode to type the new parameter name.'
      },
      {
        command: '<Esc>',
        description: 'Return to normal mode',
        before: {
          text: [
            'function calculateTotal(products) {',
            '  let sum = 0;',
            '  for (let i = 0; i < items.length; i++) {',
            '    sum += items[i].price * items[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 26,
          mode: 'insert',
          description: 'Currently in insert mode'
        },
        after: {
          text: [
            'function calculateTotal(products) {',
            '  let sum = 0;',
            '  for (let i = 0; i < items.length; i++) {',
            '    sum += items[i].price * items[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 25,
          mode: 'normal',
          description: 'Back in normal mode'
        },
        explanation: 'Press Escape to return to normal mode and continue with navigation commands.'
      },
      {
        command: ':%s/items/products/g',
        description: 'Replace all occurrences',
        before: {
          text: [
            'function calculateTotal(products) {',
            '  let sum = 0;',
            '  for (let i = 0; i < items.length; i++) {',
            '    sum += items[i].price * items[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 25,
          mode: 'normal',
          description: 'Need to update all "items" references'
        },
        after: {
          text: [
            'function calculateTotal(products) {',
            '  let sum = 0;',
            '  for (let i = 0; i < products.length; i++) {',
            '    sum += products[i].price * products[i].quantity;',
            '  }',
            '  return sum;',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 25,
          mode: 'normal',
          description: 'All "items" replaced with "products"'
        },
        explanation: 'Use global search and replace to update all variable references consistently throughout the function.'
      }
    ]
  },
  {
    id: 'comment-block',
    title: 'Quick Code Commenting',
    description: 'Master the art of quickly commenting and uncommenting blocks of code for debugging and documentation.',
    category: 'developer',
    difficulty: 'beginner',
    timeToMaster: '2-5 min',
    useCase: 'Code debugging',
    steps: [
      {
        command: 'V',
        description: 'Enter visual line mode',
        before: {
          text: [
            'function debugFunction() {',
            '  console.log("Debug start");',
            '  const result = complexCalculation();',
            '  console.log("Result:", result);',
            '  return result;',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 2,
          mode: 'normal',
          description: 'Start selecting lines to comment'
        },
        after: {
          text: [
            'function debugFunction() {',
            '  console.log("Debug start");',
            '  const result = complexCalculation();',
            '  console.log("Result:", result);',
            '  return result;',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 2,
          mode: 'visual-line',
          description: 'Visual line mode activated',
          visualEnd: { row: 1, col: 2 }
        },
        explanation: 'V enters visual line mode, allowing you to select entire lines for batch operations.'
      },
      {
        command: '2j',
        description: 'Extend selection downward',
        before: {
          text: [
            'function debugFunction() {',
            '  console.log("Debug start");',
            '  const result = complexCalculation();',
            '  console.log("Result:", result);',
            '  return result;',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 2,
          mode: 'visual-line',
          description: 'Currently selecting one line',
          visualEnd: { row: 1, col: 2 }
        },
        after: {
          text: [
            'function debugFunction() {',
            '  console.log("Debug start");',
            '  const result = complexCalculation();',
            '  console.log("Result:", result);',
            '  return result;',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 2,
          mode: 'visual-line',
          description: 'Three lines selected for commenting',
          visualEnd: { row: 1, col: 2 }
        },
        explanation: '2j moves down 2 lines while extending the visual selection to include multiple lines.'
      },
      {
        command: 'I// <Esc>',
        description: 'Comment the selected lines',
        before: {
          text: [
            'function debugFunction() {',
            '  console.log("Debug start");',
            '  const result = complexCalculation();',
            '  console.log("Result:", result);',
            '  return result;',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 2,
          mode: 'visual-line',
          description: 'Lines selected for commenting',
          visualEnd: { row: 1, col: 2 }
        },
        after: {
          text: [
            'function debugFunction() {',
            '  // console.log("Debug start");',
            '  // const result = complexCalculation();',
            '  // console.log("Result:", result);',
            '  return result;',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 2,
          mode: 'normal',
          description: 'Lines commented out with //'
        },
        explanation: 'I enters insert mode at the beginning of each selected line, then // adds the comment and Esc applies it to all selected lines.'
      }
    ]
  },
  {
    id: 'markdown-formatting',
    title: 'Fast Markdown Formatting',
    description: 'Transform plain text into beautifully formatted markdown with efficient VIM techniques.',
    category: 'writer',
    difficulty: 'beginner',
    timeToMaster: '3-7 min',
    useCase: 'Documentation writing',
    steps: [
      {
        command: 'I# <Esc>',
        description: 'Create main heading',
        before: {
          text: [
            'Project Documentation',
            '',
            'This project does amazing things',
            'Features include:',
            'Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Convert first line to heading'
        },
        after: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            'Features include:',
            'Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 0,
          cursorCol: 1,
          mode: 'normal',
          description: 'Main heading created'
        },
        explanation: 'I inserts at the beginning of the line, add # and space for a markdown heading, then Esc to return to normal mode.'
      },
      {
        command: '3j',
        description: 'Navigate to features line',
        before: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            'Features include:',
            'Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 0,
          cursorCol: 1,
          mode: 'normal',
          description: 'Move to the features line'
        },
        after: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            'Features include:',
            'Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 3,
          cursorCol: 1,
          mode: 'normal',
          description: 'Positioned at features line'
        },
        explanation: '3j moves down 3 lines to reach the "Features include:" line for formatting.'
      },
      {
        command: 'I## <Esc>',
        description: 'Create subheading',
        before: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            'Features include:',
            'Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 3,
          cursorCol: 1,
          mode: 'normal',
          description: 'Convert to subheading'
        },
        after: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            '## Features include:',
            'Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 3,
          cursorCol: 2,
          mode: 'normal',
          description: 'Subheading created'
        },
        explanation: 'I## adds a second-level heading marker for better document structure.'
      },
      {
        command: 'j0I- <Esc>',
        description: 'Create first list item',
        before: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            '## Features include:',
            'Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 3,
          cursorCol: 2,
          mode: 'normal',
          description: 'Format first feature as list item'
        },
        after: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            '## Features include:',
            '- Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 4,
          cursorCol: 1,
          mode: 'normal',
          description: 'First list item created'
        },
        explanation: 'j moves down, 0 goes to start of line, I- adds bullet point marker.'
      },
      {
        command: 'j.',
        description: 'Repeat for next item',
        before: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            '## Features include:',
            '- Fast processing',
            'Easy to use',
            'Well documented'
          ],
          cursorRow: 4,
          cursorCol: 1,
          mode: 'normal',
          description: 'Move to next line and repeat'
        },
        after: {
          text: [
            '# Project Documentation',
            '',
            'This project does amazing things',
            '## Features include:',
            '- Fast processing',
            '- Easy to use',
            'Well documented'
          ],
          cursorRow: 5,
          cursorCol: 1,
          mode: 'normal',
          description: 'Second list item created'
        },
        explanation: 'j moves down one line, . repeats the last command (I- <Esc>) to create another bullet point.'
      }
    ]
  },
  {
    id: 'csv-cleanup',
    title: 'CSV Data Cleanup',
    description: 'Efficiently clean and format messy CSV data using VIM\'s powerful text manipulation features.',
    category: 'general',
    difficulty: 'intermediate',
    timeToMaster: '10-15 min',
    useCase: 'Data processing',
    steps: [
      {
        command: ':%s/ *, */,/g',
        description: 'Normalize comma spacing',
        before: {
          text: [
            'name , age,  city   , country',
            'John Smith , 25,San Francisco,USA',
            'Jane Doe,30,  New York , USA',
            'Bob Johnson , 35, London, UK'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Inconsistent spacing around commas'
        },
        after: {
          text: [
            'name,age,city,country',
            'John Smith,25,San Francisco,USA',
            'Jane Doe,30,New York,USA',
            'Bob Johnson,35,London,UK'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Consistent comma formatting'
        },
        explanation: 'Global search and replace removes extra spaces around commas to normalize CSV format.'
      },
      {
        command: 'gg',
        description: 'Go to first line',
        before: {
          text: [
            'name,age,city,country',
            'John Smith,25,San Francisco,USA',
            'Jane Doe,30,New York,USA',
            'Bob Johnson,35,London,UK'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Position at start of file'
        },
        after: {
          text: [
            'name,age,city,country',
            'John Smith,25,San Francisco,USA',
            'Jane Doe,30,New York,USA',
            'Bob Johnson,35,London,UK'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'At first line (header row)'
        },
        explanation: 'gg moves to the first line of the file to work with the header row.'
      },
      {
        command: 'VU',
        description: 'Uppercase header row',
        before: {
          text: [
            'name,age,city,country',
            'John Smith,25,San Francisco,USA',
            'Jane Doe,30,New York,USA',
            'Bob Johnson,35,London,UK'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Make header row uppercase'
        },
        after: {
          text: [
            'NAME,AGE,CITY,COUNTRY',
            'John Smith,25,San Francisco,USA',
            'Jane Doe,30,New York,USA',
            'Bob Johnson,35,London,UK'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Header row now uppercase'
        },
        explanation: 'V selects the entire line, U converts all selected text to uppercase for a proper CSV header.'
      },
      {
        command: 'j0f,',
        description: 'Navigate to first data comma',
        before: {
          text: [
            'NAME,AGE,CITY,COUNTRY',
            'John Smith,25,San Francisco,USA',
            'Jane Doe,30,New York,USA',
            'Bob Johnson,35,London,UK'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Move to first data row'
        },
        after: {
          text: [
            'NAME,AGE,CITY,COUNTRY',
            'John Smith,25,San Francisco,USA',
            'Jane Doe,30,New York,USA',
            'Bob Johnson,35,London,UK'
          ],
          cursorRow: 1,
          cursorCol: 10,
          mode: 'normal',
          description: 'Positioned at first comma in data'
        },
        explanation: 'j moves down one line, 0 goes to start, f, finds the first comma for field navigation.'
      }
    ]
  },
  {
    id: 'code-navigation',
    title: 'Lightning-Fast Code Navigation',
    description: 'Master VIM\'s movement commands to navigate through code at the speed of thought.',
    category: 'developer',
    difficulty: 'advanced',
    timeToMaster: '15-20 min',
    useCase: 'Code exploration',
    steps: [
      {
        command: '/function<CR>',
        description: 'Search for function keyword',
        before: {
          text: [
            'class Calculator {',
            '  constructor() {',
            '    this.history = [];',
            '  }',
            '',
            '  function add(a, b) {',
            '    const result = a + b;',
            '    this.history.push({op: "add", result});',
            '    return result;',
            '  }',
            '',
            '  function multiply(x, y) {',
            '    const result = x * y;',
            '    return result;',
            '  }',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Search for function definitions'
        },
        after: {
          text: [
            'class Calculator {',
            '  constructor() {',
            '    this.history = [];',
            '  }',
            '',
            '  function add(a, b) {',
            '    const result = a + b;',
            '    this.history.push({op: "add", result});',
            '    return result;',
            '  }',
            '',
            '  function multiply(x, y) {',
            '    const result = x * y;',
            '    return result;',
            '  }',
            '}'
          ],
          cursorRow: 5,
          cursorCol: 2,
          mode: 'normal',
          description: 'Found first function definition'
        },
        explanation: '/function searches for the next occurrence of "function", Enter confirms the search.'
      },
      {
        command: 'n',
        description: 'Find next function',
        before: {
          text: [
            'class Calculator {',
            '  constructor() {',
            '    this.history = [];',
            '  }',
            '',
            '  function add(a, b) {',
            '    const result = a + b;',
            '    this.history.push({op: "add", result});',
            '    return result;',
            '  }',
            '',
            '  function multiply(x, y) {',
            '    const result = x * y;',
            '    return result;',
            '  }',
            '}'
          ],
          cursorRow: 5,
          cursorCol: 2,
          mode: 'normal',
          description: 'At first function, find next'
        },
        after: {
          text: [
            'class Calculator {',
            '  constructor() {',
            '    this.history = [];',
            '  }',
            '',
            '  function add(a, b) {',
            '    const result = a + b;',
            '    this.history.push({op: "add", result});',
            '    return result;',
            '  }',
            '',
            '  function multiply(x, y) {',
            '    const result = x * y;',
            '    return result;',
            '  }',
            '}'
          ],
          cursorRow: 11,
          cursorCol: 2,
          mode: 'normal',
          description: 'Jumped to next function'
        },
        explanation: 'n repeats the last search, jumping to the next occurrence of "function".'
      },
      {
        command: '%',
        description: 'Jump to matching bracket',
        before: {
          text: [
            'class Calculator {',
            '  constructor() {',
            '    this.history = [];',
            '  }',
            '',
            '  function add(a, b) {',
            '    const result = a + b;',
            '    this.history.push({op: "add", result});',
            '    return result;',
            '  }',
            '',
            '  function multiply(x, y) {',
            '    const result = x * y;',
            '    return result;',
            '  }',
            '}'
          ],
          cursorRow: 11,
          cursorCol: 19,
          mode: 'normal',
          description: 'Position cursor on opening parenthesis'
        },
        after: {
          text: [
            'class Calculator {',
            '  constructor() {',
            '    this.history = [];',
            '  }',
            '',
            '  function add(a, b) {',
            '    const result = a + b;',
            '    this.history.push({op: "add", result});',
            '    return result;',
            '  }',
            '',
            '  function multiply(x, y) {',
            '    const result = x * y;',
            '    return result;',
            '  }',
            '}'
          ],
          cursorRow: 11,
          cursorCol: 24,
          mode: 'normal',
          description: 'Jumped to matching closing parenthesis'
        },
        explanation: '% jumps between matching brackets, parentheses, or braces - essential for code navigation.'
      }
    ]
  },
  {
    id: 'text-objects',
    title: 'Mastering Text Objects',
    description: 'Use VIM\'s powerful text objects to select and manipulate code structures efficiently.',
    category: 'developer',
    difficulty: 'advanced',
    timeToMaster: '20-30 min',
    useCase: 'Precise editing',
    steps: [
      {
        command: 'ci"',
        description: 'Change inside quotes',
        before: {
          text: [
            'const message = "Hello, World!";',
            'const greeting = "Welcome to VIM";',
            'console.log("Debug info");'
          ],
          cursorRow: 0,
          cursorCol: 20,
          mode: 'normal',
          description: 'Cursor anywhere inside the quotes'
        },
        after: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = "Welcome to VIM";',
            'console.log("Debug info");'
          ],
          cursorRow: 0,
          cursorCol: 25,
          mode: 'insert',
          description: 'Content inside quotes changed'
        },
        explanation: 'ci" changes everything inside the nearest quotes, automatically finding the boundaries.'
      },
      {
        command: '<Esc>j',
        description: 'Move to next line',
        before: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = "Welcome to VIM";',
            'console.log("Debug info");'
          ],
          cursorRow: 0,
          cursorCol: 25,
          mode: 'insert',
          description: 'Exit insert mode and move down'
        },
        after: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = "Welcome to VIM";',
            'console.log("Debug info");'
          ],
          cursorRow: 1,
          cursorCol: 25,
          mode: 'normal',
          description: 'Positioned at second line'
        },
        explanation: 'Esc exits insert mode, j moves to the next line for the next operation.'
      },
      {
        command: 'da"',
        description: 'Delete around quotes',
        before: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = "Welcome to VIM";',
            'console.log("Debug info");'
          ],
          cursorRow: 1,
          cursorCol: 25,
          mode: 'normal',
          description: 'Delete the entire quoted string'
        },
        after: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = ;',
            'console.log("Debug info");'
          ],
          cursorRow: 1,
          cursorCol: 17,
          mode: 'normal',
          description: 'Quotes and content deleted'
        },
        explanation: 'da" deletes around quotes - including the quotes themselves, not just the content inside.'
      },
      {
        command: 'j0f(',
        description: 'Navigate to function call',
        before: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = ;',
            'console.log("Debug info");'
          ],
          cursorRow: 1,
          cursorCol: 17,
          mode: 'normal',
          description: 'Move to function parentheses'
        },
        after: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = ;',
            'console.log("Debug info");'
          ],
          cursorRow: 2,
          cursorCol: 11,
          mode: 'normal',
          description: 'Positioned at opening parenthesis'
        },
        explanation: 'j moves down, 0 goes to start of line, f( finds the opening parenthesis of the function call.'
      },
      {
        command: 'ci(',
        description: 'Change inside parentheses',
        before: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = ;',
            'console.log("Debug info");'
          ],
          cursorRow: 2,
          cursorCol: 11,
          mode: 'normal',
          description: 'Change function arguments'
        },
        after: {
          text: [
            'const message = "Hello, VIM!";',
            'const greeting = ;',
            'console.log("VIM is amazing!");'
          ],
          cursorRow: 2,
          cursorCol: 28,
          mode: 'insert',
          description: 'Function arguments changed'
        },
        explanation: 'ci( changes everything inside parentheses, perfect for updating function arguments.'
      }
    ]
  }
]