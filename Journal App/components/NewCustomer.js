import React from 'react';
import { StyleSheet, Text, Button, View, TextInput } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isNumeric } from '../numeric.js';

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
		let checkform = [!isAlphaNumeric(this.state.full_name, false), !isAlphaNumeric(this.state.address, false), !isNumeric(this.state.ph_num, false)]
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
			

				
	
			let payload = [ this.state.pass, this.state.full_name, this.state.address,
												this.state.ph_num]
			let data = JSON.stringify(payload)
			try {
				var response = await axios.post(this.state.ip + "NewCust", data)
				if (this.state.jobData.length == 0) {
					this.props.navigation.navigate( 'Data', {server: this.state.ip, pass: this.state.pass});
				} else {
					let cust_id = Object.values(response.data)[0].id
					let payload = [ this.state.pass, this.state.jobData.job_desc, this.state.jobData.job_address,
														this.state.jobData.est_time, this.state.jobData.quote,
													 	cust_id]
					let data = JSON.stringify(payload)
					var response = await axios.post(this.state.ip + "NewJob", data)
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
					<Text style={styles(this.state).headers}>Phone *</Text>
					<TextInput
			        style={styles(this.state).phoneInput}
			        onChangeText={(e) => this.setState({ ph_num: e})}
			      	/>

			      	<Button disabled={this.state.button}
			        onPress={this.callBackend}
			        style={styles(this.state).confirm, { backgroundColor: 'blue' }}
			        title='Confirm'>
			      	</Button>
				</View>
			)			
 
  	}
}

const styles = (state) => StyleSheet.create({
	container: {
		flex: 1,
		padding: 100,
		backgroundColor: '#EBECF4',
		textAlign: "center",
    	justifyContent: "center"
	},
	headers:{
		textAlign: "center",
    	justifyContent: "center",
    	fontSize: 20
	},
	input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 1,
	    padding: 10,
	},
	confirm: {
		paddingTop: 50
	},
	nameInput: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 1,
	    padding: 10,
	    borderColor: Object.values(state.bcolours)[0]	
	},
	addressInput: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 1,
	    padding: 10,	
	    borderColor: Object.values(state.bcolours)[1]	
	},
	phoneInput: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 1,
	    padding: 10,
	    borderColor: Object.values(state.bcolours)[2]	
	}
});
