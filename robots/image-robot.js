const stateFile = require('./state-save-robot');
const googleapi = require('googleapis').google;
const searchEngine = googleapi.customsearch('v1');
const googleCredentials = require('../creadentials/google-custom-search-api.json');
const imageDownloader = require('image-downloader');

async function robot() {
    const content = await stateFile.load();
    await  fetchImagesWithKeyWords(content);
    await addImagesToContent(content);
    stateFile.save(content);

    async function fetchImagesWithKeyWords(content) {

        let query = '';

        for (const sentence of content.sentences) {

            query = `${content.searchTerm.articleName} ${sentence.keywords[0]}`;
            sentence.images = await fetchWithGoogleImages(query);
            sentence.googleSearchQuerry = query;

        }
    }

    async function fetchWithGoogleImages(query) {
        const response = await searchEngine.cse.list({
            auth: googleCredentials.apiKey,
            cx: googleCredentials.searchEngineId,
            q: query,
            searchType: 'image',
            num: 2,
        });

        imagesLink = response.data.items.map((item) => {
            return item.link;
        })

        return imagesLink;
    }

    async function addImagesToContent(content) {
        content.downloadedImages = [];
        
        for (let i = 0; i < content.sentences.length; i++) {
            const imagesArray = content.sentences[i].images;
            
            for (let j = 0; j < imagesArray.length; j++) {
                const imageUrl = imagesArray[j];
                let imageObject = {};
                
                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error(`Imagem já baixada STNC: ${i} IMG: ${j} URL: ${imageUrl}`)
                    }
 
                    
                    imageObject.url = imageUrl;
                    let fileFormat = imageUrl.substr(imageUrl.length - 3);
                    imageObject.fileNameAndPath = `temp/imgs/img-stc${i}-img${j}-default.png`;

                    await downloadImagesPassUrl(imageObject);
                    content.downloadedImages.push(imageUrl);
                    console.log(`STNC: ${i} IMG: ${j} Imagem baixada com sucesso: ${imageUrl} `);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        async function downloadImagesPassUrl(imageObject) {
            const options = {
                url: imageObject.url,
                dest: imageObject.fileNameAndPath,           // will be saved to /path/to/dest/image.jpg
            }

            imageDownloader.image(options)
                .then(({ imageObject }) => {
                    console.log('Salvando imagem em: ', options.dest)  // saved to /path/to/dest/image.jpg
                })
                .catch((err) => console.error(err))
        }
    }

}
module.exports = robot;
