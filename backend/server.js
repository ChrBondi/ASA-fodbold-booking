let express = require('express');
const app = express();
const fetch = require('node-fetch');

app.use(express.json());
app.use(express.static(__dirname + '/backend'));
let mongoose = require('mongoose');