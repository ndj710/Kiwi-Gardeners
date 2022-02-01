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
port = process.env.PORT || 5000;
app.use(cors());


http
  .createServer(
    app
  )
  .listen(8003, '0.0.0.0', () => {
    console.log("serever is runing at port 8003");
  });


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'journal_db'
})

setInterval(function () {
    connection.query('SELECT 1');
    console.log('Refresh alivetime')
}, 5000);




checkpw = async (password) => {
	key = '';
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
	var password = Object.keys(req.body)[0];
	let check = await checkpw(password);
	res.send(check);
})


app.post("/EditJob", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')
	let job_desc = datalist[1].replaceAll('"', '')
	let address = datalist[3].replaceAll('"', '')
	let est_time = datalist[5].replaceAll('"', '')
	let quote = datalist[6].replaceAll('"', '')
	if (quote == '') {
		quote = 'null'
	}
	let job_status = datalist[7].replaceAll('"', '')
	let id = datalist[8].replaceAll('"', '')
	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q1 = 'UPDATE jobs SET job_desc="' + job_desc
				+ '", job_address="' + address + '", est_time=' + est_time 
				+ ', quote=' + quote + ', job_status="' + job_status + '" WHERE id=' + id; 

		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q1);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/EditCust", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')
	let full_name = datalist[1].replaceAll('"', '')
	let address = datalist[2].replaceAll('"', '')
	let ph_number = datalist[3].replaceAll('"', '')
	let id = datalist[4].replaceAll('"', '')
	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q1 = 'UPDATE customers SET full_name="' + full_name + '", address="' + address + '", ph_num="' + ph_number + '" WHERE id=' + id; 
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q1);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/DeleteJob", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')
	let id = datalist[1].replaceAll('"', '')
	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q1 = 'DELETE FROM jobs WHERE id=' + id; 
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q1);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/DeleteCust", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')
	let id = datalist[1].replaceAll('"', '')
	let check = await checkpw(password);
	if (check == 'Password is correct') {
		try {
		let q1 = 'DELETE FROM customers WHERE id=' + id; 
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q1);
		res.send('Done')
		} catch {
			res.send('Cannot delete')
		}
	} else {
		res.send('Something broke')
	}
		
})

app.post("/SearchJob", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')

	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q = 'SELECT jobs.id, full_name, ph_num, job_desc, job_address, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs LEFT JOIN customers ON customers.id = jobs.cust_id WHERE job_status = "Ongoing"'
		+ ' ORDER BY created_at DESC';
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q);
		res.send(result);
	}
})

app.post("/SearchCustomer", async (req, res) => {

	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')

	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q = 'SELECT * FROM customers ORDER BY full_name';
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q);
		res.send(result);
	}
})

app.post("/SearchAllJobs", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')
	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q = 'SELECT jobs.id, full_name, ph_num, job_desc, job_address, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs LEFT JOIN customers ON customers.id = jobs.cust_id ORDER BY created_at DESC';
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q);
		res.send(result);
	}
})


app.post("/NewJob", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')
	let password = datalist[0].replaceAll('"', '')
	let job_desc = datalist[1].replaceAll('"', '')
	let job_address = datalist[2].replaceAll('"', '')
	let est_time = datalist[3].replaceAll('"', '')
	if (est_time.length == 0){
		est_time = 'null'
	}
	let quote = datalist[4].replaceAll('"', '')
	if (quote.length == 0){
		quote = 'null'
	}
	let cust_id = datalist[5].replaceAll('"', '')
	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q = 'INSERT INTO jobs (job_desc, job_address, est_time, quote, cust_id) ' +
				'VALUES ("' + job_desc + '","' + job_address + '",' + est_time + ',' + quote + ',' + cust_id + ');';
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q);
		res.send('Done')
	} else {
		res.send('Something broke')
	}
		
})

app.post("/NewCust", async (req, res) => {
	let datalist = Object.keys(req.body)[0].split(',')

	let password = datalist[0].replaceAll('"', '')
	let full_name = datalist[1].replaceAll('"', '')
	let address = datalist[2].replaceAll('"', '')
	let ph_num = datalist[3].replaceAll('"', '')
	let check = await checkpw(password);
	if (check == 'Password is correct') {
		let q = 'INSERT INTO customers (full_name, address, ph_num) ' +
				'VALUES ("' + full_name + '","' + address + '",' + ph_num + ');';
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q);
		let getid = 'SELECT id FROM customers ORDER BY date_added DESC LIMIT 1;';
		var id = await query(getid);

		res.send(id)
	} else {
		res.send('Something broke')
	}
		
})
