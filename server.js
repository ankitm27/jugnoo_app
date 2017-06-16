var express = require('express');
var path = require('path');
var app = express();
var quoteController = require('./quote-controller.js')

app.use('/node_modules',express.static(path.join(__dirname,'node_modules')));
app.get('/api/sharequoteimage',quoteController.sharequoteimage);
app.listen('8080', function(){
  console.log("The http://127.0.0.1:8080/api/sharequoteimage is listening");
});
