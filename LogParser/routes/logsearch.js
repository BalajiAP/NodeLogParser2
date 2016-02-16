var express = require('express');
var router = express.Router();
var fileCounter = 0;
var actualFileCount = 0;
var fileList;
var fs = require('fs'),
readline = require('readline'),
stream = require('stream');
var path = require('path');
var date=require("date-format-lite");
var zlib = require('zlib');
var moment=require('moment');
var dateFormat = require("date-format-lite");
var searchHistory=require('../search_history_log.json');
var mime = require('mime');
var userName;
/**
 * *******************************************
 * Function to display the Log search page
 * *******************************************
 */



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
	var fromDate=req.query.fromDate.date("YYYY-DD-MM");
	var fromTime=req.query.fromTime;
	var toDate=req.query.toDate.date("YYYY-DD-MM");
	var toTime=req.query.toTime;
	userName=req.query.userName;
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
	var appDir1 = path.dirname(require.main.filename);
	console.log("THE DIR IS " + appDir1);
	var b = appDir1+ '/userLogs/'+userName+'/' +searchResultFile;
	console.log(b);
	
	
	console.log('searchResultFile'+JSON.stringify(searchHistory));
	
	
	
	
	
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
			console.log("INSIDE ERROR");
			//fs.writeFile(appDir1+ '/userLogs/'+userName+'/' +searchResultFile,'');
		} else {
			console.log('Some other error: ', err.code);
		}
	});

	/*
	 * Gets all the file names in the Log Directory and ,
	 * Inputs the file names to the Search Function
	 */
	
	fs.exists(b, function(exists) { 
		  if (exists) { 
			  console.log("Exists");
			  var filename = path.basename(searchResultFile);
			  var appDir = path.dirname(require.main.filename);
			  res.write(appDir+ '/userLogs/'+userName+'/' +searchResultFile);	
			  res.end();
		  }else{
			   fileList=getFiles('../LogParser/Logs');
			   for (var i = 0; i < fileList.length; i++){
					console.log(fileList[i]);
					searchText(fileList[i],i);
					actualFileCount = fileList.length;		
					console.log("The value of i is " + i);
					console.log("The file list" + fileList.length);			
					//console.log(fileList.length);
				}
				console.log(fileList); 
		  }
		});
	
	
	function getFiles (dir, files_){
		files_ = files_ || [];
		console.log(files_);
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


	
	
	
	/*
	 * Search Logs Function 
	 */	
	//Create separate interfaces for GunZip and  text files 
		function searchText(filename,counter) {
			console.log("Entered into searchText");
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
				//var logTimeStamp=logTimeStamp.replace(/ /g,'T');
				var logDate=new Date(logTimeStamp);
							
				var fromDateStr = new Date(fromDate + " " + convertTo24Hour(fromTime));
				var toDateStr = new Date(toDate + " " + convertTo24Hour(toTime));
				var searchStr = new Date(logTimeStamp);
				//console.log("The value of fromDateStr" + fromDateStr);
				//console.log("The value of toDateStr" + toDateStr);

				var searchStr = new Date(logTimeStamp);
					//console.log(fromDateStr);
					//console.log(toDateStr);
					//console.log(searchStr);
					if(searchStr >  fromDateStr && searchStr < toDateStr){
						//console.log("Lines to be written to file " + line);
						fs.appendFile(appDir1+ '/userLogs/'+userName+'/' +searchResultFile,line+'\n', function (err) {
							

					});
				}
			}
			
		
		}).on('close',function(){
			fileCounter=counter;
			console.log("END OF THE FILE" +fileCounter);
			if(fileCounter+2>actualFileCount){
				console.log(fileCounter);
				console.log(actualFileCount);
				var filename = path.basename(searchResultFile);
				var appDir = path.dirname(require.main.filename);
				
				fs.appendFile(appDir+ '/searchHistory.txt','\n UserName :'+ userName+ '\t\t fileSearchKeywords\t' + filename.substring(0, filename.length - 3) + '\n', function (err) {
					

				});
				console.log("nside equal" +appDir+'/'+filename);
				res.write(appDir+ '/userLogs/'+userName+'/' +searchResultFile);	
				res.end();
			}
		}).on('end',function(){
			console.log("DONE");
			
		});
		
		
		/*
		 * Validates if input is date
		 */
	 function isValidDate(d) {
	 		  if ( Object.prototype.toString.call(d) !== "[object Date]" )
			    return false;
			  return !isNaN(d.getTime());
    	}
		
	 function convertTo24Hour(time)	{
		var hours = Number(time.match(/^(\d+)/)[1]);
	    var minutes = Number(time.match(/:(\d+)/)[1]);
	    var AMPM = time.match(/\s(.*)$/)[1];
	    if (AMPM == "PM" && hours < 12) hours = hours + 12;
	    if (AMPM == "AM" && hours == 12) hours = hours - 12;
	    var sHours = hours.toString();
	    var sMinutes = minutes.toString();
	    if (hours < 10) sHours = "0" + sHours;
	    if (minutes < 10) sMinutes = "0" + sMinutes;
	    var convertedTime = sHours + ":" + sMinutes;
	    return convertedTime;
	 }
     console.log("File written successfully");

     	//var result='<a href="download/acme-doc-2.0.1.txt" download="searchResultFile.txt">Download Text</a>';
		//res.writeHead(200, {'Content-Type': 'text/xml'});
		
	}


	



};