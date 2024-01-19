const path = require('path');
const fs = require('fs');
const { stdin, stdout, exit } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const writableStream = fs.createWriteStream(filePath);
showGreeting();
stdin.on('data', handleData);
process.on('exit', showFarewell);
process.on('SIGINT', () => exit());

function showGreeting() {
  stdout.write(
    '*Hello! \n*Please, type something. \n*Type "exit" or press ctrl+c to stop.\n',
  );
}

function showFarewell() {
  stdout.write('*Goodbye!');
}

function handleData(data) {
  if (data.toString().trim().toLowerCase() === 'exit') {
    exit();
  }
  writableStream.write(data);
}
