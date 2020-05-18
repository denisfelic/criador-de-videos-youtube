const stateFile = require('./state-save-robot');
const googleapi = require('googleapis').google;
const searchEngine = googleapi.customsearch('v1');
const googleCredentials = require('../creadentials/google-custom-search-api.json');

async function robot() {
    const content =  await stateFile.load();
    await  fetchImagesWithKeyWords(content);
    
    stateFile.save(content);

     async function fetchImagesWithKeyWords(content){

        let query = '';

        for( const sentence of content.sentences){

            query = `${content.searchTerm.articleName} ${sentence.keywords[0]}`;
            sentence.images = await fetchWithGoogleImages(query);
            sentence.googleSearchQuerry = query;

        }
     }   

     async function fetchWithGoogleImages(query){
        const response = await searchEngine.cse.list({
        auth: googleCredentials.apiKey,
        cx: googleCredentials.searchEngineId,
        q: query,
        searchType: 'image',
        num: 2,
    });

    imagesLink = response.data.items.map((item ) => {
        return item.link;
    })
    
    return imagesLink;
    }
}
module.exports = robot;
