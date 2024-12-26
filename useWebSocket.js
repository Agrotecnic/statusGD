const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket();

client.connect(3000, '127.0.0.1', () => {
  console.log('Connected to server');
});

client.on('data', (data) => {
  console.log('Server: ' + data);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', () => {
  console.log('An error occurred');
});

rl.on('line', (input) => {
  client.write(input);
});
