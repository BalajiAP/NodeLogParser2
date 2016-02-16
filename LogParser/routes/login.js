var express = require('express');
var router = express.Router();
var credStorage = require('../cred.json');
var jsonfile = require('jsonfile');
var fs = require('fs');
var userExists;



exports.info = function(req, res){

	res.render('login');
};

exports.signUp = function(req, res){

	res.render('signUp');
};

exports.saveData = function(req, res){
	var userName=req.query.userName;
	var password=req.query.password;
	userExists = false;
	
	var authenticationSuccess = false;
	console.log("Username is " + userName);
	console.log(password);
	
	
	jsonfile.readFile('./cred.json', function(err, credStorage1) {
		console.log(credStorage1);
		for(var i=0;i<credStorage1.users.length;i++){
			var configName=credStorage1.users[i].name;
			var configPass=credStorage1.users[i].password;
			if(configName==userName){
				console.log("Username Exists" + userName);
				userExists = true;
				
			}
			if(userName == configName && password == configPass){
				authenticationSuccess = true;
			}
			console.log("User Exists " + userExists);
		}
		console.log("User Exists " + userExists);
		
		console.log("User Exists " + userExists);
		if(!userExists){
		console.log("INSIDE ELSE");
		var text = '{ "users" : []}';	
		var arr = JSON.parse(text);	
		for(var i=0;i<credStorage1.users.length;i++){
			var configName=credStorage1.users[i].name;
			var configPass=credStorage1.users[i].password;
			console.log("THE NAME IS " + configName);
			var userDetails = {"name":configName,"password":configPass};
			console.log(JSON.stringify(userDetails));
			arr.users.push(userDetails);
				console.log(JSON.stringify(arr));
		}
		
		var newUser ={"name":userName,"password":password};
		arr.users.push(newUser);
		console.log("THE VALUE IS " + JSON.stringify(arr));
		
		var file = './cred.json';
					 
		jsonfile.writeFileSync(file, arr, {spaces: 2}, function(err) {
			  console.error(err);
		});	
		
		console.log(authenticationSuccess);
		
		var dir = './userLogs/'+userName;

		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
		
		res.write("User created successfully");
		res.end();
		}else{
			console.log("User Already exists");
			res.write("User already exists");
			res.end();	
		}	
	});
	
	
};

exports.validate = function(req, res){
	
	
	var userName=req.query.userName;
	var password=req.query.password;
	var authenticationSuccess = false;
	console.log(userName);
	console.log(password);
	jsonfile.readFile('./cred.json', function(err, credStorage1) {
		console.log(credStorage1);
		for(var i=0;i<credStorage1.users.length;i++){
			var configName=credStorage1.users[i].name;
			var configPass=credStorage1.users[i].password;
			console.log("confi gname i s" + configName);
			console.log("config pass is " + configPass);
			console.log("Input username i s" + userName);
			console.log("Input password is " + password);
			if(userName == configName && password == configPass){
				authenticationSuccess = true;
			}
		}
		console.log(authenticationSuccess);
		var result='{"validationResult":'+authenticationSuccess+'}';
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(result);
		res.end(); 
		});
	 
	
	
};


