import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isValidEmail, getWindowValues } from '../numeric.js';


export default class EditEmp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			id: this.props.route.params.items.id,
			full_name: this.props.route.params.items.full_name,
			empEmail: this.props.route.params.items.email,
			pass: this.props.route.params.password,
			email: this.props.route.params.email,
			ip: this.props.route.params.server,
			bcolours: ['black', 'black'],
			button: false,
		}
	}


	callBackend = async () => {
		let checkform = [!isAlphaNumeric(this.state.full_name, false), !isValidEmail(this.state.empEmail, false)]
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
			let payload = { email: this.state.email, pass: this.state.pass, full_name: this.state.full_name,
												emp_email: this.state.empEmail, id: this.state.id}
			try {
				var response = await axios.post(this.state.ip + "EditEmp", payload)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {reload: true, server: this.state.ip, email: this.state.email, pass: this.state.pass});
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
			let payload = { email: this.state.email, pass: this.state.pass, id: this.state.id }
			try {
				var response = await axios.post(this.state.ip + "DeleteEmp", payload)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {reload: true, server: this.state.ip, email: this.state.email, pass: this.state.pass});
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
					<View style={styles(this.state).innerView}>
				      	<Text style={styles(this.state).headers}>Name *</Text>
						<TextInput
				        style={styles(this.state).nameInput}
				        defaultValue={this.state.full_name}
				        onChangeText={(e) => this.setState({ full_name: e})}
				      	/>
						<Text style={styles(this.state).headers}>Email *</Text>
						<TextInput
				        style={styles(this.state).addressInput}
				        defaultValue={this.state.empEmail}
				        onChangeText={(e) => this.setState({ empEmail: e})}
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
	buttonCont: {
		flexDirection: 'row',
		padding: 20 * rem,
    	justifyContent: "flex-end",

	},
	button: {
		backgroundColor: 'pink',
		padding: 10 * rem,
		flexDirection: 'row',
		borderWidth: 1 * rem
	},
	innerView: {
    	padding: 50 * rem,
    	paddingTop: 10 * rem,
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

