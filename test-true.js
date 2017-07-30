var mashape_token = 'wyS0DvDxPdmshgdpgoaAKtUVDq4Cp13xb8mjsn62zTNC0140Ow';
var unirest = require('unirest');
var fs = require('fs');

var img_path = 'morgan-1.jpg';
var employee_name = 'morgan';

/*unirest.post("https://trueface.p.mashape.com/enroll")
	.header("X-Mashape-Key", mashape_token)
	.header("X-Mashape-Host", "trueface.p.mashape.com")
	.header("Content-Type", "application/x-www-form-urlencoded")
	.send("img0=/"+img_path)
	.send("img1=")
	.send("img2=")
	.send("img3=")
	.send("name="+employee_name)
	.end(function (result) {
		console.log(result.status, result.headers, result.body);
	});
*/

unirest.post("https://trueface.p.mashape.com/enroll")
.header("X-Mashape-Key", "kkLAE9tdKfmshARl9UVANBrYk4RKp1xDfWFjsnimWVdTYzp6HS")
.attach("img0", fs.createReadStream("michael-1.jpg"))
.field("name", "morgan")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});
