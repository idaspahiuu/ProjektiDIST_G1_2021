const http = require('http');

const getJavaData = http.get('http://sisteme-te-shperndara-spring.herokuapp.com/getData', (response) => {
  javaData = '';
  response.on('data', (chunk) => {
    javaData += chunk;
  });

  response.on('end', () => {
    javaData = JSON.parse(javaData)
    console.log(javaData)
  });
}).on("error", (error) => {
  console.log("Error: " + error.message);
});

module.exports = getJavaData;