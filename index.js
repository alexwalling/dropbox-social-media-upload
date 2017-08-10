require('dotenv').config();

const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI(process.env.APPLICATION, process.env.RAPIDAPI);
const https = require('https');
const fs = require('fs');
const unirest = require('unirest');

let cursor;
let employee_names = [];
let employee_ids = [];
let collection;

/*
	---------------------
	Dropbox file handling
	---------------------
*/

/*
	INIT CURSOR
*/
rapid.call('Dropbox', 'getFolderContents', { 
	'accessToken': process.env.RAPIDAPI_TOKEN,
	'folderPath': '/rapid-api-upload'
}).on('success', (payload)=>{
	cursor = payload[0].cursor;
	//console.log(payload[0].entries);
}).on('error', (payload)=>{
	console.log(payload);
});

/*
	Download the image
*/
function downloadFile(path_to_file){
	console.log(path_to_file);
	return new Promise((resolve, reject) => {
		rapid.call('Dropbox', 'downloadFile', { 
			'accessToken': process.env.RAPIDAPI_TOKEN,
			//need to use path_to_file instead
			'filePath': path_to_file
		}).on('success', (payload)=>{
			//make the file based on the filename passed in
			let filename = path_to_file.replace(/^.*[\\\/]/, '');
			let file = fs.createWriteStream(filename);
			let request = https.get(payload.file, function(response) {
				response.pipe(file);
			});
			getCursor();
			file.on('finish', function() {
				resolve('success');
			});

			//resolve('success');
		}).on('error', (payload)=>{
			reject('you suck')
		});
	});
}

/*
	checking if anything has changed in the designated folder. 
*/
function checkForUpload(){
	rapid.call('Dropbox', 'paginateFolderContents', { 
		'accessToken': process.env.RAPIDAPI_TOKEN,
		'cursor': cursor
	}).on('success', (payload)=>{
		files = payload[0].entries;
		if(files.length > 0){
			for(let i = 0; i < files.length; i++)
			if(files[i]['.tag'] == 'file'){
				path = files[i].path_lower
				filename = path.replace(/^.*[\\\/]/, '');
				//file name -> employee name
				ind = filename.indexOf('-');
				name = filename.substring(0, ind);
				if(!employee_names.includes(name)){
					downloadFile(path).then(res => {
						//need promise here
						let id = enroll_employee(filename, name);
						console.log(id);
						console.log(name);
					}).catch(res => {
						console.log(res);
					});
				} else {
					let employee_id = employee_ids[employee_names.indexOf(name)];
					console.log(employee_id);
					//update_employee(path, name);
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
	'accessToken': process.env.RAPIDAPI_TOKEN,
	'folderPath': '/rapid-api-upload'
	}).on('success', (payload)=>{
		cursor = payload[0].cursor;
	}).on('error', (payload)=>{
		console.log(payload);
	});
}


/*
	Webhook
*/
rapid.listen('Dropbox', 'webhookEvent', { 
	'token': process.env.RAPIDAPI_TOKEN
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
	--------------------------------------------
	TrueFace.ai Facial Recognition Functionality
	--------------------------------------------
*/

/*
	INIT collection for all office employees
*/
/*
unirest.post("https://trueface.p.mashape.com/collection")
	.header("X-Mashape-Key", process.env.MASHAPE_TOKEN_2)
	.header("Content-Type", "application/x-www-form-urlencoded")
	.header("Accept", "application/json")
	.send("name=Office Employees")
	.end(function (result) {
		console.log(result.status, result.headers, result.body);
	});
*/
/*
	update collection of employees
*/
function update_collection(collection_id, enrollment_id){
	unirest.put("https://trueface.p.mashape.com/collection")
		.header("X-Mashape-Key", process.env.MASHAPE_TOKEN_2)
		.header("Content-Type", "application/x-www-form-urlencoded")
		.header("Accept", "application/json")
		.send("collection_id=<required>")
		.send("enrollment_id=<required>")
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
		});
}

/*
	INIT enrollment for employee
*/
function enroll_employee(img_path, employee_name){
	console.log('ENROLLING: ' + employee_name);
	console.log('IMG PATH: ' + img_path);
	let employee_id;
	unirest.post("https://trueface.p.mashape.com/enroll")
		.header("X-Mashape-Key", process.env.MASHAPE_TOKEN_2)
		.attach("img0", fs.createReadStream(img_path))
		.field("name", employee_name)
		.end(function (result) {
			console.log(result.status, result.headers, result.body);
			employee_id = result.body.data.enrollment_id;
			employee_names.push(employee_name);
			employee_ids.push(employee_id);
		});

	/* This code from RapidAPI doesn't seem to work
	unirest.post("https://trueface.p.mashape.com/enroll")
		.header("X-Mashape-Key", process.env.MASHAPE_TOKEN)
		.header("X-Mashape-Host", "trueface.p.mashape.com")
		.header("Content-Type", "application/x-www-form-urlencoded")
		.send("img0=<required>")
		.send("img1=")
		.send("img2=")
		.send("img3=")
		.send("name=<required>")
		.send("")
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
		});
	*/

}

/*
	Update enrollment for existing employee
*/
function update_employee(img_path, employee_id){
	console.log('UPDATING: ' + employee_id);
	console.log('IMG PATH: ' + img_path);
	unirest.put("https://trueface.p.mashape.com/enroll")
		.header("X-Mashape-Key", "kkLAE9tdKfmshARl9UVANBrYk4RKp1xDfWFjsnimWVdTYzp6HS")
		.field("enrollment_id", employee_id)
		.attach("img0", fs.createReadStream(img_path))
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
		});


	/* This code from RapidAPI doesn't seem to work
	unirest.put("https://trueface.p.mashape.com/enroll")
		.header("X-Mashape-Key", process.env.MASHAPE_TOKEN)
		.header("X-Mashape-Host", "trueface.p.mashape.com")
		.header("Content-Type", "application/x-www-form-urlencoded")
		.send("enrollment_id=")
		.send("img0=<required>")
		.send("")
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
		});
	*/
}
