process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let inputString = process.stdin.read();
  let reversedString = inputString.split('').reverse().join('');
    process.stdout.write(`${reversedString}\n`);
});
