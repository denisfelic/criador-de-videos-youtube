const robots = {
  userInput : require('./robots/user-input.js'),
  textRobot : require('./robots/text-robot.js'),
}

async function start() {
  const content = {};

  robots.userInput(content);
  await robots.textRobot(content);

}
start();
