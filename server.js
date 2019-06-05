// load in express
const express = require('express');

// create app
const app = express();

// tell express to serve static files from 'public' directory
app.use(express.static('.'));

// tell express to serve port 3000
app.listen(3000);