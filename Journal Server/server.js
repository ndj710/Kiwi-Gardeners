const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require('mysql');
const crypto = require('crypto');
const util = require('util');
const http = require('http');
const fs = require('fs');
const nodemailer = require('nodemailer');
var MersenneTwister = require('mersenne-twister');


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
var generator = new MersenneTwister(parseInt(array[0].replace("\r", '')));



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: array[6].replace("\r", ''),
    pass: array[7].replace("\r", '')
  }
});

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

const key = array[5].replace("\r", '');
// Hashing original pw
/*
const password = array[4].replace("\r", '');


var q = 'UPDATE users SET user_password="' + value + '" WHERE username LIKE "%@gmail.com%"';
connection.query(q, function(error, results, fields) {
	if (error) throw error;
});
*/

checkpw = async (email, password) => {
	var hash = crypto.createHmac('sha512', key)
	hash.update(password)
	var value = hash.digest('hex')
	var q = 'SELECT user_password AS password, account_type AS account, id FROM users WHERE username="' + email + '"';
	try {
		const query = util.promisify(connection.query).bind(connection);
		var result = await query(q);
		if (result.length != 0) {
			if (value == result[0].password) {
				answer = {pass: 'correct', account: result[0].account, id: result[0].id};
			} else {
				answer = {pass: 'incorrect', account: result[0].account, id: result[0].id};
			}
			return(answer);
		}
	} catch (error) {
		console.log(error);
	}
}


app.post("/changepassword", async (req, res) => {
	try {
		var hash = crypto.createHmac('sha512', key)
		hash.update(req.body.pass)
		var value = hash.digest('hex')
		let q1 = 'UPDATE users SET user_password="' + value + '" WHERE username = "' + req.body.email + '"'
		const query = util.promisify(connection.query).bind(connection);
		let result = await query(q1);
		res.send('Done')
	} catch (error) {
		console.log(error)
	}	
	
})

  

app.post("/resetpassword", async (req, res) => {
	let rando = generator.random_int();
	while (rando < 100000) {
		rando = generator.random_int();
	}
	try {
		const mailOptions = {
		  from: array[6].replace("\r", ''),
		  to: req.body.email,
		  subject: 'Reset password code',
		  text: rando.toString()
		};
		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
			res.send('failed')
			console.log(error);
		  } else {
		   	res.send(rando.toString())
		  }
		});
	} catch (error) {
		res.send('failed')
		console.log(error)
	}
})

app.post("/login", async (req, res) => {
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		res.send(check);
	} catch (error) {
		console.log(error)
	}
})


app.post("/EditJob", async (req, res) => {
	console.log('broke at editjob')
	try {
		let quote = req.body.quote
		if (quote.length == 0) {
			quote = 'null'
		}
		let emps = req.body.empData
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct') {
			if (check.account == 'ADMIN') {
				let q1 = 'UPDATE jobs SET job_desc="' + req.body.job_desc
						+ '", job_address="' + req.body.job_address + '", est_time=' + req.body.est_time 
						+ ', quote=' + quote + ', job_status="' + req.body.status + '", comments="' + req.body.comments + '" WHERE id=' + req.body.id; 
		
				const query = util.promisify(connection.query).bind(connection);
				let result = await query(q1);
				let job_id = req.body.id
				if (emps.length != 0) {
					let delemps = await query('DELETE FROM on_job WHERE job_id=' + job_id);
					emps.forEach(async element => {
						let addemp = await query('INSERT INTO on_job (job_id, user_id) VALUES (' + job_id + ',' + element + ')');
					})
				} else {
					let delemps = await query('DELETE FROM on_job WHERE job_id=' + job_id);
				}
			} else if (check.account == 'EMP') {
				let q1 = 'UPDATE jobs SET comments="' + req.body.comments + '" WHERE id=' + req.body.id; 
				const query = util.promisify(connection.query).bind(connection);
				let result = await query(q1);
			}
			res.send('Done')
		} else {
			res.send('Something broke')
		}
	} catch (error) {
		console.log(error)
	}
		
})

app.post("/EditCust", async (req, res) => {
	console.log('broke at editcust')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q1 = 'UPDATE customers SET full_name="' + req.body.full_name + '", address="' + req.body.address + '", ph_num="' + req.body.ph_num + '" WHERE id=' + req.body.id; 
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q1);
			res.send('Done')
		} else {
			res.send('Something broke')
		}
	} catch (error) {
		console.log(error)
	}	
})

app.post("/EditEmp", async (req, res) => {
	console.log('broke at editemp')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q1 = 'UPDATE users SET full_name="' + req.body.full_name + '", username="' + req.body.emp_email + '" WHERE id=' + req.body.id; 
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q1);
			res.send('Done')
		} else {
			res.send('Something broke')
		}
	} catch (error) {
		console.log(error)
	}	
})

app.post("/DeleteJob", async (req, res) => {
	console.log('broke at deletejob')
	try {
		let id = req.body.id
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			const query = util.promisify(connection.query).bind(connection);
			let deleteq = await query('DELETE FROM on_job WHERE job_id=' + id)
			let result = await query('DELETE FROM jobs WHERE id=' + id)
			res.send('Done')
		} else {
			res.send('Something broke')
		}
	} catch (error) {
		console.log(error)
	}			
})

app.post("/DeleteCust", async (req, res) => {
	console.log('broke at deletecust')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
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
	} catch (error) {
		console.log(error)
	}			
})

app.post("/DeleteEmp", async (req, res) => {
	console.log('broke at deleteemp')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			try {
			let q1 = 'DELETE FROM users WHERE id=' + req.body.id; 
			const query = util.promisify(connection.query).bind(connection);
			let delemps = await query('DELETE FROM on_job WHERE user_id=' + req.body.id);
			let result = await query(q1);
			res.send('Done')
			} catch {
				res.send('Cannot delete')
			}
		} else {
			res.send('Something broke')
		}
	} catch (error) {
		console.log(error)
	}			
})

app.post("/SearchJob", async (req, res) => {
	console.log('broke at searchjob')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q = 'SELECT jobs.id AS id, full_name, ph_num, address AS cust_address, job_desc, job_address, comments, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs LEFT JOIN customers ON customers.id = jobs.cust_id WHERE job_status = "Ongoing"'
			+ ' ORDER BY created_at DESC';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send(result);
		} else if (check.pass == 'correct' && check.account == 'EMP') {
			let q = 'SELECT jobs.id AS id, full_name, ph_num, address AS cust_address, job_desc, job_address,' +
			'comments, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs ' +
			'LEFT JOIN customers ON jobs.cust_id = customers.id JOIN on_job ON on_job.job_id = jobs.id' +
			' WHERE on_job.user_id = ' + req.body.id + ' AND job_status = "Ongoing"'
			+ ' ORDER BY created_at DESC';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send(result);
		}
	} catch (error) {
		console.log(error)
	}	
})

app.post("/SearchCustomer", async (req, res) => {
	console.log('broke at searchcust')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q = 'SELECT * FROM customers ORDER BY full_name';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send(result);
		}
	} catch (error) {
		console.log(error)
	}
})

app.post("/SearchOnJob", async (req, res) => {
	console.log('broke at search on job')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct') {
			let q = 'SELECT job_id, full_name FROM on_job JOIN users ON users.id = on_job.user_id ORDER BY full_name';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send(result);
		}
	} catch (error) {
		console.log(error)
	}
})

app.post("/SearchEmp", async (req, res) => {
	console.log('broke at SearchEmp')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q = 'SELECT id, full_name, username AS email FROM users WHERE account_type="EMP" ORDER BY id';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send(result);
		}
	} catch (error) {
		console.log(error)
	}	
})

app.post("/SearchCompleteJobs", async (req, res) => {
	console.log('broke at searchcomplete')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q = 'SELECT jobs.id AS id, full_name, ph_num, address AS cust_address, job_desc, job_address, comments, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs LEFT JOIN customers ON customers.id = jobs.cust_id WHERE job_status = "Complete"'
			+ ' ORDER BY created_at DESC';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send(result);
		} else if (check.pass == 'correct' && check.account == 'EMP') {
			let q = 'SELECT jobs.id AS id, full_name, ph_num, address AS cust_address, job_desc, job_address,' +
			'comments, IFNULL(est_time, "NA") AS est_time, IFNULL(quote, "NA") as quote, job_status FROM jobs ' +
			'LEFT JOIN customers ON jobs.cust_id = customers.id JOIN on_job ON on_job.job_id = jobs.id' +
			' WHERE on_job.user_id = ' + req.body.id + ' AND job_status = "Complete"'
			+ ' ORDER BY created_at DESC';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send(result);
		}
	} catch (error) {
		console.log(error)
	}
})


app.post("/NewJob", async (req, res) => {
	console.log('broke at new job')
	try {
		let est_time = req.body.est_time
		let quote = req.body.quote
		if (quote.length == 0) {
			quote = 'null'
		}
		let emps = req.body.empData
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q = 'INSERT INTO jobs (job_desc, job_address, est_time, quote, cust_id) ' +
					'VALUES ("' + req.body.job_desc + '","' + req.body.job_address + '",' + 
					est_time + ',' + quote + ',' + req.body.cust_id + ');';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			if (emps.length != 0) {
				let job_idq = 'SELECT id FROM jobs ORDER BY id DESC LIMIT 1'
	
				let job_id = await query(job_idq);
				job_id = job_id[0].id
				emps.forEach(async element => {
					let q3 = 'INSERT INTO on_job (job_id, user_id) VALUES (' + job_id + ',' + element + ')'
					let addemp = await query(q3);
				})
	
			}
			res.send('Done')
		} else {
			res.send('Something broke')
		}
	} catch (error) {
		console.log(error)
	}
})

app.post("/NewCust", async (req, res) => {
	console.log('broke at new cust')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
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
	} catch (error) {
		console.log(error)
	}
})

app.post("/NewEmp", async (req, res) => {
	console.log('broke at new emp')
	try {
		let check = await checkpw(req.body.email, req.body.pass);
		if (check.pass == 'correct' && check.account == 'ADMIN') {
			let q = 'INSERT INTO users (full_name, username) ' +
					'VALUES ("' + req.body.name + '","' + req.body.emp_email + '");';
			const query = util.promisify(connection.query).bind(connection);
			let result = await query(q);
			res.send('Done')
		} else {
			res.send('Something broke')
		}
	} catch (error) {
		console.log(error)
	}
})

