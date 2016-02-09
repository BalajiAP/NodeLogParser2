var express = require('express');
var router = express.Router();
var credStorage = require('../cred.json');



exports.info = function(req, res){

	res.render('login');
};

exports.validate = function(req, res){
	
	
	var userName=req.query.userName;
	var password=req.query.password;
	var authenticationSuccess = false;
	console.log(userName);
	console.log(password);

	for(var i=0;i<credStorage.users.length;i++){
		var configName=credStorage.users[i].name;
		var configPass=credStorage.users[i].password;
		console.log(configName);
		console.log(configPass);
		if(userName == configName && password == configPass){
			authenticationSuccess = true;
		}
	}
	console.log(authenticationSuccess);
	var result='{"validationResult":'+authenticationSuccess+'}';
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(result);
	res.end();
	
};


