const readline = require('readline-sync');
const stateSaveRobot = require('./state-save-robot.js');

function userInput() {
  const content = stateSaveRobot.load();
  content.maximumSentences = 7;
  content.searchTerm = {
    articleName: askedAndReturnedSearchTerm(),
    lang: 'en',
  };
  content.prefix = askedAndReturnedPrefix();

  stateSaveRobot.save(content);
}

function askedAndReturnedSearchTerm() {
  return readline.question('Type the term to search in Wikipedia: ');
}
function askedAndReturnedPrefix() {
  const prefixes = ['Who is', 'What is', 'The history of'];
  const selectedPrefixeIndex = readline.keyInSelect(prefixes);
  const selectedPrefixText = prefixes[selectedPrefixeIndex];

  return selectedPrefixText;
}

module.exports = userInput;
