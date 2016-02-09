var express = require('express');
var router = express.Router();
var fs = require('fs'),
readline = require('readline'),
stream = require('stream');
var path = require('path');
var date=require("date-format-lite");
var zlib = require('zlib');
var moment=require('moment');
var searchHistory=require('../search_history_log.json');
/**
 * *******************************************
 * Function to display the Log search page
 * *******************************************
 */
exports.searchForm = function(req, res){
	res.render('logsearch');
};



/**
 * ***********************************************************************
 * Function to perform the search and store the  result in a  text file
 * ************************************************************************
 */
exports.searchLogFunction = function(req, res){

	/*
	 * Retrieves and displays all Query Parameters
	 * 
	 */
	var searchString=req.query.searchString;
	var environment=req.query.environment;
	var fromDate=req.query.fromDate.date("YYYY-MM-DD");
	var fromTime=req.query.fromTime;
	var toDate=req.query.toDate.date("YYYY-MM-DD");
	var toTime=req.query.toTime;
	var searchResultFile=null;
	
	console.log('searchString:'+searchString);
	console.log('environment:'+environment);
	console.log('fromDate:'+fromDate);
	console.log('fromDate:'+fromDate);
	console.log('fromTime:'+fromTime);
	console.log('toDate:'+toDate);
	console.log('toTime:'+toTime);
	
	/*
	 *Check for the current search parameters in the search history log 
	 */
	var searchId=searchString+'_'+environment+'_'+fromDate+'_'+fromTime+'_'+toDate+'_'+toTime;
	searchId=searchId.replace(/[: ]/g,'_');
	searchResultFile=searchId+'.txt';
	console.log('searchResultFile'+searchResultFile);
	
	
	for(var i=0;i<searchHistory.search_history.length;i++){
		var  searchLogEntry=searchHistory.search_history[i];
		if(searchId == configName){
			searchFileExists = true;
			
		}
	}
	console.log('searchFileExists'+searchFileExists);

	
	/*
	 * Checks if the SearchResultFile already exists 
	 * Creates SearchResultFile if not already present.
	 * 
	 */
//	var searchResultFile=searchString+'_'+environment+'_'+fromDate+'_'+fromTime+'_'+toDate+'_'+toTime+'.txt';

	fs.stat(searchResultFile, function(err, stat) {
		if(err == null) {
			console.log('File exists');
		} else if(err.code == 'ENOENT') {
			fs.writeFile(searchResultFile,'');
		} else {
			console.log('Some other error: ', err.code);
		}
	});

	/*
	 * Gets all the file names in the Log Directory and ,
	 * Inputs the file names to the Search Function
	 */
	function getFiles (dir, files_){
		files_ = files_ || [];
		var files = fs.readdirSync(dir);
		for (var i in files){
			var name = dir + '/' + files[i];
			if (fs.statSync(name).isDirectory()){
				getFiles(name, files_);
			} else {
				files_.push(name);
			}
		}
		return files_;
	}

	var fileList=getFiles('../LogParser/Logs');
	console.log(fileList);

	for (var i in fileList){
		console.log(fileList[i]);
		searchText(fileList[i]);
	}
	
	
	/*
	 * Search Logs Function 
	 */	
	//Create separate interfaces for GunZip and  text files 
		function searchText(filename) {
			if(filename.indexOf('gz')>-1){
				rl = readline.createInterface({
					input: fs.createReadStream(filename).pipe(zlib.createUnzip()),
					terminal: false
				})
			}
			else {
				rl = readline.createInterface({
					input: fs.createReadStream(filename),
					terminal: false
				})
			}
	
   // Search for the keyword and timestamps
		rl.on('line', function(line) {
			var idx = line.indexOf(searchString);
			if (idx !== -1) {

				var wordsArray = line.split(' ');
				var logTimeStamp= wordsArray[0]+' '+wordsArray[1].split(',')[0];
				var logTimeStamp=logTimeStamp.replace(/[\[\]]/g,'');
				var logTimeStamp=logTimeStamp.replace(/ /g,'T');
				console.log(logTimeStamp);

				var logDate=new Date(logTimeStamp);
//				console.log(isValidDate(logDate)+'ValidTimestamp:'+logDate);
//				console.log(Object.prototype.toString.call(logDate));
				
				if(isValidDate(logDate)){
					
					console.log('ValidTimestamp:'+logTimeStamp);
					fs.appendFile(searchResultFile,line+'\n', function (err) {
					});
				}


			}
		});
		
		/*
		 * Validates if input is date
		 */
		function isValidDate(d) {
			  if ( Object.prototype.toString.call(d) !== "[object Date]" )
			    return false;
			  return !isNaN(d.getTime());
			}
		


	}


		var result='<a href="download/acme-doc-2.0.1.txt" download="searchResultFile.txt">Download Text</a>';
		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.write(result);
		res.end();
	




};