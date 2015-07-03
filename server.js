var express = require("express");
var bodyParser = require("body-parser");
var app  = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sensor',function(req,res){
	console.log(req.body);
	// db logic
	res.end("yes");
});

app.listen(3000,function(){
	console.log("Started on PORT 3000");
})
 		  
