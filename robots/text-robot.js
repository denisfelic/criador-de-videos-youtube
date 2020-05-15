/* eslint-disable no-useless-catch */
/* eslint-disable no-use-before-define */
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const algorithmia = require('algorithmia');
const sentenceBounderyDetection = require('sbd');
const algorithmiaApiKey = require('../creadentials/algorithmia.json').apiKey;
const apikey = require('../creadentials/watson-nlu.json').apikey;

const nlu = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: apikey,
  }),
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/',
});

async function robot(content) {
  await downloadContentFromWikipedia();
  sanitizeContent();
  breakContentIntoSentences();
  setLimitOfSentences();
  await fetchKeywordsOfAllSentences();

  async function downloadContentFromWikipedia() {
    const algorithmiaAuthenticaded = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticaded.algo('web/WikipediaParser/0.1.2?timeout=300');
    const wikipediaResponse = wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = await wikipediaResponse;
    content.sourceContentOriginal = wikipediaContent.result.content;
  }

  function sanitizeContent() {
    // Quebrar todo conteúdo em linhas,remover linhas em branco e a data padrão que vem do Wikipedia
    // Por fim adiciona-lo a propriedade do objeto

    function removeBlankLines(text) {
      const allContentInLines = text.split('\n');
      const withoutBlankLines = allContentInLines.filter((line) => {
        if (line.trim().length === 0) {
          // Exclui a linha em branca
          return false;
        }
        // Mantem
        return true;
      });

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
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/ {2}/g, ' ');
    }
    const contentWithoutBlankLines = removeBlankLines(content.sourceContentOriginal);
    const contentWithoutMarkDown = removeMarkdowns(contentWithoutBlankLines);
    const contentWithoutDateInParentheses = removeDateInParentheses(contentWithoutMarkDown);

    content.sanitizeContent = contentWithoutDateInParentheses;
  }

  function breakContentIntoSentences() {
    content.sentences = [];
    const sentences = sentenceBounderyDetection.sentences(content.sanitizeContent);

    sentences.forEach((element) => {
      content.sentences.push({
        text: element,
        keywords: [],
        image: [],
      });
    });
  }

  function setLimitOfSentences() {
    content.sentences = content.sentences.slice(0, content.maximumSentences);
  }

  async function fetchKeywordsOfAllSentences() {
    for(const sentence of content.sentences){
      sentence.keywords  = await returnKeywordsFromWatsonIBM(sentence.text);
    }

    //  content.sentences.forEach(element => {
    //   let myKeyWords = returnKeywordsFromWatsonIBM(element.text);

    //   myKeyWords.then((values) => {
    //     console.log('SentenceKey : ',content.sentences.keywords)
    //    content.sentences.keywords = values
    //    console.log(content.sentences)
    //   });

    // });
  }

  async function returnKeywordsFromWatsonIBM(phrase) {
    return nlu.analyze(
      {
        text: phrase,
        features: {
          keywords: {},
        },
      },
    )
      .then((response) => {
        try {
          const keywords = response.result.keywords.map((keyword) => keyword.text);
          return keywords;
        }
        catch (error) {
          console.log('Error: ', error);
        }
      })
      .catch((err) => {
        console.log('error2', err);
      });
  }
}

module.exports = robot;
