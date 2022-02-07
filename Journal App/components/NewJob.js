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
			open: false,
			value: null,
			items: [{id: 0, label: 'New Customer', value: 'NewCustomer'}],
			id: null,
			
			job_desc: '',
			job_address: '',
			hours: '',
			minutes: '',
			quote: '',
			cust_id: '',


			bcolours: ['black', 'black', 'black', 'black', 'black', 'black'],
			customerData: this.props.route.params.cust_data,
			jobData: this.props.route.params.job_data,
			pass: this.props.route.params.password,
			confirmButton: 'Confirm',
			ip: this.props.route.params.server,
			newCust: false,
			button: false
		}
		this.setValue = this.setValue.bind(this);
	}

	callBackend = async () => {
		
		let checkform = [!isAlphaNumeric(this.state.job_desc, false), !isAlphaNumeric(this.state.job_address, false), !isNumeric(this.state.hours), !isNumeric(this.state.minutes), !isNumeric(this.state.quote)]
		
		let result = true
		if (this.state.value != null) {
			result = false
			this.setState({cust_id: this.state.id})
			let name = this.state.value
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
			let payload = { pass: this.state.pass, job_desc: this.state.job_desc, job_address: this.state.job_address,
												est_time: est_time, quote: this.state.quote,
											 	cust_id: this.state.cust_id}
	
			try {
				var response = await axios.post(this.state.ip + "NewJob", payload)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', { server: this.state.ip, pass: this.state.pass} );
				}
			} catch (error) {
				console.log(error);
				alert('Network error')
				this.setState({button:false})
			}
		} else if (this.state.bcolours.every((element) => {return(element == 'black')}) && this.state.newCust == true) {
				this.props.navigation.navigate('New Customer', { server: this.state.ip, job_data: {job_desc: this.state.job_desc, job_address: this.state.job_address, 
				est_time, quote: this.state.quote}, cust_data: [], password: this.state.pass })
		} else {
			alert('Invalid input(s)')
		}
	};


	componentDidMount() {

		if (this.state.customerData.length != 0) {
			this.state.customerData.forEach(element => this.state.items.push({id: element.id, label: element.full_name, value: element.full_name}))			
		} else {
			let payload = { pass: this.state.pass }
			var search = 'SearchCustomer'					
			axios
		  		.post(this.state.ip + search, payload)
		  		.then(response => {
		     		return response.data
		  		})
		  		.then(val => { 
					this.setState({ customerData: val });	
			  		this.state.customerData.forEach(element => this.state.items.push({id: element.id, label: element.full_name, value: element.full_name}))		
		  		})
		  		.catch(error => {
		     		console.log(error)
		  		})
		}

	}

  	setValue(callback) {
    	this.setState(state => ({
      		value: callback(state.value)
    	}));
  	}
	
 	setItems(callback) {
    	this.setState(state => ({
      		items: callback(state.items)
    	}));
  	}

  	render() {
        	return (
				<View style={styles(this.state).container}>
					<View style={styles(this.state).innerContainer}>
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
		      	
		      	
		      		  	<Text style={styles(this.state).headers}>Customer *</Text>
	    
					    <DropDownPicker
					    	style={{
								backgroundColor: 'white',
								height: 40 * rem,
							    borderWidth: 2 * rem,
							    borderColor: Object.values(this.state.bcolours)[5],
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
					        open={this.state.open}
					        value={this.state.value}
					        items={this.state.items}
					        setOpen={() => {
										if (this.state.open) {
											this.setState({open: false})
										} else {
											this.setState({open: true})
										}
									}}
					        setValue={this.setValue}
					        setItems={this.setItems}
					        onSelectItem={(item) => {
								this.setState({id: item.id})
								if (item.value == 'NewCustomer') {
									this.setState({confirmButton: 'Next'})
								} else {
									this.setState({confirmButton: 'Confirm'})					
								}
							}}
					
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

