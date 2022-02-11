import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { getWindowValues, isAlphaNumeric } from '../numeric.js';
import axios from 'axios';
import * as Crypto from 'expo-crypto';


const {height, rem, width} = getWindowValues()

export default class ResetPassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			ip: this.props.route.params.server,
			code: this.props.route.params.code,
			email: this.props.route.params.email,
			text: '',
			pass: '',
			confirmpass: '',
			codevalid: false,
			signin: false,
			signinbutton: 'CHANGE PASSWORD'
		}
	}

  	callBackend = async () => {
		this.setState({signin: true, signinbutton: <ActivityIndicator color="black" size="small"  />})
		if (isAlphaNumeric(this.state.pass, false) && isAlphaNumeric(this.state.confirmpass, false)) {
			if (this.state.pass == this.state.confirmpass){
				const hashed_pw = await Crypto.digestStringAsync(
					Crypto.CryptoDigestAlgorithm.SHA256,
			    	this.state.confirmpass
				);
				let payload = { email: this.state.email, pass: hashed_pw }
				await axios
			  		.post(this.state.ip + "changepassword", payload)
			  		.then(response => {
			     		return response.data
			  		})
			  		.then(val => {
						this.props.navigation.navigate( 'Login');
			  		})
			  		.catch(error => {
			     		console.log(error)
			  		})
			} else {
				alert("Passwords do not match")
				this.setState({signin: false, signinbutton: 'SIGN IN'})
			}
		} else {
			alert('Invalid inputs')
			this.setState({signin: false, signinbutton: 'SIGN IN'})
		}
	};

	handleTextChange = (val) => {
		this.setState({ text: val });
		if (this.state.code.toString() == val) {
			this.setState({codevalid: true})
		}
	}
	
	handlePassChange = (val) => {
		this.setState({ pass: val });
	}
	
	handleConfirmChange = (val) => {
		this.setState({ confirmpass: val });
	}
	
  	render() {
        	return (
				<View style={styles(this.state).container}>
				 		<TextInput
				        style={styles(this.state).codeInput}
				        placeholder={"Code from email"}
	       				onChangeText={this.handleTextChange}
				      	/>
				      	
				 		{this.state.codevalid && <TextInput
				 		secureTextEntry={true}
				        style={styles(this.state).newPassword}
				        placeholder={"New password"}
	       				onChangeText={this.handlePassChange}
				      	/>}
				      	
				 		{this.state.codevalid && <TextInput
				 		secureTextEntry={true}
				        style={styles(this.state).confirmPassword}
				        placeholder={"Confirm password"}
	       				onChangeText={this.handleConfirmChange}
				      	/>}
						{this.state.codevalid && <TouchableOpacity 
							disabled={this.state.signin}
							style={styles(this.state).button}
				        	onPress={this.callBackend}
				        	activeOpacity={0.4}>
				        	<Text style={styles(this.state).confirm}>{this.state.signinbutton}</Text>
				      	</TouchableOpacity>}
				</View>
			)			
 
  	}
}



const styles = (state) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EBECF4',
		alignItems: 'center'
	},
	codeInput: {
		marginTop: 50 * rem,
		padding: 10 * rem,
		backgroundColor: 'white',
		borderRadius: 20 * rem,
		fontSize: 20 * rem
	},
	newPassword: {
		marginTop: 50 * rem,
		padding: 10 * rem,
		backgroundColor: 'white',
		borderRadius: 20 * rem,
		fontSize: 20 * rem
	},
	confirmPassword: {
		marginTop: 50 * rem,
		padding: 10 * rem,
		backgroundColor: 'white',
		borderRadius: 20 * rem,
		fontSize: 20 * rem
	},
  input: {
	backgroundColor: '#ebecf4',
    flex: 0.8,
    marginLeft: 80 * rem,
    fontSize: 20 * rem,
    height: 40 * rem
  },
  button: {
	backgroundColor: '#43913f',
	marginTop: 40 * rem,
	width: width * 0.5,
	flex: 0.1,
	alignItems: 'center',
	justifyContent: 'center'
  },
  confirm: {
	fontSize: 20 * rem
  }
});

