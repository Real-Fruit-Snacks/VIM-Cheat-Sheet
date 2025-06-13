export interface PracticeFile {
  id: string;
  title: string;
  description: string;
  category: 'code' | 'prose' | 'config' | 'data';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  tasks: string[];
  hints?: string[];
}

export const practiceFiles: PracticeFile[] = [
  // Beginner Navigation
  {
    id: 'nav-basics',
    title: 'Basic Navigation',
    description: 'Practice fundamental cursor movement commands',
    category: 'prose',
    difficulty: 'beginner',
    content: `Welcome to VIM navigation practice!

This file contains several paragraphs of text to help you practice
basic movement commands. Try using h, j, k, l to move around.

Here's a longer paragraph with multiple sentences. You can practice
moving by words with w and b commands. Notice how VIM treats
punctuation and spaces. Try moving to the end of words with e.

Practice targets:
- Move to the word "targets" above
- Jump to the beginning of this line
- Go to the last line of this file
- Return to the first line

Remember: The more you practice, the more natural it becomes!`,
    tasks: [
      'Navigate to the word "practice" using word motions (w/b)',
      'Jump to line 5 using :5 or 5G',
      'Move to the end of the file with G',
      'Return to the beginning with gg',
      'Find all instances of "practice" using /practice'
    ],
    hints: [
      'Use w to move forward by words',
      'Use 0 to go to the beginning of a line',
      'Use $ to go to the end of a line'
    ]
  },

  // Code Refactoring
  {
    id: 'refactor-function',
    title: 'Function Refactoring',
    description: 'Practice code editing and refactoring techniques',
    category: 'code',
    difficulty: 'intermediate',
    content: `function calculateTotalPrice(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var price = item.price;
        var quantity = item.quantity;
        var subtotal = price * quantity;
        total = total + subtotal;
    }
    return total;
}

function processOrder(orderData) {
    var customerName = orderData.customer.name;
    var customerEmail = orderData.customer.email;
    var items = orderData.items;
    var totalPrice = calculateTotalPrice(items);
    
    console.log("Processing order for: " + customerName);
    console.log("Email: " + customerEmail);
    console.log("Total: $" + totalPrice);
    
    return {
        customer: customerName,
        email: customerEmail,
        total: totalPrice,
        processed: true
    };
}`,
    tasks: [
      'Change all "var" declarations to "const" or "let"',
      'Convert string concatenation to template literals',
      'Extract the console.log statements into a separate function',
      'Rename "calculateTotalPrice" to "calculateOrderTotal"',
      'Add JSDoc comments above each function'
    ],
    hints: [
      'Use :%s/var /const /g for global replacement',
      'Use ciw to change a word under cursor',
      'Use visual mode (V) to select multiple lines',
      'Use . to repeat the last change'
    ]
  },

  // Config File Editing
  {
    id: 'config-nginx',
    title: 'Nginx Configuration',
    description: 'Edit a web server configuration file',
    category: 'config',
    difficulty: 'intermediate',
    content: `server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /static {
        alias /var/www/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 80;
    server_name www.example.com;
    return 301 https://example.com$request_uri;
}`,
    tasks: [
      'Change the server_name from example.com to myapp.com',
      'Add SSL configuration (listen 443 ssl)',
      'Add a new location block for /admin',
      'Comment out the proxy headers temporarily',
      'Duplicate the first server block for staging.myapp.com'
    ],
    hints: [
      'Use /server_name to search',
      'Use yy to yank (copy) a line, p to paste',
      'Use >> to indent, << to unindent',
      'Use I to insert at the beginning of a line'
    ]
  },

  // CSV Data Manipulation
  {
    id: 'data-csv',
    title: 'CSV Data Editing',
    description: 'Manipulate structured data efficiently',
    category: 'data',
    difficulty: 'advanced',
    content: `id,name,email,department,salary,start_date
1,John Smith,john.smith@company.com,Engineering,75000,2020-01-15
2,Jane Doe,jane.doe@company.com,Marketing,65000,2019-03-22
3,Bob Johnson,bob.johnson@company.com,Sales,70000,2021-06-01
4,Alice Williams,alice.williams@company.com,Engineering,80000,2018-11-30
5,Charlie Brown,charlie.brown@company.com,HR,60000,2020-08-15
6,Diana Prince,diana.prince@company.com,Engineering,85000,2017-05-20
7,Edward Norton,edward.norton@company.com,Finance,72000,2019-09-10
8,Fiona Green,fiona.green@company.com,Marketing,68000,2021-01-05
9,George Hill,george.hill@company.com,Sales,73000,2020-04-18
10,Helen Troy,helen.troy@company.com,Engineering,90000,2016-12-01`,
    tasks: [
      'Sort all engineers together (group by department)',
      'Add a 10% raise to all Engineering salaries',
      'Change all email domains from @company.com to @newcompany.com',
      'Add a new column "years_employed" after start_date',
      'Calculate and add the average salary at the bottom'
    ],
    hints: [
      'Use visual block mode (Ctrl-v) for column selection',
      'Use :sort to sort lines',
      'Use macros (q) to record repetitive actions',
      'Use :%s/pattern/replacement/g for global substitution'
    ]
  },

  // Markdown Editing
  {
    id: 'prose-markdown',
    title: 'Markdown Document',
    description: 'Edit and format a markdown document',
    category: 'prose',
    difficulty: 'beginner',
    content: `# Project README

## Introduction
This is a sample project that demonstrates various features. The goal is to provide a comprehensive example of how to structure documentation.

## Features
The main features include:
- Feature One: Basic functionality
- Feature Two: Advanced options  
- Feature Three: Integration capabilities

## Installation
To install this project, follow these steps:
1. Clone the repository
2. Install dependencies
3. Run the setup script
4. Verify installation

### Requirements
You will need the following:
- Node.js version 14 or higher
- npm or yarn package manager
- A text editor
- Basic command line knowledge

## Usage
Here's how to use the project:

First, start the development server:
npm run dev

Then open your browser to http://localhost:3000

## Contributing
We welcome contributions! Please see our contributing guidelines for more information.

## License
This project is licensed under the MIT License.`,
    tasks: [
      'Convert the Features list to a numbered list',
      'Add code blocks around the npm command',
      'Create a table of contents with links',
      'Bold all the headers using markdown syntax',
      'Add a new section called "Troubleshooting"'
    ],
    hints: [
      'Use visual line mode (V) to select multiple lines',
      'Use :s/^- /1. / to convert bullet points',
      'Use o to open a new line below',
      'Use == to fix indentation'
    ]
  },

  // Advanced Multi-file Refactoring Scenario
  {
    id: 'refactor-class',
    title: 'Class Refactoring',
    description: 'Refactor a JavaScript class to modern syntax',
    category: 'code',
    difficulty: 'advanced',
    content: `// Legacy User class that needs modernization
function User(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isActive = true;
    this.createdAt = new Date();
}

User.prototype.getFullName = function() {
    return this.firstName + ' ' + this.lastName;
};

User.prototype.sendEmail = function(subject, message) {
    console.log('Sending email to: ' + this.email);
    console.log('Subject: ' + subject);
    console.log('Message: ' + message);
    // Email sending logic here
};

User.prototype.deactivate = function() {
    this.isActive = false;
    console.log('User ' + this.getFullName() + ' has been deactivated');
};

// Usage example
var user1 = new User('John', 'Doe', 'john@example.com');
var user2 = new User('Jane', 'Smith', 'jane@example.com');

user1.sendEmail('Welcome', 'Welcome to our platform!');
user2.deactivate();

// Helper functions
function validateEmail(email) {
    var re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return re.test(email);
}

function formatDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return month + '/' + day + '/' + year;
}`,
    tasks: [
      'Convert the constructor function to an ES6 class',
      'Convert all prototype methods to class methods',
      'Add getters for fullName and formattedCreatedAt',
      'Add email validation in the constructor',
      'Use template literals instead of string concatenation',
      'Add JSDoc comments for all methods',
      'Make the class exportable as a module'
    ],
    hints: [
      'Use caw to change a word and stay in insert mode',
      'Use da{ to delete around braces',
      'Use * to search for the word under cursor',
      'Use :g/pattern/command for global commands'
    ]
  }
];

// Helper function to get files by category
export function getFilesByCategory(category: PracticeFile['category']): PracticeFile[] {
  return practiceFiles.filter(file => file.category === category);
}

// Helper function to get files by difficulty
export function getFilesByDifficulty(difficulty: PracticeFile['difficulty']): PracticeFile[] {
  return practiceFiles.filter(file => file.difficulty === difficulty);
}