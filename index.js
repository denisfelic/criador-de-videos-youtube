const userInput = require('./robots/user-input.js');
const textRobot = require('./robots/text-robot.js');
const imageRobot = require('./robots/image-robot.js');
const stateFile = require('./robots/state-save-robot');

const robots = {
  userInput,
  textRobot,
  imageRobot,
};

async function start() {
  //content = {};
  //stateFile.save(content);


  
  
  //robots.userInput(content);
  //await robots.textRobot();
  await robots.imageRobot();
  //content = await stateFile.load();
  //console.dir(content, { depth: null });
   // console.log(JSON.stringify(content, null, 4));
}

start();
