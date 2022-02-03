import React from 'react';
import { StyleSheet, Text, Button, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isNumeric, convertTime } from '../numeric.js';

export default class EditCustomer extends React.Component {
	_isMounted = false;
	time = convertTime(this.props.route.params.items.est_time);
	constructor(props) {
		super(props)
		this.state = {
			id: this.props.route.params.items.id,
			full_name: this.props.route.params.items.full_name,
			address: this.props.route.params.items.address,
			ph_num: this.props.route.params.items.ph_num,
			pass: this.props.route.params.password,
			ip: this.props.route.params.server,
			bcolours: ['black', 'black', 'black'],
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
			let payload = [ this.state.pass, this.state.full_name,
												this.state.address, this.state.ph_num, this.state.id]
			let data = JSON.stringify(payload)

			try {

				var response = await axios.post(this.state.ip + "EditCust", data)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {server: this.state.ip, pass: this.state.pass});
				} else {
					alert('Something broke')
					this.setState({button:false})
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			alert('Imports wrong types')
		}
	};

	deleteJob = async () => {
			let payload = [ this.state.pass, this.state.id ]
			let data = JSON.stringify(payload)
			try {
				var response = await axios.post(this.state.ip + "DeleteCust", data)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {server: this.state.ip, pass: this.state.pass});
				} else if (response.data == 'Cannot delete') {
					alert("Can't delete customer with jobs")
				} else {
					alert('Something broke')
					this.setState({button:false})
				}
			} catch (error) {
				console.log(error);
			}
	}
	createTwoButtonAlert = () =>
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: this.deleteJob }
      ]
    );


  	render() {
        	return (
				<View style={styles(this.state).container}>
					<View style={styles(this.state).buttonCont}>
					<TouchableOpacity 
						style={styles(this.state).button}
			        	onPress={this.createTwoButtonAlert}
			        	activeOpacity={0.4}>
			        	<Text>Delete</Text>
			      	</TouchableOpacity>
			      	</View>
			      	<Text style={styles(this.state).headers}>Name *</Text>

					<TextInput
			        style={styles(this.state).nameInput}
			        defaultValue={this.state.full_name}
			        onChangeText={(e) => this.setState({ full_name: e})}
			      	/>

					<Text style={styles(this.state).headers}>Address *</Text>
					<TextInput
			        style={styles(this.state).addressInput}
			        defaultValue={this.state.address}
			        onChangeText={(e) => this.setState({ address: e})}
			      	/>
			      	<Text style={styles(this.state).headers}>Phone *</Text>
					<TextInput
			        style={styles(this.state).phoneInput}
			        defaultValue={this.state.ph_num}
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
	buttonCont: {
		flexDirection: 'row',

    	justifyContent: "flex-end",

	},
	button: {
		backgroundColor: 'pink',
		padding: 20,
		flex: 0.2,
		flexDirection: 'row',
		borderWidth: 1
	},
	container: {
		flex: 1,
		padding: 50,
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

