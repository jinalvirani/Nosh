const express = require('express');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');

const userrouter = require('./Routes/userRoute');
const adminrouter = require('./Routes/adminRoute');
const orderrouter = require('./Routes/orderRoute');

const app = express();

app.use(bodyParser.json());
app.use(fileupload());

app.use('/user',userrouter);
app.use('/admin',adminrouter);
app.use('/order',orderrouter);

app.listen(9000);