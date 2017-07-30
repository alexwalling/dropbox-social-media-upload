const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("*************************", "********************************");
var https = require('https');
var fs = require('fs');
var unirest = require('unirest');

var cursor;
var employee_names = [];
var employee_ids = [];
var collection;

var token = '***********************';
var mashape_token = '*****************************';
var mashape_token2 = '********************************';


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
	return new Promise((resolve, reject) => {
		rapid.call('Dropbox', 'downloadFile', { 
			'accessToken': token,
			//need to use path_to_file instead
			'filePath': path_to_file
		}).on('success', (payload)=>{
			//make the file based on the filename passed in
			var filename = path_to_file.replace(/^.*[\\\/]/, '');
			var file = fs.createWriteStream(filename);
			var request = https.get(payload.file, function(response) {
				response.pipe(file);
			});
			getCursor();
		}).on('error', (payload)=>{
			console.log(payload);
		});
		resolve('success');
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
		files = payload[0].entries;
		if(files.length > 0){
			for(var i = 0; i < files.length; i++)
			if(files[i]['.tag'] == 'file'){
				path = files[i].path_lower
				filename = path.replace(/^.*[\\\/]/, '');
				ind = filename.indexOf('-');
				name = filename.substring(0, ind);
				if(!employee_names.includes(name)){
					downloadFile(path).then(res => {
						//need promise here
						var id = enroll_employee(filename, name);
						console.log(id);
						console.log(name);
						employee_names.push(name);
						employee_ids.push(id);
					}).catch(res => {
						console.log(res);
					});
				} else {
					update_employee(path, name);
				}
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



/*
	TrueFace.ai Facial Recognition Functionality
*/

/*
	INIT collection for all office employees
*/
unirest.post("https://trueface.p.mashape.com/collection")
.header("X-Mashape-Key", mashape_token)
.header("X-Mashape-Host", "trueface.p.mashape.com")
.header("Content-Type", "application/x-www-form-urlencoded")
.send("name=Office Employees")
.send("")
.end(function (result) {
  collection = result.body.data.collection_id;
});

function enroll_employee(img_path, employee_name){
	unirest.post("https://trueface.p.mashape.com/enroll")
		.header("X-Mashape-Key", mashape_token2)
		.attach("img0", fs.createReadStream(img_path))
		.field("name", employee_name)
		.end(function (result) {
		  return result.body.data.enrollment_id;
		});

}

function update_employee(img_path, employee_name){
	unirest.put("https://trueface.p.mashape.com/enroll")
		.header("X-Mashape-Key", mashape_token2)
		.field("enrollment_id", employee_name)
		.attach("img0", fs.createReadStream(img_path))
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
		});
}
