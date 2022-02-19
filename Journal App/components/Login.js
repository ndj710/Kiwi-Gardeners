import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, StatusBar, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as Crypto from 'expo-crypto';
import { isAlphaNumeric, getWindowValues, isValidEmail } from '../numeric.js';
import { text } from './inputs';
import * as SecureStore from 'expo-secure-store';

var ip = text()
const {height, rem, width} = getWindowValues()

export default class Login extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			fpass: false,
			password: '',
			email: '',
			signin: false,
			signinbutton: 'SIGN IN'
		}
	}
	
	handleEmailChange = (val) => {
		this.setState({ email: val });
	}
	
	handlePassChange = (val) => {
		this.setState({ password: val });
	}
	
  	callBackend = async () => {
		this.setState({signin: true, signinbutton: <ActivityIndicator color="black" size="small"  />})
  		await SecureStore.setItemAsync('email', this.state.email);
		if (isAlphaNumeric(this.state.password)) {
			const hashed_pw = await Crypto.digestStringAsync(
				Crypto.CryptoDigestAlgorithm.SHA256,
		    	this.state.password
			);
		let payload = { email: this.state.email, pass: hashed_pw }
		await axios
	  		.post(ip + "login", payload)
	  		.then(response => {
	     		return response.data
	  		})
	  		.then(val => {
				if (val.pass == 'correct') {
					let variables = {account: val.account, server: ip, id: val.id, email: this.state.email, pass: hashed_pw }
					if (val.account == 'ADMIN') {
						this.props.navigation.navigate('Data', variables)
					}
					if (val.account == 'EMP') {
						this.props.navigation.navigate('Emp Data', variables)
					}
					this.passInput.clear()
					this.setState({ password: '', signin: false, signinbutton: 'SIGN IN'})
				} else {
					alert('Incorrect email or password');
					this.setState({signin: false, signinbutton: 'SIGN IN'})
				}
	  		})
	  		.catch(error => {
				alert('Network error');
	     		console.log(error)
	     		this.setState({signin: false, signinbutton: 'SIGN IN'})
	  		})
		} else {
			alert('wrong data type')
			this.setState({signin: false, signinbutton: 'SIGN IN'})
		}
	};
	
	
	async componentDidMount() {
		this.setState({email: await SecureStore.getItemAsync('email')})
	}
	
	

	render() {

  return (
	<View style={styles.container}>
		<StatusBar
        	animated={true}
        />
    	<Image 
    		source={require('..//assets/login.png')} 
    		style={{ maxHeight: height * 0.37, maxWidth: width}}
    		/>
    	<Text style={{marginLeft: width * 0.7}}
    		disabled={this.state.fpass}
			onPress={async () => {
				this.setState({fpass: true})
				if (isValidEmail(this.state.email, false)) {
					let payload = { email: this.state.email }
					await axios
				  		.post(ip + "resetpassword", payload)
				  		.then(response => {
				     		return response.data
				  		})
				  		.then(val => {
							this.props.navigation.navigate('Reset Password', {server: ip, email: this.state.email, code: val})
							this.setState({fpass: false})
				  		})
				  		.catch(error => {
							alert('Invalid email or network error')
							this.setState({fpass: false})
				     		console.log(error)
				  		})			
				} else {
					this.setState({fpass: false})
					alert('Enter a valid email')
				}

			}}>
			Forgot password?</Text>
    	<View style={{flexDirection: 'row', flex: 0.1, marginTop: 40 * rem}}>
		   	<TextInput
	        	placeholder="Email"
	       		style={styles.input}
	       		onChangeText={this.handleEmailChange}
	       		defaultValue={this.state.email}
  			/>
      	</View>
  		<View style={{borderColor: 'grey', borderWidth: 1 * rem, width: width * 0.7, marginLeft: 75 * rem, marginBottom: 20}}></View>
      	<View style={{flexDirection: 'row', flex: 0.1}}>
	 		<TextInput ref={input => { this.passInput = input }}
		      	secureTextEntry={true}
		        style={styles.input}
		        placeholder="Password"
		        onChangeText={this.handlePassChange}
	      	/>
      	</View>
  		<View style={{borderColor: 'grey', borderWidth: 1 * rem, width: width * 0.7, marginLeft: 75 * rem}}></View>
		<TouchableOpacity 
			disabled={this.state.signin}
			style={styles.button}
        	onPress={this.callBackend}
        	activeOpacity={0.4}>
        	<Text style={styles.confirm}>{this.state.signinbutton}</Text>
      	</TouchableOpacity>
    </View>
  );
}
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebecf4',
    alignItems: 'flex-start'
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
	marginLeft: 75 * rem,
	marginTop: 20 * rem,

	width: width * 0.7,
	flex: 0.1,
	alignItems: 'center',
	justifyContent: 'center'
  },
  confirm: {
	fontSize: 20 * rem
  }
});



