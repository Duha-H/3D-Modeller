// load in express
const express = require('express');
const PORT = 3000;

// create app
const app = express();

// tell express to serve static files from 'public' directory
app.use(express.static('.'));

// tell express to serve port 3000
app.listen(PORT, () => { console.log(`Listening at port: ${PORT}`) });