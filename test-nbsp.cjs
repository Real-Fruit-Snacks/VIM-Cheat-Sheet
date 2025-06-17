// Test non-breaking space
const nbsp = '\u00A0';
const regularSpace = ' ';

console.log('Regular space code:', regularSpace.charCodeAt(0));
console.log('NBSP code:', nbsp.charCodeAt(0));
console.log('Test string:', `a${nbsp}b`);
console.log('Includes regular space:', `a${nbsp}b`.includes(' '));
console.log('Includes nbsp:', `a${nbsp}b`.includes(nbsp));