const readline = require('readline-sync');

function userInput(content) {

  function askedAndReturnedSearchTerm() {
    return readline.question('Type the term to search in Wikipedia: ');
  }

  function askedAndReturnedPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of'];
    const selectedPrefixeIndex = readline.keyInSelect(prefixes);
    const selectedPrefixText = prefixes[selectedPrefixeIndex];

    return selectedPrefixText;
  }

  content.searchTerm = {
    "articleName": askedAndReturnedSearchTerm(),
    "lang": "en"
  }

  content.prefix = askedAndReturnedPrefix();
}

module.exports = userInput;