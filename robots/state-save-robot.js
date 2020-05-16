const fs = require('fs');
const contentPath = 'content-params.json'

function save(content) {
    const contentString = JSON.stringify(content, null, 4);
    fs.writeFileSync(contentPath, contentString);
}

async function load() {
    const fileBuffer = fs.readFileSync(contentPath, 'utf-8');
    const contentJson = JSON.parse(fileBuffer);
    return contentJson;
}
module.exports = {
    save,
    load
};