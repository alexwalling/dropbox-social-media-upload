const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("default-application_5947e9b9e4b023d4b55e2d4b", "d2494848-1781-4a42-b9d3-c378074cc993");
var https = require('https');
var fs = require('fs');

var file = fs.createWriteStream("file.jpg");


rapid.call('Dropbox', 'downloadFile', { 
	'accessToken': '3KdYdieRFCUAAAAAAAAEsgFFcFHQH6aS9cZ1V63sbKpD0uCNEZW9F9OvocLjgZ2e',
	'filePath': '/rapid-api-upload/bolt.png'
}).on('success', (payload)=>{
	 console.log(payload);
	 console.log(payload.file);
	 var request = https.get(payload.file, function(response) {
	  response.pipe(file);
	});
}).on('error', (payload)=>{
	 /*YOUR CODE GOES HERE*/ 
});