const express = require('express');
const bodyParser = require('body-parser');

const userrouter = require('./Routes/userRoute');
const orderrouter = require('./Routes/orderRoute');

const app = express();
app.use(bodyParser.json());

app.use('/user',userrouter);
app.use('/admin',orderrouter);

app.listen(9000);