const algorithmia = require("algorithmia");
const algorithmiaApiKey = require('../creadentials/algorithmia.json').apiKey;
const sentenceBounderyDetection = require('sbd');

async function robot(content) {

  async function downloadContentFromWikipedia() {
    const algorithmiaAuthenticaded = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticaded.algo('web/WikipediaParser/0.1.2?timeout=300');
    const wikipediaResponse = wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = await wikipediaResponse;
    content.sourceContentOriginal = wikipediaContent.result.content;
  }

  function sanitizeContent(content) {
    // Quebrar todo conteúdo em linhas e remover linhas em branco
    const contentWithoutBlankLines = removeBlankLines(content.sourceContentOriginal);
    const contentWithoutMarkDown = removeMarkdowns(contentWithoutBlankLines);
    const contentWithoutDateInParentheses = removeDateInParentheses(contentWithoutMarkDown);

    content.sanitizeContent = contentWithoutDateInParentheses;

    function removeBlankLines(text) {
      const allContentInLines = text.split('\n');
      const withoutBlankLines = allContentInLines.filter((line) => {
        if (line.trim().length === 0) {
          // Exclui a linha em branca
          return false;
        }
        // Mantem
        return true;
      })

      return withoutBlankLines;
    }

    function removeMarkdowns(text) {
      const textWithOutMarkDown = text.filter((line) => {
        if (line.trim().startsWith('=')) {
          return false;
        }
        return true;
      });
      return textWithOutMarkDown.join(' ');
    }

    function removeDateInParentheses(text) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
    }
  }

  function breakContentIntoSentences(content) {
    content.sentence = [];
    const sentences = sentenceBounderyDetection.sentences(content.sanitizeContent);

    sentences.forEach((element) => {
      content.sentence.push({
        text: element,
        keywords: [],
        image: []
      });
    });

    console.log(content.sentence);
  }


  await downloadContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
}

module.exports = robot;
