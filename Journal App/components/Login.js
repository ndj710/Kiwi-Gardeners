import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import * as Crypto from 'expo-crypto';
import { isAlphaNumeric, getWindowValues } from '../numeric.js';
import { text } from './inputs';


var ip = text()

export default class Login extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			password: ''
		}
	}
	handleChange = (val) => {
		this.setState({ password: val });
	}
  	callBackend = async () => {
		if (isAlphaNumeric(this.state.password)) {
			
		
		const hashed_pw = await Crypto.digestStringAsync(
			Crypto.CryptoDigestAlgorithm.SHA256,
		    this.state.password
		);
		var network_error = false;
		try {
			var response = await axios.post(ip + "login", hashed_pw)
		} catch (error) {
			network_error = true;
			console.log(error);
		}
		if (network_error == false) {
			if (response.data == 'Password is correct') {
				this.props.navigation.navigate('Data', {server: ip, pass: hashed_pw });
				this.textInput.clear()
				this.setState({ password: ''})
			} else {
				alert('Incorrect password');
			}
		} else {
			alert('Network error');
		}
		} else {
			alert('wrong data type')
		}
	};

	render() {

  return (

    <View style={styles.container}>
    
    
      	<Text style={styles.txt}>Enter password</Text>
      	<View style={{flexDirection: 'row', flex: 0.05}}>
 		<TextInput ref={input => { this.textInput = input }}
      	secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        onChangeText={this.handleChange}
      	/>
      	</View>
		<TouchableOpacity 
			style={styles.button}
        	onPress={this.callBackend}
        	activeOpacity={0.4}>
        	<Text style={styles.confirm}>Confirm</Text>
      	</TouchableOpacity>
      
    </View>
  );
}
}

const {height, rem, width} = getWindowValues()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
	padding: 10 * rem,
	fontSize: 20 * rem
  },
  input: {
	backgroundColor: 'white',
    flex: 0.3,
    paddingLeft: 10 * rem,
    borderWidth: 1 * rem,
    fontSize: 20 * rem
  },
  button: {
	backgroundColor: 'lightblue',
	paddingTop: 8 * rem,
	paddingBottom: 8 * rem,
	paddingLeft: 5 * rem,
	paddingRight: 5 * rem,
	margin: 15 * rem,
    borderWidth: 1 * rem	
  },
  confirm: {
	fontSize: 20 * rem
  }
});



