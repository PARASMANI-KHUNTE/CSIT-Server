const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT 
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbcon = require('./Database/Db');
dbcon()

// const worker = require('./Routes/session');
// app.use('/worker', worker);

const auth = require('./Routes/auth');
app.use('/auth', auth);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}` );
});
