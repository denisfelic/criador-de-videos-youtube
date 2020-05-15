const userInput = require('./robots/user-input.js');
const textRobot = require('./robots/text-robot.js');

const robots = {
  userInput,
  textRobot,
};

async function start() {
  const content = {
    maximumSentences: 7,
  };

  robots.userInput(content);
  await robots.textRobot(content);

  console.log(JSON.stringify(content, null, 4));
}

start();
