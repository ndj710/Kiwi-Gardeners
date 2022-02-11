import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isNumeric, getWindowValues } from '../numeric.js';
import DropDownPicker from 'react-native-dropdown-picker';

const {height, rem, width} = getWindowValues()



export default class NewJob extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			custOpen: false, empOpen: false,
			custValue: null, empValue: [],
			custItems: [{customer_id: 0, label: 'New Customer', value: 'NewCustomer'}], empItems : [],
			cust_id: '', emp_ids: [],
			
			job_desc: '',
			job_address: '',
			hours: '',
			minutes: '',
			quote: '',


			bcolours: ['black', 'black', 'black', 'black', 'black', 'black'],
			customerData: this.props.route.params.cust_data,
			empData: this.props.route.params.emp_data,
			jobData: this.props.route.params.job_data,
			pass: this.props.route.params.password,
			email: this.props.route.params.email,
			confirmButton: 'Confirm',
			ip: this.props.route.params.server,
			newCust: false,
			button: false
		}
		this.setCustValue = this.setCustValue.bind(this);
		this.setEmpValue = this.setEmpValue.bind(this);
	}

	callBackend = async () => {
		console.log(this.state.emp_ids)
		let checkform = [!isAlphaNumeric(this.state.job_desc, false), !isAlphaNumeric(this.state.job_address, false), !isNumeric(this.state.hours), !isNumeric(this.state.minutes), !isNumeric(this.state.quote)]
		
		let result = true
		if (this.state.custValue != null) {
			result = false
			let name = this.state.custValue
			if (name == 'NewCustomer'){
				this.setState({newCust: true})
			}
		}
		checkform.push(result)
		
		let newColours = []
		checkform.forEach(async (element) => {
			if (element == false) {
				newColours.push('black')
			} else {
				newColours.push('red')
			}
		})
		await this.setState({bcolours: newColours})
		
		var est_time = 0
		est_time = est_time + parseInt(this.state.hours)*60 || est_time + 0
		est_time = est_time + + parseInt(this.state.minutes) || est_time + 0
		if (est_time == 0){
			est_time = null
		}
		
		
		if (this.state.bcolours.every((element) => {return(element == 'black')}) && this.state.newCust == false) {
			this.setState({button:true})
			let payload = { email: this.state.email, pass: this.state.pass, job_desc: this.state.job_desc, job_address: this.state.job_address,
												est_time: est_time, quote: this.state.quote,
											 	cust_id: this.state.cust_id, empData: this.state.emp_ids }
	
			try {
				var response = await axios.post(this.state.ip + "NewJob", payload)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {reload: true, server: this.state.ip, email: this.state.email, pass: this.state.pass} );
				}
			} catch (error) {
				console.log(error);
				alert('Network error')
				this.setState({button:false})
			}
		} else if (this.state.bcolours.every((element) => {return(element == 'black')}) && this.state.newCust == true) {
				this.props.navigation.navigate('New Customer', { server: this.state.ip, job_data: {job_desc: this.state.job_desc, job_address: this.state.job_address, 
				est_time, quote: this.state.quote}, empData: this.state.emp_ids, cust_data: [], email: this.state.email, password: this.state.pass })
		} else {
			alert('Invalid input(s)')
		}
	};


	componentDidMount() {
		if (this.state.customerData.length != 0) {
			this.state.customerData.forEach(element => this.state.custItems.push({customer_id: element.id, label: element.full_name, value: element.full_name}))			
		}
		if (this.state.empData.length != 0) {
			this.state.empData.forEach(element => this.state.empItems.push({emp_id: element.id, label: element.email, value: element.email}))		
		}
	}
	
  	setEmpValue(callback) {
    	this.setState(state => ({
      		empValue: callback(state.empValue)
    	}));
  	}
  	
	setEmpItems(callback) {
    	this.setState(state => ({
      		empItems: callback(state.empItems)
    	}));
  	}
  	

  	setCustValue(callback) {
    	this.setState(state => ({
      		custValue: callback(state.custValue)
    	}));
  	}
	
 	setCustItems(callback) {
    	this.setState(state => ({
      		custItems: callback(state.custItems)
    	}));
  	}

  	render() {
        	return (
				<View style={styles(this.state).container}>
					<View style={styles(this.state).innerContainer}>
		      		  	<Text style={styles(this.state).headers}>Employees</Text>
					    <DropDownPicker
					        multiple={true}
					    	zIndex={3000}
    						zIndexInverse={1000}
					    	style={{
								backgroundColor: 'white',
								height: 40 * rem,
							    borderWidth: 2 * rem,
							    borderColor: 'black',
							    marginBottom: 10 * rem
							}}
							textStyle={{
								fontSize: 16 * rem	
							}}
					    	listMode="FLATLIST"
					    	placeholder="Select employee(s)"
					        open={this.state.empOpen}
					        value={this.state.empValue}
					        items={this.state.empItems} 
					        itemKey="emp_id"
					        showTickIcon={true}
					        setOpen={() => {
										if (this.state.empOpen) {
											this.setState({empOpen: false})
										} else {
											this.setState({empOpen: true})
										}
									}}
					        onSelectItem={(item) => {
								this.setState({emp_ids: []})
								let new_list = []
								item.forEach(element => {
									new_list.push(element.emp_id)
								})
								this.setState({emp_ids: new_list})
							}}
					        setValue={this.setEmpValue}
					        setItems={this.setItems}
					      />
		      		  	<Text style={styles(this.state).headers}>Customer *</Text>
					    <DropDownPicker
					        zIndex={2000}
    						zIndexInverse={2000}
					    	style={{
								backgroundColor: 'white',
								height: 40 * rem,
							    borderWidth: 2 * rem,
							    borderColor: Object.values(this.state.bcolours)[5],
							    marginBottom: 10 * rem
							}}
							textStyle={{
								fontSize: 16 * rem	
							}}
							containerStyle={{
								
							}}
					    	listMode="FLATLIST"
					    	placeholder="Select a customer"
					    	searchPlaceholder="Type customer name here"
					      	searchable={true}
					        open={this.state.custOpen}
					        value={this.state.custValue}
					        items={this.state.custItems} 
					        itemKey="customer_id"
					        showTickIcon={false}
					        setOpen={() => {
										if (this.state.custOpen) {
											this.setState({custOpen: false})
										} else {
											this.setState({custOpen: true})
										}
									}}
					        setValue={this.setCustValue}
					        setItems={this.setCustItems}
					        onSelectItem={(item) => {
								this.setState({cust_id: item.customer_id})
								if (item.value == 'NewCustomer') {
									this.setState({confirmButton: 'Next'})
								} else {
									this.setState({confirmButton: 'Confirm'})					
								}
							}}
					      />
						<Text style={styles(this.state).headers}>Job description *</Text>
				 		<TextInput
				        style={styles(this.state).job_input}
				        onChangeText={(e) => this.setState({ job_desc: e})}
				      	/>
						<Text style={styles(this.state).headers}>Job Address *</Text>
						<TextInput
				        style={styles(this.state).address_input}
				        onChangeText={(e) => this.setState({ job_address: e})}
				      	/>
				      	<Text style={styles(this.state).headers}>Estimated time</Text>
				      	<View style={{ flexDirection: 'row'}}>
							<TextInput
					        style={styles(this.state).hour_input}
					        onChangeText={(e) => this.setState({ hours: e})}
					      	/>
					      	<Text style={styles(this.state).time}>hour(s)</Text>
							<TextInput
					        style={styles(this.state).minute_input}
					        onChangeText={(e) => this.setState({ minutes: e})}
					      	/>
					      	<Text style={styles(this.state).time}>minutes</Text>
				      	</View>
				      	<Text style={styles(this.state).headers}>Quote (dollars)</Text>
						<TextInput
				        style={styles(this.state).quote_input}
				        onChangeText={(e) => this.setState({ quote: e})}
				      	/>
		      	
						<View style={styles(this.state).buttonConfirmContainer}>
							<TouchableOpacity 
								disabled={this.state.button}
								style={styles(this.state).buttonConfirm}
					        	onPress={() => {this.callBackend()}}
					        	activeOpacity={0.4}>
					        	<Text style={styles(this.state).confirmButtonText}>{this.state.confirmButton}</Text>
					      	</TouchableOpacity>
						</View>
					</View>
				</View>
			)			
 
  	}
}



const styles = (state) => StyleSheet.create({
	time: {
		paddingTop: 20 * rem,
		textAlign: "center",
    	justifyContent: "center",
    	fontSize: 20 * rem
	},
	cust: {
		paddingBottom: 10 * rem
	},
	container: {
		flex: 1,
		backgroundColor: '#EBECF4',
	},
	innerContainer: {
    	padding: 50 * rem,
    	paddingTop: 100 * rem,
    	height: height,
    	width: width
	},
	headers:{
		textAlign: "center",
    	fontSize: 20 * rem,
    	margin: 5 * rem
	},
	custName:{
		paddingTop: 20 * rem,
		marginLeft: 18 * rem,
    	fontSize: 20 * rem
	},

	confirm: {
		paddingTop: 50 * rem
	},
	job_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[0],
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem	
	},
	address_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[1],
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem		
	},
	hour_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    flex: 0.5,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[2],
	    paddingLeft: 10 * rem,		
	    fontSize: 20 * rem	
	},
	minute_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	   	flex: 0.5,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[3],
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem		
	},
	quote_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[4],
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem		
	},
	buttonConfirmContainer: {
		flexDirection: 'row',
		padding: 20 * rem,
    	justifyContent: "center",
    	paddingTop: 100 * rem
	},
	buttonConfirm: {
		backgroundColor: 'lightblue',
		padding: 10 * rem,
		minHeight: 50 * rem,
		minWidth: 100 * rem,
		flexDirection: 'row',
    	justifyContent: "center",
		borderWidth: 1 * rem
  },
  confirmButtonText: {
	fontSize: 20 * rem
}
	
});

