import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isNumeric, getWindowValues } from '../numeric.js';
import SearchableDropdown from 'react-native-searchable-dropdown';

const {height, rem, width} = getWindowValues()

export default class NewJob extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			job_desc: '',
			job_address: '',
			hours: '',
			minutes: '',
			quote: '',
			cust_id: '',
			selectedItems: {id: 0, name: 'New Customer'},
			items: [{id: 0, name: 'New Customer'}],
			bcolours: ['black', 'black', 'black', 'black', 'black', 'black'],
			customerData: this.props.route.params.cust_data,
			jobData: this.props.route.params.job_data,
			pass: this.props.route.params.password,
			confirmButton: 'Next',
			ip: this.props.route.params.server,
			newCust: false,
			button: false
		}
	}

	callBackend = async () => {
		
		let checkform = [!isAlphaNumeric(this.state.job_desc, false), !isAlphaNumeric(this.state.job_address, false), !isNumeric(this.state.hours), !isNumeric(this.state.minutes), !isNumeric(this.state.quote)]

		var result = false
		try {
			if (!isAlphaNumeric(Object.values(this.state.selectedItems)[1], false)) {
				result = false
			}
			let id = Object.values(this.state.selectedItems)[0]
			let name = Object.values(this.state.selectedItems)[1]
			
			if (name == 'New Customer'){
				this.setState({newCust: true})
			} else {
				this.state.customerData.forEach(async (element) => {
					if (!element.full_name == name && !element.id == id) {
						result = true
					}})				
			}

		} catch {
			result = true			
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
		
		if (this.state.bcolours.every((element) => {return(element == 'black')}) && this.state.newCust == false) {
			let est_time = 0
			est_time = est_time + parseInt(this.state.hours)*60 || est_time + 0
			est_time = est_time + + parseInt(this.state.minutes) || est_time + 0
			if (est_time == 0){
				est_time = null
			}
			this.setState({button:true})
			let payload = [ this.state.pass, this.state.job_desc, this.state.job_address,
												est_time, this.state.quote,
											 	this.state.cust_id]
			let data = JSON.stringify(payload)
			try {
				var response = await axios.post(this.state.ip + "NewJob", data)
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
				est_time: parseInt(this.state.hours)*60 + parseInt(this.state.minutes), quote: this.state.quote}, cust_data: [], password: this.state.pass })
		} else {
			alert('Invalid input(s)')
		}
	};


	componentDidMount() {

		if (this.state.customerData.length != 0) {
			this.state.customerData.forEach(element => this.state.items.push({id: element.id, name: element.full_name}))			
		} else {
			let payload = [ this.state.pass, '']
			let data = JSON.stringify(payload)
			var search = 'SearchCustomer'					
			axios
		  		.post(this.state.ip + search, data)
		  		.then(response => {
		     		return response.data
		  		})
		  		.then(val => { 
					this.setState({ customerData: val });	
			  		this.state.customerData.forEach(element => this.state.items.push({id: element.id, name: element.full_name}))	
		  		})
		  		.catch(error => {
		     		console.log(error)
		  		})
		}

	}



  	render() {
        	return (
				<View style={styles(this.state).container}>
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
			        <View style={styles(this.state).customerBox}>
			        	<Text style={styles(this.state).custName}>Currently selected: {this.state.selectedItems.name} </Text>
			        

			        </View>
	      		  	
		          	<SearchableDropdown
			            onItemSelect={(item) => {
							if (item.name == 'New Customer') {
								this.setState({confirmButton: 'Next'})
							} else{
								this.setState({confirmButton: 'Confirm'})
							}
			              	this.setState({ selectedItems: item, cust_id: item.id });
			            }}
			            containerStyle={{ padding: 5 * rem }}
			            itemStyle={{
			              padding: 10* rem,
			              marginTop: 2* rem,
			              backgroundColor: '#ddd',
			              borderColor: '#bbb',
			              borderWidth: 1* rem,
			              borderRadius: 5* rem,
			            }}
			            itemTextStyle={{ color: '#222' }}
			            itemsContainerStyle={{ maxHeight: 140* rem }}
			            items={this.state.items}
			            resetValue={false}
			            textInputProps={
			              {
			                placeholder: "Select a customer",
			                defaultValue: "New Customer",
			                style: {
								backgroundColor: 'white',
							    height: 40 * rem,
							    margin: 12 * rem,
							    borderWidth: 2 * rem,
	    						borderColor: Object.values(this.state.bcolours)[5],
							    paddingLeft: 10 * rem,
							    fontSize: 20 * rem
			                },
			              }
			            }
			            listProps={
			              {
			                nestedScrollEnabled: true,
			              }
			            }
			        />
			        

			        
					<View style={styles(this.state).buttonConfirmContainer}>
						<TouchableOpacity 
							disabled={this.state.button}
							style={styles(this.state).buttonConfirm}
				        	onPress={this.callBackend}
				        	activeOpacity={0.4}>
				        	<Text style={styles(this.state).confirmButtonText}>{this.state.confirmButton}</Text>
				      	</TouchableOpacity>
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
		padding: 50 * rem,
		backgroundColor: '#EBECF4',
		textAlign: "center",
    	justifyContent: "center"
	},
	headers:{
		textAlign: "center",

    	fontSize: 20 * rem
	},
	custName:{
		paddingTop: 20 * rem,
		marginLeft: 18 * rem,
    	fontSize: 20 * rem
	},
	input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 1 * rem,
	    padding: 10 * rem,
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
	},
	address_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[1],
	    paddingLeft: 10 * rem,		
	},
	hour_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    flex: 0.5,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[2],
	    paddingLeft: 10 * rem,		
	},
	minute_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	   	flex: 0.5,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[3],
	    paddingLeft: 10 * rem,		
	},
	quote_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[4],
	    paddingLeft: 10 * rem,		
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

