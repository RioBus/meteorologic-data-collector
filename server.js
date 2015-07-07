var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require('mongodb'); 
var moment = require('moment-timezone');

var mongodbClient = mongodb.MongoClient; 
var app = express();
var mongodbURI='mongodb://localhost/sensor';

var collection, requestBody;

var events = require('events');
var eventEmitter = new events.EventEmitter();

mongodbClient.connect(mongodbURI,setupCollection);

function setupCollection(err,db) {  
  if(err) throw err;
  collection = db.collection("sensor");
  eventEmitter.on('dataReceived', insertData);
}

function prepareData(data) {
	for(var i in data)
	{
		if (!isNaN(Number(data[i]))) { // check if it is convertible
			data[i] = Number(data[i]);
		} else { // is geolocation
			data[i] = JSON.parse(data[i]);
		}
	}
	
	var tempDateTime = moment(data["timestamp"]).tz("America/Sao_Paulo");
	data["timestamp"] = tempDateTime.format(); // epoch to ISODate
	data["year"] = tempDateTime.year(); 
	data["month"] =	tempDateTime.month() + 1; // 0 is january
	data["day"] = tempDateTime.date(); 
	data["hour"] = tempDateTime.hours(); 
	data["minute"] = tempDateTime.minutes(); 
	data["second"] = tempDateTime.seconds(); // for easy aggregation
	
	return data;
}

function insertData(topic,payload) {  
	requestBody = prepareData(requestBody);
	console.log(requestBody);
	
	collection.insert(requestBody, function(err, records) {
		if (err) throw err;
		console.log("Record added as "+records);
	});
	
}

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sensor',function(req,res){
	//console.log(req.body);
	requestBody = req.body;
	eventEmitter.emit('dataReceived');
	res.end("yes");
});

app.listen(3000,function(){
	console.log("Started on PORT 3000");
})
 		  
