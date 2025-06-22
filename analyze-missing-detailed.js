import fs from 'fs';

// Read files
const commandsContent = fs.readFileSync('/home/user/Projects/VIM/src/data/vim-commands.ts', 'utf8');
const examplesContent = fs.readFileSync('/home/user/Projects/VIM/src/data/vim-examples.ts', 'utf8');

// Extract all commands with their categories
const allCommandsWithCategories = [];
const commandRegex = /(\w+):\s*\[([\s\S]*?)\](?=,\s*\w+: < /dev/null | $)/g;
let categoryMatch;

while ((categoryMatch = commandRegex.exec(commandsContent)) \!== null) {
  const categoryName = categoryMatch[1];
  const categoryContent = categoryMatch[2];
  
  const commandMatches = [...categoryContent.matchAll(/command:\s*'([^']+)'/g)];
  for (const match of commandMatches) {
    allCommandsWithCategories.push({
      command: match[1],
      category: categoryName
    });
  }
}

// Get unique commands
const uniqueCommands = [...new Set(allCommandsWithCategories.map(c => c.command))];

// Extract commands with examples
const exampleCommands = [...examplesContent.matchAll(/^  '([^']+)': {/gm)].map(m => m[1]);
const exampleSet = new Set(exampleCommands);

// Find missing examples
const missingCommands = uniqueCommands.filter(cmd => \!exampleSet.has(cmd));

// Group missing by category
const missingByCategory = {};
for (const cmd of missingCommands) {
  const categories = allCommandsWithCategories
    .filter(c => c.command === cmd)
    .map(c => c.category);
  
  for (const cat of categories) {
    if (\!missingByCategory[cat]) missingByCategory[cat] = [];
    if (\!missingByCategory[cat].includes(cmd)) {
      missingByCategory[cat].push(cmd);
    }
  }
}

console.log(`Total unique commands: ${uniqueCommands.length}`);
console.log(`Commands with examples: ${exampleCommands.length}`);
console.log(`Missing examples: ${missingCommands.length}`);
console.log(`\nMissing commands:`);
missingCommands.forEach(cmd => console.log(`  - ${cmd}`));

console.log(`\n\nMissing by category:`);
for (const [cat, cmds] of Object.entries(missingByCategory)) {
  console.log(`\n${cat}: ${cmds.length} missing`);
  cmds.forEach(cmd => console.log(`  - ${cmd}`));
}
