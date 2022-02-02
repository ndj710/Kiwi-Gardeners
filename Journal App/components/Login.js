import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import * as Crypto from 'expo-crypto';
import { isAlphaNumeric } from '../numeric.js';
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
				this.props.navigation.navigate('Data', { server: ip, pass: hashed_pw });
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
        	<Text>Confirm</Text>
      	</TouchableOpacity>
      
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
	padding: 10
  },
  input: {
	backgroundColor: 'white',
    flex: 0.3,
    paddingLeft: 10,
    borderWidth: 1
  },
  button: {
	backgroundColor: 'lightblue',
	paddingTop: 8,
	paddingBottom: 8,
	paddingLeft: 5,
	paddingRight: 5,
	margin: 15,
    borderWidth: 1	
  }
});



