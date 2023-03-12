//Define imports (require)
const express = require('express');
const session = require('express-session');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

//"Initialize" express
const app = express();

//Port
const port = 4000;

//App listener (start server)
app.listen(port, () => console.log("Started server on localhost:" + port));