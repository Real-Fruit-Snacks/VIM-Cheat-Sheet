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
  },
  {
    id: 'basic-line-editing',
    title: 'Basic Line Editing',
    description: 'Master fundamental line-level operations for quick text editing and document creation.',
    category: 'writer',
    difficulty: 'beginner',
    timeToMaster: '2-3 min',
    useCase: 'Quick text editing',
    steps: [
      {
        command: 'A',
        description: 'Append to end of line',
        before: {
          text: [
            'Hello World',
            'This is a test',
            'Final line'
          ],
          cursorRow: 0,
          cursorCol: 5,
          mode: 'normal',
          description: 'Position cursor in middle of first line'
        },
        after: {
          text: [
            'Hello World!',
            'This is a test',
            'Final line'
          ],
          cursorRow: 0,
          cursorCol: 12,
          mode: 'insert',
          description: 'Cursor at end of line in insert mode'
        },
        explanation: 'A moves to the end of the current line and enters insert mode, perfect for adding content at line endings.'
      },
      {
        command: '<Esc>o',
        description: 'Create new line below',
        before: {
          text: [
            'Hello World!',
            'This is a test',
            'Final line'
          ],
          cursorRow: 0,
          cursorCol: 12,
          mode: 'insert',
          description: 'Currently in insert mode at end of first line'
        },
        after: {
          text: [
            'Hello World!',
            'New line added',
            'This is a test',
            'Final line'
          ],
          cursorRow: 1,
          cursorCol: 14,
          mode: 'insert',
          description: 'New line created with cursor in insert mode'
        },
        explanation: 'Esc returns to normal mode, then o creates a new line below the current line and enters insert mode.'
      },
      {
        command: '<Esc>dd',
        description: 'Delete entire line',
        before: {
          text: [
            'Hello World!',
            'New line added',
            'This is a test',
            'Final line'
          ],
          cursorRow: 1,
          cursorCol: 14,
          mode: 'insert',
          description: 'Delete the line we just created'
        },
        after: {
          text: [
            'Hello World!',
            'This is a test',
            'Final line'
          ],
          cursorRow: 1,
          cursorCol: 0,
          mode: 'normal',
          description: 'Line deleted, cursor on next line'
        },
        explanation: 'Esc exits insert mode, dd deletes the entire current line and moves cursor to the beginning of the next line.'
      }
    ]
  },
  {
    id: 'word-operations',
    title: 'Essential Word Operations',
    description: 'Learn core word-based editing commands for efficient text manipulation.',
    category: 'general',
    difficulty: 'beginner',
    timeToMaster: '3-5 min',
    useCase: 'Text editing',
    steps: [
      {
        command: 'dw',
        description: 'Delete word',
        before: {
          text: [
            'The quick brown fox jumps',
            'over the lazy dog'
          ],
          cursorRow: 0,
          cursorCol: 4,
          mode: 'normal',
          description: 'Position cursor at start of "quick"'
        },
        after: {
          text: [
            'The brown fox jumps',
            'over the lazy dog'
          ],
          cursorRow: 0,
          cursorCol: 4,
          mode: 'normal',
          description: 'Word "quick " deleted'
        },
        explanation: 'dw deletes from cursor position to the start of the next word, including the trailing space.'
      },
      {
        command: 'cw',
        description: 'Change word',
        before: {
          text: [
            'The brown fox jumps',
            'over the lazy dog'
          ],
          cursorRow: 0,
          cursorCol: 4,
          mode: 'normal',
          description: 'Position cursor at start of "brown"'
        },
        after: {
          text: [
            'The red fox jumps',
            'over the lazy dog'
          ],
          cursorRow: 0,
          cursorCol: 7,
          mode: 'insert',
          description: 'Word changed to "red" in insert mode'
        },
        explanation: 'cw deletes the word from cursor position and enters insert mode for replacement text.'
      },
      {
        command: '<Esc>yiw',
        description: 'Copy inner word',
        before: {
          text: [
            'The red fox jumps',
            'over the lazy dog'
          ],
          cursorRow: 0,
          cursorCol: 7,
          mode: 'insert',
          description: 'Position cursor on "fox" to copy it'
        },
        after: {
          text: [
            'The red fox jumps',
            'over the lazy dog'
          ],
          cursorRow: 0,
          cursorCol: 8,
          mode: 'normal',
          description: 'Word "fox" copied to register'
        },
        explanation: 'Esc exits insert mode, yiw copies the entire word under the cursor without whitespace.'
      }
    ]
  },
  {
    id: 'quick-navigation',
    title: 'Quick File Navigation',
    description: 'Master essential movement commands for rapid navigation through code files.',
    category: 'developer',
    difficulty: 'beginner',
    timeToMaster: '2-4 min',
    useCase: 'Code navigation',
    steps: [
      {
        command: 'gg',
        description: 'Jump to top of file',
        before: {
          text: [
            'import React from "react"',
            'import { useState } from "react"',
            '',
            'function App() {',
            '  const [count, setCount] = useState(0)',
            '  return <div>{count}</div>',
            '}',
            '',
            'export default App'
          ],
          cursorRow: 4,
          cursorCol: 15,
          mode: 'normal',
          description: 'Start from middle of file'
        },
        after: {
          text: [
            'import React from "react"',
            'import { useState } from "react"',
            '',
            'function App() {',
            '  const [count, setCount] = useState(0)',
            '  return <div>{count}</div>',
            '}',
            '',
            'export default App'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Cursor at beginning of first line'
        },
        explanation: 'gg quickly jumps to the first line of the file, essential for file navigation.'
      },
      {
        command: '/useState',
        description: 'Search for text',
        before: {
          text: [
            'import React from "react"',
            'import { useState } from "react"',
            '',
            'function App() {',
            '  const [count, setCount] = useState(0)',
            '  return <div>{count}</div>',
            '}',
            '',
            'export default App'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Search for useState hook'
        },
        after: {
          text: [
            'import React from "react"',
            'import { useState } from "react"',
            '',
            'function App() {',
            '  const [count, setCount] = useState(0)',
            '  return <div>{count}</div>',
            '}',
            '',
            'export default App'
          ],
          cursorRow: 1,
          cursorCol: 9,
          mode: 'normal',
          description: 'Cursor positioned at first useState occurrence'
        },
        explanation: '/useState searches forward for the text "useState" and positions cursor at the first match.'
      },
      {
        command: 'G',
        description: 'Jump to end of file',
        before: {
          text: [
            'import React from "react"',
            'import { useState } from "react"',
            '',
            'function App() {',
            '  const [count, setCount] = useState(0)',
            '  return <div>{count}</div>',
            '}',
            '',
            'export default App'
          ],
          cursorRow: 1,
          cursorCol: 9,
          mode: 'normal',
          description: 'Currently positioned at useState'
        },
        after: {
          text: [
            'import React from "react"',
            'import { useState } from "react"',
            '',
            'function App() {',
            '  const [count, setCount] = useState(0)',
            '  return <div>{count}</div>',
            '}',
            '',
            'export default App'
          ],
          cursorRow: 8,
          cursorCol: 0,
          mode: 'normal',
          description: 'Cursor at beginning of last line'
        },
        explanation: 'G jumps to the last line of the file, perfect for quick navigation to file end.'
      }
    ]
  },
  {
    id: 'email-composition',
    title: 'Professional Email Composition',
    description: 'Efficiently compose and format professional emails using VIM text manipulation features.',
    category: 'writer',
    difficulty: 'intermediate',
    timeToMaster: '8-12 min',
    useCase: 'Email writing',
    steps: [
      {
        command: 'I',
        description: 'Add email header',
        before: {
          text: [
            'john.doe@company.com',
            '',
            'Hi there,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Start with basic email content'
        },
        after: {
          text: [
            'To: john.doe@company.com',
            '',
            'Hi there,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 0,
          cursorCol: 3,
          mode: 'insert',
          description: 'Email header added'
        },
        explanation: 'I enters insert mode at the beginning of the line to add the email header "To: ".'
      },
      {
        command: '<Esc>o',
        description: 'Add subject line',
        before: {
          text: [
            'To: john.doe@company.com',
            '',
            'Hi there,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 0,
          cursorCol: 3,
          mode: 'insert',
          description: 'Currently in insert mode at email header'
        },
        after: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi there,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 1,
          cursorCol: 30,
          mode: 'insert',
          description: 'Subject line added'
        },
        explanation: 'Esc exits insert mode, o creates new line and enters insert mode to add the subject line.'
      },
      {
        command: '<Esc>2j',
        description: 'Navigate to greeting',
        before: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi there,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 1,
          cursorCol: 30,
          mode: 'insert',
          description: 'Move to greeting line for improvement'
        },
        after: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi there,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 3,
          cursorCol: 30,
          mode: 'normal',
          description: 'Positioned at greeting line'
        },
        explanation: 'Esc returns to normal mode, 2j moves down 2 lines to the greeting.'
      },
      {
        command: 'cw',
        description: 'Improve greeting',
        before: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi there,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 3,
          cursorCol: 3,
          mode: 'normal',
          description: 'Position cursor at "there" to change it'
        },
        after: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi John,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 3,
          cursorCol: 7,
          mode: 'insert',
          description: 'Greeting personalized'
        },
        explanation: 'cw changes the word "there," to "John," making the greeting more personal and professional.'
      },
      {
        command: '<Esc>G',
        description: 'Navigate to signature',
        before: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi John,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 3,
          cursorCol: 7,
          mode: 'insert',
          description: 'Move to improve the signature'
        },
        after: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi John,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 7,
          cursorCol: 0,
          mode: 'normal',
          description: 'At signature line'
        },
        explanation: 'Esc exits insert mode, G jumps to the last line to improve the signature.'
      },
      {
        command: 'A',
        description: 'Complete professional signature',
        before: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi John,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks'
          ],
          cursorRow: 7,
          cursorCol: 0,
          mode: 'normal',
          description: 'Enhance the closing signature'
        },
        after: {
          text: [
            'To: john.doe@company.com',
            'Subject: Project Timeline Follow-up',
            '',
            'Hi John,',
            '',
            'I wanted to follow up on our previous discussion about the project timeline.',
            '',
            'Thanks and best regards,',
            'Sarah'
          ],
          cursorRow: 8,
          cursorCol: 5,
          mode: 'insert',
          description: 'Professional signature completed'
        },
        explanation: 'A moves to end of line and enters insert mode to complete the professional signature with sender name.'
      }
    ]
  },
  {
    id: 'log-analysis',
    title: 'Log File Analysis and Cleanup',
    description: 'Learn essential techniques for analyzing and cleaning up log files using VIM search and filter operations.',
    category: 'developer',
    difficulty: 'intermediate',
    timeToMaster: '10-15 min',
    useCase: 'Log file processing',
    steps: [
      {
        command: '/ERROR',
        description: 'Find first error',
        before: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Start analyzing log file for errors'
        },
        after: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 2,
          cursorCol: 20,
          mode: 'normal',
          description: 'Found first ERROR entry'
        },
        explanation: '/ERROR searches for the first occurrence of "ERROR" in the log file to identify problem areas.'
      },
      {
        command: 'yy',
        description: 'Copy error line',
        before: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 2,
          cursorCol: 20,
          mode: 'normal',
          description: 'Copy this error line for analysis'
        },
        after: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 2,
          cursorCol: 20,
          mode: 'normal',
          description: 'Error line copied to register'
        },
        explanation: 'yy copies the entire current line containing the error for later use or documentation.'
      },
      {
        command: 'n',
        description: 'Find next error',
        before: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 2,
          cursorCol: 20,
          mode: 'normal',
          description: 'Continue searching for more errors'
        },
        after: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 5,
          cursorCol: 20,
          mode: 'normal',
          description: 'Found next ERROR entry'
        },
        explanation: 'n repeats the last search, jumping to the next occurrence of "ERROR" in the log file.'
      },
      {
        command: 'I# ',
        description: 'Comment out error line',
        before: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 5,
          cursorCol: 20,
          mode: 'normal',
          description: 'Mark this error as handled'
        },
        after: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '# 2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 5,
          cursorCol: 2,
          mode: 'insert',
          description: 'Error line commented out'
        },
        explanation: 'I enters insert mode at the beginning of the line, # adds a comment marker to indicate this error has been reviewed.'
      },
      {
        command: '<Esc>gg',
        description: 'Return to top for summary',
        before: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '# 2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 5,
          cursorCol: 2,
          mode: 'insert',
          description: 'Go to top to add summary'
        },
        after: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '# 2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'At top of file'
        },
        explanation: 'Esc exits insert mode, gg jumps to the top of the file to add a summary of the log analysis.'
      },
      {
        command: 'O',
        description: 'Add analysis summary',
        before: {
          text: [
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '# 2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Add summary header'
        },
        after: {
          text: [
            '# LOG ANALYSIS: 2 errors found - config load failure, DB timeout',
            '2024-01-15 10:30:15 INFO Application started',
            '2024-01-15 10:30:16 DEBUG Database connection established',
            '2024-01-15 10:30:17 ERROR Failed to load config file',
            '2024-01-15 10:30:18 INFO Retrying with default config',
            '2024-01-15 10:30:19 WARN Deprecated API usage detected',
            '# 2024-01-15 10:30:20 ERROR Database timeout',
            '2024-01-15 10:30:21 INFO Application running normally'
          ],
          cursorRow: 0,
          cursorCol: 65,
          mode: 'insert',
          description: 'Analysis summary added'
        },
        explanation: 'O creates a new line above the current line and enters insert mode to add a summary of the log analysis findings.'
      }
    ]
  },
  {
    id: 'table-formatting',
    title: 'Table Creation and Formatting',
    description: 'Learn to efficiently create and format tables for documentation using VIM alignment and duplication techniques.',
    category: 'writer',
    difficulty: 'intermediate',
    timeToMaster: '12-18 min',
    useCase: 'Documentation tables',
    steps: [
      {
        command: 'I| ',
        description: 'Start table header',
        before: {
          text: [
            'Name',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Convert list to table format'
        },
        after: {
          text: [
            '| Name',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 0,
          cursorCol: 2,
          mode: 'insert',
          description: 'Table delimiter added'
        },
        explanation: 'I enters insert mode at the beginning of the line, | starts the table format with proper delimiter.'
      },
      {
        command: '<Esc>A | Age | City | Email |',
        description: 'Complete table header',
        before: {
          text: [
            '| Name',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 0,
          cursorCol: 2,
          mode: 'insert',
          description: 'Add remaining header columns'
        },
        after: {
          text: [
            '| Name | Age | City | Email |',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 0,
          cursorCol: 27,
          mode: 'insert',
          description: 'Table header completed'
        },
        explanation: 'Esc exits insert mode, A moves to end of line and enters insert mode to complete the table header with all columns.'
      },
      {
        command: '<Esc>o',
        description: 'Add separator row',
        before: {
          text: [
            '| Name | Age | City | Email |',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 0,
          cursorCol: 27,
          mode: 'insert',
          description: 'Create table separator'
        },
        after: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 1,
          cursorCol: 25,
          mode: 'insert',
          description: 'Table separator row added'
        },
        explanation: 'Esc exits insert mode, o creates new line below and enters insert mode to add the markdown table separator.'
      },
      {
        command: '<Esc>2j',
        description: 'Navigate to data row',
        before: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 1,
          cursorCol: 25,
          mode: 'insert',
          description: 'Move to first data entry'
        },
        after: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 3,
          cursorCol: 25,
          mode: 'normal',
          description: 'At first data row'
        },
        explanation: 'Esc exits insert mode, 2j moves down 2 lines to position at the first data row that needs formatting.'
      },
      {
        command: 'cc',
        description: 'Replace with table row',
        before: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            'Age',
            'City',
            'Email'
          ],
          cursorRow: 2,
          cursorCol: 0,
          mode: 'normal',
          description: 'Convert list item to table row'
        },
        after: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            '| John | 30 | NYC | john@email.com |',
            'City',
            'Email'
          ],
          cursorRow: 2,
          cursorCol: 35,
          mode: 'insert',
          description: 'First data row formatted'
        },
        explanation: 'cc deletes the entire line and enters insert mode to replace it with properly formatted table data.'
      },
      {
        command: '<Esc>j',
        description: 'Move to next row',
        before: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            '| John | 30 | NYC | john@email.com |',
            'City',
            'Email'
          ],
          cursorRow: 2,
          cursorCol: 35,
          mode: 'insert',
          description: 'Continue formatting remaining rows'
        },
        after: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            '| John | 30 | NYC | john@email.com |',
            'City',
            'Email'
          ],
          cursorRow: 3,
          cursorCol: 35,
          mode: 'normal',
          description: 'Positioned at next data row'
        },
        explanation: 'Esc exits insert mode, j moves down one line to continue formatting the remaining data rows.'
      },
      {
        command: 'cc',
        description: 'Format final row',
        before: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            '| John | 30 | NYC | john@email.com |',
            'City',
            'Email'
          ],
          cursorRow: 3,
          cursorCol: 0,
          mode: 'normal',
          description: 'Complete the table formatting'
        },
        after: {
          text: [
            '| Name | Age | City | Email |',
            '|------|-----|------|-------|',
            '| John | 30 | NYC | john@email.com |',
            '| Jane | 25 | LA | jane@email.com |',
            'Email'
          ],
          cursorRow: 3,
          cursorCol: 34,
          mode: 'insert',
          description: 'Table properly formatted'
        },
        explanation: 'cc replaces the line with the final table row, completing the markdown table with proper formatting and alignment.'
      }
    ]
  },
  {
    id: 'config-editing',
    title: 'Configuration File Management',
    description: 'Master efficient techniques for editing and maintaining configuration files with proper formatting and validation.',
    category: 'general',
    difficulty: 'intermediate',
    timeToMaster: '10-15 min',
    useCase: 'System configuration',
    steps: [
      {
        command: '/port',
        description: 'Find port setting',
        before: {
          text: [
            'server_name=localhost',
            'port=8080',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Locate port configuration'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=8080',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 1,
          cursorCol: 0,
          mode: 'normal',
          description: 'Found port setting'
        },
        explanation: '/port searches for the port configuration setting in the config file.'
      },
      {
        command: 'f=',
        description: 'Navigate to value',
        before: {
          text: [
            'server_name=localhost',
            'port=8080',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 1,
          cursorCol: 0,
          mode: 'normal',
          description: 'Move to the port value'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=8080',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 1,
          cursorCol: 4,
          mode: 'normal',
          description: 'Positioned at equals sign'
        },
        explanation: 'f= moves the cursor to the equals sign, positioning us to edit the configuration value.'
      },
      {
        command: 'lC',
        description: 'Change port value',
        before: {
          text: [
            'server_name=localhost',
            'port=8080',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 1,
          cursorCol: 4,
          mode: 'normal',
          description: 'Update port to production value'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 1,
          cursorCol: 9,
          mode: 'insert',
          description: 'Port value changed to 3000'
        },
        explanation: 'l moves right one character past the equals, C deletes to end of line and enters insert mode to set new port value.'
      },
      {
        command: '<Esc>/debug',
        description: 'Find debug setting',
        before: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 1,
          cursorCol: 9,
          mode: 'insert',
          description: 'Locate debug configuration'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 2,
          cursorCol: 0,
          mode: 'normal',
          description: 'Found debug setting'
        },
        explanation: 'Esc exits insert mode, /debug searches for the debug configuration setting.'
      },
      {
        command: '$',
        description: 'Go to end of line',
        before: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 2,
          cursorCol: 0,
          mode: 'normal',
          description: 'Navigate to debug value'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 2,
          cursorCol: 11,
          mode: 'normal',
          description: 'At end of debug line'
        },
        explanation: '$ moves to the end of the current line to position at the debug value.'
      },
      {
        command: 'ciw',
        description: 'Change debug value',
        before: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=false',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 2,
          cursorCol: 11,
          mode: 'normal',
          description: 'Enable debug mode'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=true',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 2,
          cursorCol: 10,
          mode: 'insert',
          description: 'Debug enabled'
        },
        explanation: 'ciw changes the word "false" to "true", enabling debug mode in the configuration.'
      },
      {
        command: '<Esc>G',
        description: 'Add new setting',
        before: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=true',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 2,
          cursorCol: 10,
          mode: 'insert',
          description: 'Go to end to add new config'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=true',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 5,
          cursorCol: 10,
          mode: 'normal',
          description: 'At last line'
        },
        explanation: 'Esc exits insert mode, G moves to the last line to add a new configuration setting.'
      },
      {
        command: 'o',
        description: 'Add new configuration',
        before: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=true',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true'
          ],
          cursorRow: 5,
          cursorCol: 10,
          mode: 'normal',
          description: 'Add logging configuration'
        },
        after: {
          text: [
            'server_name=localhost',
            'port=3000',
            'debug=true',
            'max_connections=100',
            'timeout=30',
            'ssl_enabled=true',
            'log_level=info'
          ],
          cursorRow: 6,
          cursorCol: 13,
          mode: 'insert',
          description: 'New config setting added'
        },
        explanation: 'o creates a new line below and enters insert mode to add a new configuration setting for logging.'
      }
    ]
  },
  {
    id: 'macro-automation',
    title: 'Advanced Macro Creation and Automation',
    description: 'Master VIM macros to automate complex repetitive tasks and transform data efficiently across multiple lines.',
    category: 'developer',
    difficulty: 'advanced',
    timeToMaster: '20-30 min',
    useCase: 'Code automation',
    steps: [
      {
        command: 'qa',
        description: 'Start recording macro',
        before: {
          text: [
            'const user1 = "john"',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Start recording macro to transform variable declarations'
        },
        after: {
          text: [
            'const user1 = "john"',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Recording macro "a"'
        },
        explanation: 'qa begins recording a macro into register "a" that we can replay to automate repetitive edits.'
      },
      {
        command: 'f"',
        description: 'Navigate to string value',
        before: {
          text: [
            'const user1 = "john"',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Move to the string value for transformation'
        },
        after: {
          text: [
            'const user1 = "john"',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 14,
          mode: 'normal',
          description: 'Positioned at opening quote'
        },
        explanation: 'f" finds the first quote character to position for string manipulation.'
      },
      {
        command: 'ci"',
        description: 'Change string content',
        before: {
          text: [
            'const user1 = "john"',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 14,
          mode: 'normal',
          description: 'Replace string with object notation'
        },
        after: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 35,
          mode: 'insert',
          description: 'String transformed to object'
        },
        explanation: 'ci" changes the content inside quotes, transforming simple string to object with name and id properties.'
      },
      {
        command: '<Esc>$',
        description: 'Navigate to line end',
        before: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 35,
          mode: 'insert',
          description: 'Move to end of line for next step'
        },
        after: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 35,
          mode: 'normal',
          description: 'At end of transformed line'
        },
        explanation: 'Esc exits insert mode, $ moves to end of line to position for moving to next line.'
      },
      {
        command: 'j',
        description: 'Move to next line',
        before: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 0,
          cursorCol: 35,
          mode: 'normal',
          description: 'Continue to next variable declaration'
        },
        after: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 1,
          cursorCol: 35,
          mode: 'normal',
          description: 'Positioned at next line'
        },
        explanation: 'j moves down one line to position for the next transformation in our macro sequence.'
      },
      {
        command: '0',
        description: 'Go to line start',
        before: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 1,
          cursorCol: 35,
          mode: 'normal',
          description: 'Position at beginning for next iteration'
        },
        after: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 1,
          cursorCol: 0,
          mode: 'normal',
          description: 'Ready for next macro iteration'
        },
        explanation: '0 moves to the beginning of the line, setting up for the macro to repeat the same pattern.'
      },
      {
        command: 'q',
        description: 'Stop recording macro',
        before: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 1,
          cursorCol: 0,
          mode: 'normal',
          description: 'Complete macro recording'
        },
        after: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 1,
          cursorCol: 0,
          mode: 'normal',
          description: 'Macro "a" recorded successfully'
        },
        explanation: 'q stops macro recording. The macro is now stored in register "a" and ready for playback.'
      },
      {
        command: '3@a',
        description: 'Execute macro 3 times',
        before: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = "jane"',
            'const user3 = "bob"',
            'const user4 = "alice"',
            'const user5 = "charlie"'
          ],
          cursorRow: 1,
          cursorCol: 0,
          mode: 'normal',
          description: 'Apply macro to remaining lines'
        },
        after: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = { name: "jane", id: 2 }',
            'const user3 = { name: "bob", id: 3 }',
            'const user4 = { name: "alice", id: 4 }',
            'const user5 = "charlie"'
          ],
          cursorRow: 4,
          cursorCol: 0,
          mode: 'normal',
          description: 'Macro applied to lines 2, 3, and 4'
        },
        explanation: '3@a executes macro "a" three times, automatically transforming the remaining variable declarations with incremented IDs.'
      },
      {
        command: '@a',
        description: 'Execute macro once more',
        before: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = { name: "jane", id: 2 }',
            'const user3 = { name: "bob", id: 3 }',
            'const user4 = { name: "alice", id: 4 }',
            'const user5 = "charlie"'
          ],
          cursorRow: 4,
          cursorCol: 0,
          mode: 'normal',
          description: 'Complete transformation of last line'
        },
        after: {
          text: [
            'const user1 = { name: "john", id: 1 }',
            'const user2 = { name: "jane", id: 2 }',
            'const user3 = { name: "bob", id: 3 }',
            'const user4 = { name: "alice", id: 4 }',
            'const user5 = { name: "charlie", id: 5 }'
          ],
          cursorRow: 5,
          cursorCol: 0,
          mode: 'normal',
          description: 'All variables transformed to objects'
        },
        explanation: '@a executes the macro one final time, completing the transformation of all variable declarations into structured objects.'
      }
    ]
  },
  {
    id: 'multi-buffer-workflow',
    title: 'Multi-Buffer Project Management',
    description: 'Master advanced buffer management techniques for efficient navigation and editing across multiple files in large projects.',
    category: 'developer',
    difficulty: 'advanced',
    timeToMaster: '25-35 min',
    useCase: 'Project management',
    steps: [
      {
        command: ':e utils.js',
        description: 'Open utility file',
        before: {
          text: [
            '// main.js',
            'import { formatDate } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Currently in main.js file'
        },
        after: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  // TODO: implement date formatting',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Opened utils.js in new buffer'
        },
        explanation: ':e utils.js opens the utility file in a new buffer, allowing us to edit multiple files simultaneously.'
      },
      {
        command: '/TODO',
        description: 'Find incomplete function',
        before: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  // TODO: implement date formatting',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Locate unfinished functionality'
        },
        after: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  // TODO: implement date formatting',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 2,
          cursorCol: 5,
          mode: 'normal',
          description: 'Found TODO comment'
        },
        explanation: '/TODO searches for incomplete implementations that need to be finished.'
      },
      {
        command: 'cc',
        description: 'Implement date formatting',
        before: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  // TODO: implement date formatting',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 2,
          cursorCol: 5,
          mode: 'normal',
          description: 'Replace TODO with implementation'
        },
        after: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 2,
          cursorCol: 43,
          mode: 'insert',
          description: 'Date formatting implemented'
        },
        explanation: 'cc replaces the entire TODO line with a proper date formatting implementation.'
      },
      {
        command: '<Esc>j',
        description: 'Move to return statement',
        before: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 2,
          cursorCol: 43,
          mode: 'insert',
          description: 'Clean up old return statement'
        },
        after: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 43,
          mode: 'normal',
          description: 'At old return statement'
        },
        explanation: 'Esc exits insert mode, j moves to the now-obsolete return statement that needs removal.'
      },
      {
        command: 'dd',
        description: 'Remove old return',
        before: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '  return date',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 43,
          mode: 'normal',
          description: 'Delete redundant return statement'
        },
        after: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 0,
          mode: 'normal',
          description: 'Function cleaned up'
        },
        explanation: 'dd deletes the obsolete return statement, leaving a clean, functional implementation.'
      },
      {
        command: ':w',
        description: 'Save current buffer',
        before: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 0,
          mode: 'normal',
          description: 'Save changes to utils.js'
        },
        after: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 0,
          mode: 'normal',
          description: 'utils.js saved'
        },
        explanation: ':w saves the current buffer to disk, preserving our implementation changes.'
      },
      {
        command: ':b1',
        description: 'Switch to first buffer',
        before: {
          text: [
            '// utils.js',
            'export function formatDate(date) {',
            '  return new Date(date).toLocaleDateString()',
            '}',
            '',
            'export function validateData(data) {',
            '  return data !== null && data !== undefined',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 0,
          mode: 'normal',
          description: 'Return to main.js'
        },
        after: {
          text: [
            '// main.js',
            'import { formatDate } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 0,
          mode: 'normal',
          description: 'Back in main.js buffer'
        },
        explanation: ':b1 switches to buffer 1 (main.js), allowing seamless navigation between multiple open files.'
      },
      {
        command: 'gg',
        description: 'Go to import section',
        before: {
          text: [
            '// main.js',
            'import { formatDate } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 0,
          mode: 'normal',
          description: 'Navigate to add new import'
        },
        after: {
          text: [
            '// main.js',
            'import { formatDate } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'At top of file'
        },
        explanation: 'gg moves to the top of the file to access the import section.'
      },
      {
        command: 'jf}',
        description: 'Navigate to import end',
        before: {
          text: [
            '// main.js',
            'import { formatDate } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Position to add validateData import'
        },
        after: {
          text: [
            '// main.js',
            'import { formatDate } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 16,
          mode: 'normal',
          description: 'At end of import list'
        },
        explanation: 'j moves down one line, f} finds the closing brace of the import statement.'
      },
      {
        command: 'i, validateData',
        description: 'Add validation import',
        before: {
          text: [
            '// main.js',
            'import { formatDate } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 16,
          mode: 'normal',
          description: 'Add validateData to imports'
        },
        after: {
          text: [
            '// main.js',
            'import { formatDate, validateData } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 29,
          mode: 'insert',
          description: 'validateData imported'
        },
        explanation: 'i enters insert mode, then we add ", validateData" to import the validation function.'
      },
      {
        command: '<Esc>/processData',
        description: 'Navigate to function',
        before: {
          text: [
            '// main.js',
            'import { formatDate, validateData } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 1,
          cursorCol: 29,
          mode: 'insert',
          description: 'Find function to add validation'
        },
        after: {
          text: [
            '// main.js',
            'import { formatDate, validateData } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 9,
          mode: 'normal',
          description: 'Found processData function'
        },
        explanation: 'Esc exits insert mode, /processData searches for the function where we need to add validation.'
      },
      {
        command: 'o',
        description: 'Add validation check',
        before: {
          text: [
            '// main.js',
            'import { formatDate, validateData } from "./utils.js"',
            '',
            'function processData(data) {',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 3,
          cursorCol: 9,
          mode: 'normal',
          description: 'Add data validation to function'
        },
        after: {
          text: [
            '// main.js',
            'import { formatDate, validateData } from "./utils.js"',
            '',
            'function processData(data) {',
            '  if (!validateData(data)) return []',
            '  return data.map(item => ({',
            '    ...item,',
            '    formatted: formatDate(item.date)',
            '  }))',
            '}'
          ],
          cursorRow: 4,
          cursorCol: 33,
          mode: 'insert',
          description: 'Validation added to function'
        },
        explanation: 'o creates a new line and enters insert mode to add data validation before processing.'
      }
    ]
  },
  {
    id: 'regex-mastery',
    title: 'Advanced Search and Replace Patterns',
    description: 'Master complex regex patterns and advanced search-replace operations for powerful text transformation and data manipulation.',
    category: 'general',
    difficulty: 'advanced',
    timeToMaster: '30-40 min',
    useCase: 'Text processing',
    steps: [
      {
        command: '/\\d\\+',
        description: 'Search for numbers',
        before: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for $25.99 on 2024-01-15',
            'Customer age: 30, purchased 3 items',
            'Total: $150.75, Tax: $12.06',
            'Invoice #67890 dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 0,
          mode: 'normal',
          description: 'Find numeric patterns in text'
        },
        after: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for $25.99 on 2024-01-15',
            'Customer age: 30, purchased 3 items',
            'Total: $150.75, Tax: $12.06',
            'Invoice #67890 dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 9,
          mode: 'normal',
          description: 'Found first number sequence'
        },
        explanation: '/\\d\\+ searches for one or more consecutive digits using regex pattern matching.'
      },
      {
        command: 'n',
        description: 'Find next number',
        before: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for $25.99 on 2024-01-15',
            'Customer age: 30, purchased 3 items',
            'Total: $150.75, Tax: $12.06',
            'Invoice #67890 dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 9,
          mode: 'normal',
          description: 'Continue to next numeric pattern'
        },
        after: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for $25.99 on 2024-01-15',
            'Customer age: 30, purchased 3 items',
            'Total: $150.75, Tax: $12.06',
            'Invoice #67890 dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Found phone number start'
        },
        explanation: 'n repeats the search pattern, jumping to the next number sequence in the text.'
      },
      {
        command: ':%s/\\(\\d\\{4\\}\\)-\\(\\d\\{2\\}\\)-\\(\\d\\{2\\}\\)/\\3\\/\\2\\/\\1/g',
        description: 'Transform date format',
        before: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for $25.99 on 2024-01-15',
            'Customer age: 30, purchased 3 items',
            'Total: $150.75, Tax: $12.06',
            'Invoice #67890 dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Convert YYYY-MM-DD to DD/MM/YYYY format'
        },
        after: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for $25.99 on 15/01/2024',
            'Customer age: 30, purchased 3 items',
            'Total: $150.75, Tax: $12.06',
            'Invoice #67890 dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Date formats converted'
        },
        explanation: 'Complex regex substitution captures date parts with \\(\\) groups and rearranges them using \\1, \\2, \\3 references.'
      },
      {
        command: ':%s/\\$\\(\\d\\+\\.\\d\\+\\)/<span class="price">$\\1<\\/span>/g',
        description: 'Wrap prices in HTML',
        before: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for $25.99 on 15/01/2024',
            'Customer age: 30, purchased 3 items',
            'Total: $150.75, Tax: $12.06',
            'Invoice #67890 dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Add HTML markup to monetary values'
        },
        after: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            'Order #98765 for <span class="price">$25.99</span> on 15/01/2024',
            'Customer age: 30, purchased 3 items',
            'Total: <span class="price">$150.75</span>, Tax: <span class="price">$12.06</span>',
            'Invoice #67890 dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Prices wrapped in HTML spans'
        },
        explanation: 'Regex captures dollar amounts and wraps them in HTML span elements with CSS class for styling.'
      },
      {
        command: ':%s/\\(\\u\\w*\\) #\\(\\d\\+\\)/**\\1** (ID: \\2)/g',
        description: 'Format document references',
        before: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            '**Order** (ID: 98765) for <span class="price">$25.99</span> on 15/01/2024',
            'Customer age: 30, purchased 3 items',
            'Total: <span class="price">$150.75</span>, Tax: <span class="price">$12.06</span>',
            '**Invoice** (ID: 67890) dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Transform document IDs to markdown format'
        },
        after: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            '**Order** (ID: 98765) for <span class="price">$25.99</span> on 15/01/2024',
            'Customer age: 30, purchased 3 items',
            'Total: <span class="price">$150.75</span>, Tax: <span class="price">$12.06</span>',
            '**Invoice** (ID: 67890) dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Document references formatted'
        },
        explanation: 'Regex finds capitalized words followed by # and numbers, reformats them with markdown bold and parentheses.'
      },
      {
        command: ':/Phone:/s/\\(\\d\\{3\\}\\)-\\(\\d\\{3\\}\\)-\\(\\d\\{4\\}\\)/(\\1) \\2-\\3/',
        description: 'Format phone number',
        before: {
          text: [
            'User ID: 12345, Phone: 555-123-4567',
            '**Order** (ID: 98765) for <span class="price">$25.99</span> on 15/01/2024',
            'Customer age: 30, purchased 3 items',
            'Total: <span class="price">$150.75</span>, Tax: <span class="price">$12.06</span>',
            '**Invoice** (ID: 67890) dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Convert phone number to standard format'
        },
        after: {
          text: [
            'User ID: 12345, Phone: (555) 123-4567',
            '**Order** (ID: 98765) for <span class="price">$25.99</span> on 15/01/2024',
            'Customer age: 30, purchased 3 items',
            'Total: <span class="price">$150.75</span>, Tax: <span class="price">$12.06</span>',
            '**Invoice** (ID: 67890) dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Phone number formatted'
        },
        explanation: 'Range-limited substitution (/Phone:/) finds phone numbers only on lines containing "Phone:" and reformats them.'
      },
      {
        command: ':%s/\\<\\(\\w\\)\\(\\w*\\)\\>/\\U\\1\\L\\2/g',
        description: 'Capitalize first letters',
        before: {
          text: [
            'user id: 12345, phone: (555) 123-4567',
            '**order** (id: 98765) for <span class="price">$25.99</span> on 15/01/2024',
            'customer age: 30, purchased 3 items',
            'total: <span class="price">$150.75</span>, tax: <span class="price">$12.06</span>',
            '**invoice** (id: 67890) dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Apply title case to all words'
        },
        after: {
          text: [
            'User Id: 12345, Phone: (555) 123-4567',
            '**Order** (Id: 98765) For <span Class="Price">$25.99</span> On 15/01/2024',
            'Customer Age: 30, Purchased 3 Items',
            'Total: <span Class="Price">$150.75</span>, Tax: <span Class="Price">$12.06</span>',
            '**Invoice** (Id: 67890) Dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'All words title-cased'
        },
        explanation: 'Advanced regex with case modifiers: \\U uppercases first character, \\L lowercases the rest, creating title case.'
      },
      {
        command: ':%s/\\v(\\d+)\\/(\\d+)\\/(\\d+)/\\3-\\2-\\1/g',
        description: 'Revert date format',
        before: {
          text: [
            'User Id: 12345, Phone: (555) 123-4567',
            '**Order** (Id: 98765) For <span Class="Price">$25.99</span> On 15/01/2024',
            'Customer Age: 30, Purchased 3 Items',
            'Total: <span Class="Price">$150.75</span>, Tax: <span Class="Price">$12.06</span>',
            '**Invoice** (Id: 67890) Dated 20/01/2024'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Convert dates back to ISO format'
        },
        after: {
          text: [
            'User Id: 12345, Phone: (555) 123-4567',
            '**Order** (Id: 98765) For <span Class="Price">$25.99</span> On 2024-01-15',
            'Customer Age: 30, Purchased 3 Items',
            'Total: <span Class="Price">$150.75</span>, Tax: <span Class="Price">$12.06</span>',
            '**Invoice** (Id: 67890) Dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Dates converted to ISO format'
        },
        explanation: '\\v enables "very magic" mode simplifying regex syntax, captures and rearranges date components to ISO format.'
      },
      {
        command: ':g/Total/s/\\v\\$([0-9.]+)/💰 $\\1/g',
        description: 'Add emoji to totals',
        before: {
          text: [
            'User Id: 12345, Phone: (555) 123-4567',
            '**Order** (Id: 98765) For <span Class="Price">$25.99</span> On 2024-01-15',
            'Customer Age: 30, Purchased 3 Items',
            'Total: <span Class="Price">$150.75</span>, Tax: <span Class="Price">$12.06</span>',
            '**Invoice** (Id: 67890) Dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Add visual indicators to total amounts'
        },
        after: {
          text: [
            'User Id: 12345, Phone: (555) 123-4567',
            '**Order** (Id: 98765) For <span Class="Price">💰 $25.99</span> On 2024-01-15',
            'Customer Age: 30, Purchased 3 Items',
            'Total: <span Class="Price">💰 $150.75</span>, Tax: <span Class="Price">💰 $12.06</span>',
            '**Invoice** (Id: 67890) Dated 2024-01-20'
          ],
          cursorRow: 0,
          cursorCol: 22,
          mode: 'normal',
          description: 'Money emoji added to amounts'
        },
        explanation: ':g/Total/ runs substitution only on lines containing "Total", adding money emoji before dollar amounts.'
      }
    ]
  }
]