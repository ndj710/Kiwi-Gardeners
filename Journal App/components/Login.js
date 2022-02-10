import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import axios from 'axios';
import * as Crypto from 'expo-crypto';
import { isAlphaNumeric, getWindowValues } from '../numeric.js';
import { text } from './inputs';
import * as SecureStore from 'expo-secure-store';

var ip = text()
const {height, rem, width} = getWindowValues()

export default class Login extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			password: '',
			email: ''
		}
	}
	
	handleEmailChange = (val) => {
		this.setState({ email: val });
	}
	
	handlePassChange = (val) => {
		this.setState({ password: val });
	}
	
  	callBackend = async () => {
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
				if (val.pass == 'correct' && val.account == 'ADMIN') {
					this.props.navigation.navigate('Data', {server: ip, email: this.state.email, pass: hashed_pw });
					this.passInput.clear()
					this.setState({ password: ''})
				} else {
					alert('Incorrect password');
				}
	  		})
	  		.catch(error => {
				alert('Network error');
	     		console.log(error)
	  		})
		} else {
			alert('wrong data type')
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
    	<View style={{flexDirection: 'row', flex: 0.1, marginTop: 80 * rem}}>
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
			style={styles.button}
        	onPress={this.callBackend}
        	activeOpacity={0.4}>
        	<Text style={styles.confirm}>SIGN IN</Text>
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
	marginTop: 40 * rem,

	width: width * 0.7,
	flex: 0.1,
	alignItems: 'center',
	justifyContent: 'center'
  },
  confirm: {
	fontSize: 20 * rem
  }
});



