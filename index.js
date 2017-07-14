const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("default-application_5947e9b9e4b023d4b55e2d4b", "d2494848-1781-4a42-b9d3-c378074cc993");
var https = require('https');
var fs = require('fs');

var cursor;

var token = '3KdYdieRFCUAAAAAAAAEswylPWtNCejAgaLdy6-d4OKqwbdOZXeCgjO0C2zWHoyH';

/*
	INIT CURSOR
*/
rapid.call('Dropbox', 'getFolderContents', { 
	'accessToken': token,
	'folderPath': '/rapid-api-upload'
}).on('success', (payload)=>{
	cursor = payload[0].cursor;
	console.log(cursor);
	//console.log(payload[0].entries);
}).on('error', (payload)=>{
	console.log(payload);
});




function downloadFile(path_to_file){
	const RapidAPI = require('rapidapi-connect');
	const rapid = new RapidAPI("default-application_5947e9b9e4b023d4b55e2d4b", "d2494848-1781-4a42-b9d3-c378074cc993");

	console.log(path_to_file);
	rapid.call('Dropbox', 'downloadFile', { 
		'accessToken': token,
		//need to use path_to_file instead
		'filePath': path_to_file
	}).on('success', (payload)=>{
		console.log(payload);
		//make the file based on the filename passed in
		var filename = path_to_file.replace(/^.*[\\\/]/, '');
		console.log(filename);
		var file = fs.createWriteStream(filename);
		var request = https.get(payload.file, function(response) {
			response.pipe(file);
		});
		getCursor();
	}).on('error', (payload)=>{
		console.log(payload);	
	});
}

/*
	checking if anything has changed in out upload folder
*/
function checkForUpload(){
	rapid.call('Dropbox', 'paginateFolderContents', { 
		'accessToken': token,
		'cursor': cursor
	}).on('success', (payload)=>{
		console.log('SUCCESS');
		files = payload[0].entries;
		if(files.length > 0){
			console.log(files);
			console.log(files[0].path_lower);
			if(files[0]['.tag'] == 'file'){
				console.log('DOWNLOAD');
				downloadFile(files[0].path_lower);
			}
		}
		
	}).on('error', (payload)=>{
		/*YOUR CODE GOES HERE*/ 
	});
}

/*
	updating cursor after handling an upload
*/
function getCursor(){
	rapid.call('Dropbox', 'getFolderContents', { 
	'accessToken': token,
	'folderPath': '/rapid-api-upload'
	}).on('success', (payload)=>{
		cursor = payload[0].cursor;
		console.log(cursor);
	}).on('error', (payload)=>{
		console.log(payload);
	});
}


/*
	listening for webhooks
*/
rapid.listen('Dropbox', 'webhookEvent', { 
	'token': token
})
.on('join', () => {

})
.on('message', (message) => {
	checkForUpload();
})
.on('error', (error) => {
	console.log(error);
})
.on('close', (reason) => {

});