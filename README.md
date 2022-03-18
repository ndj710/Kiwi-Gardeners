# Note:
This is an ongoing project and is my first experience with JavaScript, Node.js and React. There is room for a lot of improvements which will be addressed as I gain more experience.

# Kiwi-Gardeners Mobile Application
Kiwi Gardeners is a landscaping business who had issues with tracking job information. This is a mobile application made in React Native to assist with storing customer, employee and job data and facilitate the scheduling of tasks.

## Screenshots

<div>
  <h5>Loading/Login</h5>
  <img src="/screenshots/loadinglogo.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/loginscreenblank.jpg?raw=true" width="200" height="400"/>
  <h5>Current/Complete jobs</h5>
  <img src="/screenshots/currentjobsblank.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/currentjobs.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/completejobsblank.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/completejobs.jpg?raw=true" width="200" height="400"/>
  <h5>Customers/Employees</h5>
  <img src="/screenshots/customers.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/newcustomer.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/employees.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/newemployee.jpg?raw=true" width="200" height="400"/>
  <h5>New Job/Date Selection/Edit Job</h5>
  <img src="/screenshots/newjob.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/dateforjob.jpg?raw=true" width="200" height="400"/>
  <img src="/screenshots/editjob.jpg?raw=true" width="200" height="400"/>
</div>

### Changes made:
* Fix searchbar on re-entering window
* Add loading status to certain tasks
* Add icon
* Remove customer phone being compulsory
* Allow "," in addresses
* Fix new job - Customer selection not working as intended
* Setup automatic updates
* Fix search box breaking when large amount of jobs in database
* Fix render when large amount of jobs in database
* Fix duplicate key issue on new jobs with same customers
* Add links to addresses (opens in google maps) and links to phones (opens in phone) to call easily
* Improve list performance
* Add employee accounts
* Attach employees to jobs which allows them to view and comment on that job when they login
* Add dates for jobs and order jobs on date
* Allow spaces in phone numbers
* Fix scrolling keyboard
* Add the ability to go to next textinput with enter key

### Changes to implement:
* Improve visuals of job layout
* Add functionality for recurring jobs
* Add functionality for emailing invoices to customers
