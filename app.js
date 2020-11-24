const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoute = require('./routes/product');

const app = express();

// mongoose.connect('mongodb+srv://Lass:ck6aAQyVzhsjCfRS@cluster0.clhgf.mongodb.net/Lass?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb://localhost/product', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection
    .once ('open', () => {
        console.log('Connected Database')
    })
    .on ('error', (error) => {
        console.log(error)
    });

app.use(express.json());
app.use('/product', productRoute);
app.use(bodyParser.urlencoded({ extended : false }));

const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`)
});