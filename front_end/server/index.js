const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '0.0.0.0';

http.listen(PORT, IP, () => { console.log("Open server http://localhost:" + PORT) });

const getAddresses = require('./addresses');
const getJavaData = require('./javaData');
const getSockets = require('./sockets')(io);

app.set('view engine', 'ejs');

app.use(express.static('./views'));
app.use('/', require('./authorize'));