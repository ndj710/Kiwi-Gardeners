var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");
var mysql = require('mysql');
var crypto = require('crypto');
const util = require('util');
var http = require('http');
var fs = require('fs');


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
port = process.env.PORT || 5000;
app.use(cors());


http
  .createServer(
    app
  )
  .listen(8003, '0.0.0.0', () => {
    console.log("Server is runing at port 8003");
  });

var array = fs.readFileSync('inputs.txt').toString().split("\n");

var connection = mysql.createConnection({
  host     : array[0].replace("\r", ''),
  user     : array[1].replace("\r", ''),
  password : array[2].replace("\r", ''),
  database : array[3].replace("\r", '')
})

setInterval(function () {
    connection.query('SELECT 1');
    console.log('Refresh alivetime')
}, 5000);


// Hashing original pw
const password = array[4].replace("\r", '');
const key = array[5].replace("\r", '');
var hash = crypto.createHmac('sha512', key)
hash.update(password)
var value = hash.digest('hex')
var q = 'UPDATE users SET user_password="' + value + '" WHERE username="dtimp"';
connection.query(q, function(error, results, fields) {
	if (error) throw error;
});

checkpw = async (password) => {
	var hash = crypto.createHmac('sha512', key)
	hash.update(password)
	var value = hash.digest('hex')
	var q = 'SELECT user_password AS password FROM users WHERE username="dtimp"';
	try {
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q);
		if (value == result[0].password) {
			answer = "Password is correct";
		} else {
			answer = "Password is wrong";
		}
		return(answer);
	} catch {
		console.log(error);
	}
}
  


app.post("/login", async (req, res) => {
	let check = await checkpw(req.body.pass);
	res.send(check);
})


app.post("/EditJob", async (req, res) => {
	console.log('broke at editjob')
	let quote = req.body.quote
	if (quote.length == 0) {
		quote = 'null'
	}
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q1 = 'UPDATE jobs SET job_desc="' + req.body.job_desc
				+ '", job_address="' + req.body.job_address + '", est_time=' + req.body.est_time 
				+ ', quote=' + quote + ', job_status="' + req.body.status + '", comments="' + req.body.comments + '" WHERE id=' + req.body.id; 

		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q1);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/EditCust", async (req, res) => {
	console.log('broke at editcust')
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q1 = 'UPDATE customers SET full_name="' + req.body.full_name + '", address="' + req.body.address + '", ph_num="' + req.body.ph_num + '" WHERE id=' + req.body.id; 
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q1);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/DeleteJob", async (req, res) => {
	console.log('broke at deletejob')
	let id = req.body.id
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q1 = 'DELETE FROM jobs WHERE id=' + id; 
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q1);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/DeleteCust", async (req, res) => {
	console.log('broke at deletecust')
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		try {
		let q1 = 'DELETE FROM customers WHERE id=' + req.body.id; 
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q1);
		res.send('Done')
		} catch {
			res.send('Cannot delete')
		}
	} else {
		res.send('Something broke')
	}
		
})

app.post("/SearchJob", async (req, res) => {
	console.log('broke at searchjob')
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q = 'SELECT jobs.id, full_name, ph_num, address AS cust_address, job_desc, job_address, comments, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs LEFT JOIN customers ON customers.id = jobs.cust_id WHERE job_status = "Ongoing"'
		+ ' ORDER BY created_at DESC';
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q);
		res.send(result);
	}
})

app.post("/SearchCustomer", async (req, res) => {
	console.log('broke at searchcust')
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q = 'SELECT * FROM customers ORDER BY full_name';
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q);
		res.send(result);
	}
})

app.post("/SearchCompleteJobs", async (req, res) => {
	console.log('broke at searchcomplete')
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q = 'SELECT jobs.id, full_name, ph_num, address AS cust_address, job_desc, job_address, comments, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs LEFT JOIN customers ON customers.id = jobs.cust_id WHERE job_status = "Complete"'
		+ ' ORDER BY created_at DESC';
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q);
		res.send(result);
	}
})


app.post("/NewJob", async (req, res) => {
	console.log('broke at new job')
	let est_time = req.body.est_time
	let quote = req.body.quote

	if (quote.length == 0) {
		quote = 'null'
	}

	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q = 'INSERT INTO jobs (job_desc, job_address, est_time, quote, cust_id) ' +
				'VALUES ("' + req.body.job_desc + '","' + req.body.job_address + '",' + 
				est_time + ',' + quote + ',' + req.body.cust_id + ');';
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/NewCust", async (req, res) => {
	console.log('broke at new cust')
	let check = await checkpw(req.body.pass);
	if (check == 'Password is correct') {
		let q = 'INSERT INTO customers (full_name, address, ph_num) ' +
				'VALUES ("' + req.body.name + '","' + req.body.address + '","' + req.body.ph_num + '");';
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q);
		let getid = 'SELECT id FROM customers ORDER BY date_added DESC LIMIT 1;';
		let id = await query(getid);
		res.send(id)
	} else {
		res.send('Something broke')
	}
		
})
