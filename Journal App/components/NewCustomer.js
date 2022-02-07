import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isNumeric, getWindowValues } from '../numeric.js';

export default class NewCustomer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			full_name: '',
			address: '',
			ph_num: '',
			bcolours: ['black', 'black', 'black'],
			jobData: this.props.route.params.job_data,
			custData: this.props.route.params.cust_data,
			pass: this.props.route.params.password,
			ip: this.props.route.params.server,
			button: false

		}
	}

	callBackend = async () => {
		let checkform = [!isAlphaNumeric(this.state.full_name, false), !isAlphaNumeric(this.state.address, false), !isNumeric(this.state.ph_num)]
		let newColours = []
		checkform.forEach(async (element) => {
			if (element == false) {
				newColours.push('black')
			} else {
				newColours.push('red')
			}
		})
		await this.setState({bcolours: newColours})
		
		if (this.state.bcolours.every((element) => {return(element == 'black')})) {
			this.setState({button:true})
			

				
	
			let payload = { pass: this.state.pass, name: this.state.full_name, address: this.state.address,
												ph_num: this.state.ph_num}
			try {
				var response = await axios.post(this.state.ip + "NewCust", payload)
				if (this.state.jobData.length == 0) {
					this.props.navigation.navigate( 'Data', {server: this.state.ip, pass: this.state.pass});
				} else {
					let cust_id = Object.values(response.data)[0].id
					let payload = { pass: this.state.pass, job_desc: this.state.jobData.job_desc, job_address: this.state.jobData.job_address,
														est_time: this.state.jobData.est_time, quote: this.state.jobData.quote,
													 	cust_id: cust_id}

					var response = await axios.post(this.state.ip + "NewJob", payload)
					this.props.navigation.navigate( 'Data', {server: this.state.ip, pass: this.state.pass});
				}
			} catch (error) {
				console.log(error);
				this.setState({button:false})
			}		
			
			

		} else {
			alert('Imports wrong types')
		}
	};

  	render() {
        	return (
				<View style={styles(this.state).container}>
					<View style={styles(this.state).innerView}>
						<Text style={styles(this.state).headers}>Name *</Text>
				 		<TextInput
				        style={styles(this.state).nameInput}
				        onChangeText={(e) => this.setState({ full_name: e})}
				      	/>
						<Text style={styles(this.state).headers}>Address *</Text>
						<TextInput
				        style={styles(this.state).addressInput}
				        onChangeText={(e) => this.setState({ address: e})}
				      	/>
						<Text style={styles(this.state).headers}>Phone</Text>
						<TextInput
				        style={styles(this.state).phoneInput}
				        onChangeText={(e) => this.setState({ ph_num: e})}
				      	/>
	
						<View style={styles(this.state).buttonConfirmContainer}>
							<TouchableOpacity 
								disabled={this.state.button}
								style={styles(this.state).buttonConfirm}
					        	onPress={this.callBackend}
					        	activeOpacity={0.4}>
					        	<Text>Confirm</Text>
					      	</TouchableOpacity>
						</View>
					</View>
				</View>
			)			
 
  	}
}

const {height, rem, width} = getWindowValues()

const styles = (state) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EBECF4',

	},
	innerView: {
    	padding: 50 * rem,
    	paddingTop: 110 * rem,
    	height: height,
    	width: width		
	},
	headers:{
		textAlign: "center",
    	justifyContent: "center",
    	fontSize: 20 * rem
	},
	nameInput: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 1 * rem,
	    paddingLeft: 10 * rem,
	   	fontSize: 20 * rem,
	    borderColor: Object.values(state.bcolours)[0]	

	},
	addressInput: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 1 * rem,
	    paddingLeft: 10 * rem,
	  	fontSize: 20 * rem,
	    borderColor: Object.values(state.bcolours)[1]	
	},
	phoneInput: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 1 * rem,
	    paddingLeft: 10 * rem,
	    fontSize: 20 * rem,
	    borderColor: Object.values(state.bcolours)[2]	
	},
	buttonConfirmContainer: {
		flexDirection: 'row',
		padding: 20 * rem,
    	justifyContent: "center",
	},
	buttonConfirm: {
		backgroundColor: 'lightblue',
		padding: 10 * rem,
		flexDirection: 'row',
		borderWidth: 1 * rem
  }
});

