const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = './csv/nodejs-hw1-ex1.csv';

const csvOutputFilePath = './csv/output.txt';
const csvOutputFilePathForPipe = './csv/outputForPipe.txt';
const csvOutputFilePathFullyOnRAM = './csv/outputFullyOnRAM.txt';

const readStream = fs.createReadStream(csvFilePath);

const writeStream = fs.createWriteStream(csvOutputFilePath);
const writeStreamForPipe = fs.createWriteStream(csvOutputFilePathForPipe);

// reading/writing line by line and outputting to ./csv/output.txt
csv()
  .fromStream(readStream)
  .subscribe(jsonObj => {
    return new Promise((resolve, reject) => {
      const jsonString = JSON.stringify(jsonObj);
      writeStream.write(`${jsonString}\n`);
      resolve();
    })
  }, error => {
    console.error(error.message);
  });

// reading/writing with pipe and outputting to ./csv/outputForPipe.txt
readStream.pipe(csv()).pipe(writeStreamForPipe);

// Loading the file fully into the RAM and outputting to ./csv/outputFullyOnRAM.txt
fs.readFile(csvFilePath, 'utf8', (err, file) => {
  let result = '';
  csv()
    .fromString(file)
    .subscribe(jsonData => {
      const jsonString = JSON.stringify(jsonData);
      result = `${result}${jsonString}\n`;
    }, err => {
      console.error(err.message);
    }, () => {
      fs.writeFile(csvOutputFilePathFullyOnRAM, result, (err) => {
        if (err) {
          return console.error(err.message);
        }
      });
    });
});

[readStream, writeStream, writeStreamForPipe].forEach(stream => {
  stream.on('error', (error) => {
    console.error(error.message);
  });
});
