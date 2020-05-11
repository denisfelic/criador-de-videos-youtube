const readline = require('readline-sync');

function start() {
  const content = {};
  function askedAndReturnedSearchTerm() {
    return readline.question('Type the term to search in Wikipedia: ');
  }
  function askedAndReturnedPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of'];
    const selectedPrefixeIndex = readline.keyInSelect(prefixes);
    const selectedPrefixText = prefixes[selectedPrefixeIndex];
    
    return selectedPrefixText;
  }
  content.searchTerm = askedAndReturnedSearchTerm();
  content.prefix = askedAndReturnedPrefix();
  console.log(content);
}
start();
