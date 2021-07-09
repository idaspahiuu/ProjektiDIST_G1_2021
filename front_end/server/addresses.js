const http = require('http');

const getAddresses = http.get('http://sisteme-te-shperndara.herokuapp.com/api/v1/getAdresses', (response) => {
  addresses = '';
  response.on('data', (chunk) => {
    addresses += chunk;
  });

  response.on('end', () => {
    addresses = JSON.parse(addresses)
    console.log(addresses)
  });
}).on("error", (error) => {
  console.log("Error: " + error.message);
});

module.exports = getAddresses;