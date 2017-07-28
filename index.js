const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("", "");
var https = require('https');
var fs = require('fs');

var cursor;
var employee_names = [];

var token = '';


/*
	Dropbox file handling
*/

/*
	INIT CURSOR
*/
rapid.call('Dropbox', 'getFolderContents', { 
	'accessToken': token,
	'folderPath': '/rapid-api-upload'
}).on('success', (payload)=>{
	cursor = payload[0].cursor;
}).on('error', (payload)=>{
	console.log(payload);
});

function downloadFile(path_to_file){
	rapid.call('Dropbox', 'downloadFile', { 
		'accessToken': token,
		//need to use path_to_file instead
		'filePath': path_to_file
	}).on('success', (payload)=>{
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
		console.log(payload);
		console.log(payload[0].entries);
		files = payload[0].entries;
		if(files.length > 0){
			for(var i = 0; i < files.length; i++)
			if(files[i]['.tag'] == 'file'){
				path = files[i].path_lower
				filename = path.replace(/^.*[\\\/]/, '');
				ind = filename.indexOf('-');
				name = filename.substring(0, ind);
				if(!employee_names.includes(name)){
					employee_names.push(name);
				}
				console.log(names);
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




